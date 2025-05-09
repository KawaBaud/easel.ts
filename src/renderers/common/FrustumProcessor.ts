import type { Camera } from "../../cameras/Camera.ts";
import { Frustum } from "../../maths/Frustum.ts";
import { MathUtils } from "../../maths/MathUtils.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import "../../types.ts";
import { Processor } from "./Processor.ts";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();
const _v5 = new Vector3();

export class FrustumProcessor extends Processor {
	frustum = new Frustum();

	override reset(): this {
		this.frustum.makeEmpty();
		return this;
	}

	clipLine(start: Vector3, end: Vector3): Vector3[] | null {
		const INSIDE = 0b000000;
		const LEFT = 0b000001;
		const RIGHT = 0b000010;
		const BOTTOM = 0b000100;
		const TOP = 0b001000;
		const NEAR = 0b010000;
		const FAR = 0b100000;

		const computeOutCode = (point: Vector3): number => {
			let code = INSIDE;

			for (let i = 0; i < 6; i++) {
				const plane = this.frustum.planes.safeAt(i);
				const dist = plane.distanceToPoint(point);

				if (dist < 0) {
					switch (i) {
						case 0:
							code |= LEFT;
							break;
						case 1:
							code |= RIGHT;
							break;
						case 2:
							code |= BOTTOM;
							break;
						case 3:
							code |= TOP;
							break;
						case 4:
							code |= NEAR;
							break;
						case 5:
							code |= FAR;
							break;
					}
				}
			}

			return code;
		};

		const outcode0 = computeOutCode(start);
		const outcode1 = computeOutCode(end);

		if ((outcode0 | outcode1) === 0) return [start.clone(), end.clone()];
		if ((outcode0 & outcode1) !== 0) return null;

		const direction = _v3.subVectors(end, start);
		let t0 = 0;
		let t1 = 1;

		for (let i = 0; i < 6; i++) {
			const plane = this.frustum.planes.safeAt(i);
			const normal = plane.normal;
			const denom = normal.dot(direction);
			const dist = plane.distanceToPoint(start);

			if (denom === 0) {
				if (dist < 0) return null;
			} else {
				const t = -dist / denom;
				denom < 0 ? (t > t0 && (t0 = t)) : (t < t1 && (t1 = t));

				if (t0 > t1) return null;
			}
		}

		t0 = MathUtils.fastMax(0, t0);
		t1 = MathUtils.fastMin(1, t1);

		const clippedStart = _v1.copy(start).add(
			_v4.copy(direction).mulScalar(t0),
		);
		const clippedEnd = _v2.copy(start).add(
			_v5.copy(direction).mulScalar(t1),
		);
		return [clippedStart.clone(), clippedEnd.clone()];
	}

	clipTriangle(v1: Vector3, v2: Vector3, v3: Vector3): Vector3[][] {
		if (
			this.frustum.containsPoint(v1) && this.frustum.containsPoint(v2) &&
			this.frustum.containsPoint(v3)
		) return [[v1.clone(), v2.clone(), v3.clone()]];

		let triangles = [[v1.clone(), v2.clone(), v3.clone()]];
		let newTriangles: Vector3[][] = [];

		for (let i = 0; i < 6; i++) {
			const plane = this.frustum.planes.safeAt(i);
			newTriangles = [];

			for (const triangle of triangles) {
				const p1 = triangle.safeAt(0);
				const p2 = triangle.safeAt(1);
				const p3 = triangle.safeAt(2);

				const d1 = plane.distanceToPoint(p1);
				const d2 = plane.distanceToPoint(p2);
				const d3 = plane.distanceToPoint(p3);

				const p1Behind = d1 < 0;
				const p2Behind = d2 < 0;
				const p3Behind = d3 < 0;

				const behindCount = (p1Behind ? 1 : 0) +
					(p2Behind ? 1 : 0) + (p3Behind ? 1 : 0);
				switch (behindCount) {
					case 0:
						newTriangles.push(triangle);
						break;
					case 1:
						this.#clipOnePointBehind(
							triangle,
							d1,
							d2,
							d3,
							p1Behind,
							p2Behind,
							newTriangles,
						);
						break;
					case 2:
						this.#clipTwoPointsBehind(
							triangle,
							d1,
							d2,
							d3,
							p1Behind,
							p2Behind,
							newTriangles,
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

	#clipOnePointBehind(
		triangle: Vector3[],
		d1: number,
		d2: number,
		d3: number,
		p1Behind: boolean,
		p2Behind: boolean,
		newTriangles: Vector3[][],
	): void {
		const p1 = triangle.safeAt(0);
		const p2 = triangle.safeAt(1);
		const p3 = triangle.safeAt(2);

		const a = p1Behind ? p1 : p2Behind ? p2 : p3,
			b = p1Behind ? p2 : p2Behind ? p3 : p1,
			c = p1Behind ? p3 : p2Behind ? p1 : p2;
		const da = p1Behind ? d1 : p2Behind ? d2 : d3,
			db = p1Behind ? d2 : p2Behind ? d3 : d1,
			dc = p1Behind ? d3 : p2Behind ? d1 : d2;

		const t1 = da / (da - db);
		const t2 = da / (da - dc);

		_v4.copy(a).lerp(b, t1);
		_v5.copy(a).lerp(c, t2);

		newTriangles.push(
			[_v4.clone(), b.clone(), c.clone()],
			[_v4.clone(), c.clone(), _v5.clone()],
		);
	}

	#clipTwoPointsBehind(
		triangle: Vector3[],
		d1: number,
		d2: number,
		d3: number,
		p1Behind: boolean,
		p2Behind: boolean,
		newTriangles: Vector3[][],
	): void {
		const p1 = triangle.safeAt(0);
		const p2 = triangle.safeAt(1);
		const p3 = triangle.safeAt(2);

		const a = !p1Behind ? p2 : !p2Behind ? p3 : p1,
			b = !p1Behind ? p3 : !p2Behind ? p1 : p2,
			c = !p1Behind ? p1 : !p2Behind ? p2 : p3;
		const da = !p1Behind ? d2 : !p2Behind ? d3 : d1,
			db = !p1Behind ? d3 : !p2Behind ? d1 : d2,
			dc = !p1Behind ? d1 : !p2Behind ? d2 : d3;

		const t1 = dc / (dc - da);
		const t2 = dc / (dc - db);

		_v4.copy(c).lerp(a, t1);
		_v5.copy(c).lerp(b, t2);

		newTriangles.push([c.clone(), _v4.clone(), _v5.clone()]);
	}
}
