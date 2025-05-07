import type { Camera } from "../../cameras/Camera.ts";
import { Frustum } from "../../maths/Frustum.ts";
import { Line3 } from "../../maths/Line3.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import "../../types.ts";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v4 = new Vector3();
const _line = new Line3();

export class ClippingContext {
	frustum = new Frustum();

	clipLine(start: Vector3, end: Vector3): Vector3[] | null {
		const nearPlane = this.frustum.planes.safeAt(4);

		const d1 = nearPlane.distanceToPoint(start);
		const d2 = nearPlane.distanceToPoint(end);
		if (d1 >= 0 && d2 >= 0) return [start.clone(), end.clone()];
		if (d1 < 0 && d2 < 0) return null;

		_line.set(start, end);
		const intersection = nearPlane.intersectLine(_line, _v4);
		if (!intersection) return null;

		return d1 < 0
			? [intersection.clone(), end.clone()]
			: [start.clone(), intersection.clone()];
	}

	clipTriangle(v1: Vector3, v2: Vector3, v3: Vector3): Vector3[][] {
		if (
			this.isPointVisible(v1) &&
			this.isPointVisible(v2) &&
			this.isPointVisible(v3)
		) {
			return [[v1.clone(), v2.clone(), v3.clone()]];
		}

		const nearPlane = this.frustum.planes.safeAt(4);

		const d1 = nearPlane.distanceToPoint(v1);
		const d2 = nearPlane.distanceToPoint(v2);
		const d3 = nearPlane.distanceToPoint(v3);

		const behindCount = (d1 < 0 ? 1 : 0) + (d2 < 0 ? 1 : 0) + (d3 < 0 ? 1 : 0);
		if (behindCount === 3) return [];
		if (behindCount === 0) return [[v1.clone(), v2.clone(), v3.clone()]];

		const result: Vector3[][] = [];

		if (behindCount === 1) {
			let a: Vector3, b: Vector3, c: Vector3;
			let da: number, db: number, dc: number;

			if (d1 < 0) {
				a = v1, b = v2, c = v3;
				da = d1, db = d2, dc = d3;
			} else if (d2 < 0) {
				a = v2, b = v3, c = v1;
				da = d2, db = d3, dc = d1;
			} else {
				a = v3, b = v1, c = v2;
				da = d3, db = d1, dc = d2;
			}

			const t1 = da / (da - db);
			const t2 = da / (da - dc);

			_v1.copy(a).lerp(b, t1);
			_v2.copy(a).lerp(c, t2);

			result.push([_v1.clone(), b.clone(), c.clone()]);
			result.push([_v1.clone(), c.clone(), _v2.clone()]);
		} else if (behindCount === 2) {
			let a: Vector3, b: Vector3, c: Vector3;
			let da: number, db: number, dc: number;

			if (d1 >= 0) {
				a = v2, b = v3, c = v1;
				da = d2, db = d3, dc = d1;
			} else if (d2 >= 0) {
				a = v3, b = v1, c = v2;
				da = d3, db = d1, dc = d2;
			} else {
				a = v1, b = v2, c = v3;
				da = d1, db = d2, dc = d3;
			}

			const t1 = dc / (dc - da);
			const t2 = dc / (dc - db);

			_v1.copy(c).lerp(a, t1);
			_v2.copy(c).lerp(b, t2);

			result.push([c.clone(), _v1.clone(), _v2.clone()]);
		}

		return result;
	}

	isPointVisible(point: Vector3): boolean {
		return this.frustum.containsPoint(point);
	}

	setFromCamera(camera: Camera): this {
		this.frustum.setFromProjectionMatrix(camera.projectionMatrix);
		return this;
	}
}
