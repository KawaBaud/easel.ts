import type { Camera } from "../../cameras/Camera.ts";
import { Frustum } from "../../maths/Frustum.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import "../../types.ts";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

export class ClippingContext {
	frustum = new Frustum();

	clipLine(start: Vector3, end: Vector3): Vector3[] | null {
		if (this.isPointVisible(start) && this.isPointVisible(end)) {
			return [start.clone(), end.clone()];
		}

		let t0 = 0;
		let t1 = 1;
		const dir = _v3.copy(end).sub(start);

		for (let i = 0; i < 6; i++) {
			const plane = this.frustum.planes.safeAt(i);
			const normal = plane.normal;
			const denom = normal.dot(dir);
			const dist = plane.distanceToPoint(start);

			if (denom === 0) {
				if (!this.#handleParallelLine(dist)) return null;
			} else {
				const result = this.#handleIntersectingLine(denom, dist, t0, t1);
				if (!result) return null;
				t0 = result.t0;
				t1 = result.t1;
			}
		}

		t0 = Math.max(0, t0);
		t1 = Math.min(1, t1);
		if (t0 > t1) return null;

		const clippedStart = _v1.copy(start).add(dir.clone().mulScalar(t0));
		const clippedEnd = _v2.copy(start).add(dir.clone().mulScalar(t1));

		return [clippedStart.clone(), clippedEnd.clone()];
	}

	clipTriangle(v1: Vector3, v2: Vector3, v3: Vector3): Vector3[][] {
		if (
			this.isPointVisible(v1) && this.isPointVisible(v2) &&
			this.isPointVisible(v3)
		) return [[v1.clone(), v2.clone(), v3.clone()]];

		let triangles = [[v1.clone(), v2.clone(), v3.clone()]];
		let newTriangles: Vector3[][] = [];

		for (let i = 0; i < 6; i++) {
			const plane = this.frustum.planes.safeAt(i);
			newTriangles = [];

			for (const triangle of triangles) {
				const d1 = plane.distanceToPoint(triangle.safeAt(0));
				const d2 = plane.distanceToPoint(triangle.safeAt(1));
				const d3 = plane.distanceToPoint(triangle.safeAt(2));

				const behindCount = (d1 < 0 ? 1 : 0) + (d2 < 0 ? 1 : 0) +
					(d3 < 0 ? 1 : 0);
				switch (behindCount) {
					case 0:
						newTriangles.push(triangle);
						break;
					case 1:
						newTriangles.push(
							...this.#handleOnePointBehind(triangle, d1, d2, d3),
						);
						break;
					case 2:
						newTriangles.push(
							...this.#handleTwoPointsBehind(triangle, d1, d2, d3),
						);
						break;
				}
			}

			triangles = newTriangles;
			if (triangles.length === 0) break;
		}

		return triangles;
	}

	isPointVisible(point: Vector3): boolean {
		return this.frustum.containsPoint(point);
	}

	setFromCamera(camera: Camera): this {
		this.frustum.setFromProjectionMatrix(camera.projectionMatrix);
		return this;
	}

	#handleIntersectingLine(
		denom: number,
		dist: number,
		t0: number,
		t1: number,
	): { t0: number; t1: number } | null {
		const t = -dist / denom;
		denom < 0 ? (t > t0 && (t0 = t)) : (t < t1 && (t1 = t));
		return t0 > t1 ? null : { t0, t1 };
	}

	#handleOnePointBehind(
		triangle: Vector3[],
		d1: number,
		d2: number,
		d3: number,
	): Vector3[][] {
		let a: Vector3, b: Vector3, c: Vector3;
		let da: number, db: number, dc: number;

		if (d1 < 0) {
			a = triangle.safeAt(0), b = triangle.safeAt(1), c = triangle.safeAt(2);
			da = d1, db = d2, dc = d3;
		} else if (d2 < 0) {
			a = triangle.safeAt(1), b = triangle.safeAt(2), c = triangle.safeAt(0);
			da = d2, db = d3, dc = d1;
		} else {
			a = triangle.safeAt(2), b = triangle.safeAt(0), c = triangle.safeAt(1);
			da = d3, db = d1, dc = d2;
		}

		const t1 = da / (da - db);
		const t2 = da / (da - dc);

		_v1.copy(a).lerp(b, t1);
		_v2.copy(a).lerp(c, t2);

		return [
			[_v1.clone(), b.clone(), c.clone()],
			[_v1.clone(), c.clone(), _v2.clone()],
		];
	}

	#handleParallelLine(dist: number): boolean {
		return dist >= 0;
	}

	#handleTwoPointsBehind(
		triangle: Vector3[],
		d1: number,
		d2: number,
		d3: number,
	): Vector3[][] {
		let a: Vector3, b: Vector3, c: Vector3;
		let da: number, db: number, dc: number;

		if (d1 >= 0) {
			a = triangle.safeAt(1), b = triangle.safeAt(2), c = triangle.safeAt(0);
			da = d2, db = d3, dc = d1;
		} else if (d2 >= 0) {
			a = triangle.safeAt(2), b = triangle.safeAt(0), c = triangle.safeAt(1);
			da = d3, db = d1, dc = d2;
		} else {
			a = triangle.safeAt(0), b = triangle.safeAt(1), c = triangle.safeAt(2);
			da = d1, db = d2, dc = d3;
		}

		const t1 = dc / (dc - da);
		const t2 = dc / (dc - db);

		_v1.copy(c).lerp(a, t1);
		_v2.copy(c).lerp(b, t2);

		return [[c.clone(), _v1.clone(), _v2.clone()]];
	}
}
