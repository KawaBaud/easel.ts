import { Vector3 } from "../maths/Vector3.ts";

export class ShapeUtils {
	static calculateNormal(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		target = new Vector3(),
	): Vector3 {
		const edge1 = new Vector3().subVectors(v2, v1);
		const edge2 = new Vector3().subVectors(v3, v1);

		target.crossVectors(edge1, edge2);
		return target.lengthSq ? target.unitize() : target.set(0, 0, 1);
	}

	static isCounterClockwise(
		a: Vector3,
		b: Vector3,
		c: Vector3,
	): boolean {
		const ax = a.x, az = a.z;
		const bx = b.x, bz = b.z;
		const cx = c.x, cz = c.z;

		const signedArea = ((bx - ax) * (cz - az)) - ((bz - az) * (cx - ax));
		return signedArea > 0;
	}

	static triangulate(vertices: Vector3[]): Uint16Array<ArrayBuffer> {
		if (vertices.length < 3) return new Uint16Array();
		if (vertices.length === 3) return new Uint16Array([0, 1, 2]);
		if (vertices.length === 4) return new Uint16Array([0, 1, 3, 1, 2, 3]);

		const indices = new Uint16Array(vertices.length);
		for (let i = 0; i < vertices.length; i++) {
			indices[i] = i;
		}

		const triangles = new Uint16Array(vertices.length * 3);
		let triangleCount = 0;
		let remainingVertices = vertices.length;

		while (remainingVertices > 3) {
			let earFound = false;

			for (let i = 0; i < remainingVertices; i++) {
				const prev = (i === 0) ? remainingVertices - 1 : i - 1;
				const curr = i;
				const next = (i === remainingVertices - 1) ? 0 : i + 1;

				if (
					ShapeUtils.#isEar(
						indices,
						vertices,
						prev,
						curr,
						next,
						remainingVertices,
					)
				) {
					triangles[triangleCount++] = indices.safeAt(prev);
					triangles[triangleCount++] = indices.safeAt(curr);
					triangles[triangleCount++] = indices.safeAt(next);

					for (let j = curr; j < remainingVertices - 1; j++) {
						indices[j] = indices.safeAt(j + 1);
					}
					remainingVertices--;
					earFound = true;
					break;
				}
			}

			if (!earFound) break;
		}

		if (remainingVertices === 3) {
			triangles[triangleCount++] = indices.safeAt(0);
			triangles[triangleCount++] = indices.safeAt(1);
			triangles[triangleCount++] = indices.safeAt(2);
		}
		return triangles.slice(0, triangleCount);
	}

	static #isEar(
		indices: Uint16Array,
		vertices: Vector3[],
		prev: number,
		curr: number,
		next: number,
		count: number,
	): boolean {
		const a = vertices[indices.safeAt(prev)];
		const b = vertices[indices.safeAt(curr)];
		const c = vertices[indices.safeAt(next)];
		if ((!a || !b || !c) || !ShapeUtils.isCounterClockwise(a, b, c)) {
			return false;
		}

		for (let i = 0; i < count; i++) {
			if (i === prev || i === curr || i === next) continue;

			const p = vertices[indices.safeAt(i)];
			if (p && ShapeUtils.#pointInTriangle(p, a, b, c)) return false;
		}

		return true;
	}

	static #pointInTriangle(
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

		const dot00 = (v0x * v0x) + (v0z * v0z);
		const dot01 = (v0x * v1x) + (v0z * v1z);
		const dot02 = (v0x * v2x) + (v0z * v2z);
		const dot11 = (v1x * v1x) + (v1z * v1z);
		const dot12 = (v1x * v2x) + (v1z * v2z);

		const invDenom = 1 / ((dot00 * dot11) - (dot01 * dot01));

		const u = ((dot11 * dot02) - (dot01 * dot12)) * invDenom;
		const v = ((dot00 * dot12) - (dot01 * dot02)) * invDenom;
		return (u >= 0) && (v >= 0) && (u + v <= 1);
	}
}
