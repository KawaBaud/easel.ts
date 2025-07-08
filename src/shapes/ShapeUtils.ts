import { Vector3 } from "../maths/Vector3";

export const ShapeUtils = {
	calculateNormal(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		target = new Vector3(),
	): Vector3 {
		const edge1 = new Vector3().subVectors(v2, v1);
		const edge2 = new Vector3().subVectors(v3, v1);

		target.crossVectors(edge1, edge2);
		return target.lengthSq ? target.unitize() : target.set(0, 0, 1);
	},

	isCounterClockwise(a: Vector3, b: Vector3, c: Vector3): boolean {
		const ax = a.x;
		const az = a.z;
		const bx = b.x;
		const bz = b.z;
		const cx = c.x;
		const cz = c.z;

		const signedArea = (bx - ax) * (cz - az) - (bz - az) * (cx - ax);
		return signedArea > 0;
	},

	triangulate(vertices: Vector3[]): Uint16Array<ArrayBuffer> {
		if (vertices.length < 3) {
			return new Uint16Array();
		}
		if (vertices.length === 3) {
			return new Uint16Array([0, 1, 2]);
		}
		if (vertices.length === 4) {
			return new Uint16Array([0, 1, 3, 1, 2, 3]);
		}

		const indices = getIndices(vertices.length);
		const triangles = new Uint16Array(vertices.length * 3);
		const state = {
			triangleCount: 0,
			remainingVertices: vertices.length,
		};

		processEarClipping(vertices, indices, triangles, state);

		if (state.remainingVertices === 3) {
			addFinalTriangle(indices, triangles, state);
		}

		return triangles.slice(0, state.triangleCount);
	},
};

function addFinalTriangle(
	indices: Uint16Array,
	triangles: Uint16Array,
	state: { triangleCount: number },
): void {
	triangles[state.triangleCount++] = indices[0] ?? 0;
	triangles[state.triangleCount++] = indices[1] ?? 1;
	triangles[state.triangleCount++] = indices[2] ?? 2;
}

function addTriangle(
	indices: Uint16Array,
	triangles: Uint16Array,
	prev: number,
	curr: number,
	next: number,
	state: { triangleCount: number; remainingVertices: number },
): void {
	triangles[state.triangleCount++] = indices[prev] ?? 0;
	triangles[state.triangleCount++] = indices[curr] ?? 0;
	triangles[state.triangleCount++] = indices[next] ?? 0;
}

function findAndProcessEar(
	vertices: Vector3[],
	indices: Uint16Array,
	triangles: Uint16Array,
	state: { triangleCount: number; remainingVertices: number },
): boolean {
	for (let i = 0; i < state.remainingVertices; i++) {
		const prev = i === 0 ? state.remainingVertices - 1 : i - 1;
		const curr = i;
		const next = i === state.remainingVertices - 1 ? 0 : i + 1;

		if (isEar(indices, vertices, prev, curr, next, state.remainingVertices)) {
			addTriangle(indices, triangles, prev, curr, next, state);
			removeVertex(indices, curr, state);
			return true;
		}
	}
	return false;
}

function getIndices(length: number): Uint16Array {
	const indices = new Uint16Array(length);
	for (let i = 0; i < length; i++) {
		indices[i] = i;
	}
	return indices;
}

function isEar(
	indices: Uint16Array,
	vertices: Vector3[],
	prev: number,
	curr: number,
	next: number,
	count: number,
): boolean {
	const a = vertices[indices[prev] ?? 0];
	const b = vertices[indices[curr] ?? 0];
	const c = vertices[indices[next] ?? 0];
	if (!(a && b && c && ShapeUtils.isCounterClockwise(a, b, c))) {
		return false;
	}

	return !hasPointInTriangle(
		indices,
		vertices,
		prev,
		curr,
		next,
		count,
		a,
		b,
		c,
	);
}

function hasPointInTriangle(
	indices: Uint16Array,
	vertices: Vector3[],
	prev: number,
	curr: number,
	next: number,
	count: number,
	a: Vector3,
	b: Vector3,
	c: Vector3,
): boolean {
	for (let i = 0; i < count; i++) {
		if (i === prev || i === curr || i === next) {
			continue;
		}

		const idx = indices[i];
		if (idx === undefined || idx < 0 || idx >= vertices.length) {
			continue;
		}

		const p = vertices[idx];
		if (p && pointInTriangle(p, a, b, c)) {
			return true;
		}
	}
	return false;
}

function pointInTriangle(
	p: Vector3,
	a: Vector3,
	b: Vector3,
	c: Vector3,
): boolean {
	const v0x = c.x - a.x;
	const v0z = c.z - a.z;
	const v1x = b.x - a.x;
	const v1z = b.z - a.z;
	const v2x = p.x - a.x;
	const v2z = p.z - a.z;

	const dot00 = v0x * v0x + v0z * v0z;
	const dot01 = v0x * v1x + v0z * v1z;
	const dot02 = v0x * v2x + v0z * v2z;
	const dot11 = v1x * v1x + v1z * v1z;
	const dot12 = v1x * v2x + v1z * v2z;

	const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

	const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
	return u >= 0 && v >= 0 && u + v <= 1;
}

function processEarClipping(
	vertices: Vector3[],
	indices: Uint16Array,
	triangles: Uint16Array,
	state: { triangleCount: number; remainingVertices: number },
): void {
	while (state.remainingVertices > 3) {
		if (!findAndProcessEar(vertices, indices, triangles, state)) {
			break;
		}
	}
}

function removeVertex(
	indices: Uint16Array,
	curr: number,
	state: { triangleCount: number; remainingVertices: number },
): void {
	for (let j = curr; j < state.remainingVertices - 1; j++) {
		indices[j] = indices[j + 1] ?? 0;
	}
	state.remainingVertices--;
}
