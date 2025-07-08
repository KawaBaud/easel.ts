import type { Camera } from "../../cameras/Camera";
import type { Material } from "../../materials/Material";
import { Frustum } from "../../maths/Frustum";
import { MathUtils } from "../../maths/MathUtils";
import type { Plane } from "../../maths/Plane";
import { Vector3 } from "../../maths/Vector3";
import { ShapeUtils } from "../../shapes/ShapeUtils";
import "../../types";
import { Side } from "../../types";
import { Processor } from "../common/Processor";

const _normal = new Vector3();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();
const _v5 = new Vector3();

export class FrustumProcessor extends Processor {
	frustum = new Frustum();

	#camera: Camera | undefined = undefined;

	get camera(): Camera | undefined {
		return this.#camera;
	}

	clipLine(start: Vector3, end: Vector3): Vector3[] | undefined {
		const Inside = 0b000000;
		const Left = 0b000001;
		const Right = 0b000010;
		const Bottom = 0b000100;
		const Top = 0b001000;
		const Near = 0b010000;
		const Far = 0b100000;

		const outcode0 = this.#computeOutCode(
			start,
			Inside,
			Left,
			Right,
			Bottom,
			Top,
			Near,
			Far,
		);
		const outcode1 = this.#computeOutCode(
			end,
			Inside,
			Left,
			Right,
			Bottom,
			Top,
			Near,
			Far,
		);

		if ((outcode0 | outcode1) === 0) {
			return [start.clone(), end.clone()];
		}
		if ((outcode0 & outcode1) !== 0) {
			return undefined;
		}

		return this.#clipLineAgainstPlanes(start, end);
	}

	clipTriangle(v1: Vector3, v2: Vector3, v3: Vector3): Vector3[][] {
		// Early return if triangle is fully inside frustum
		if (this.#isTriangleInFrustum(v1, v2, v3)) {
			return [[v1.clone(), v2.clone(), v3.clone()]];
		}

		return this.#clipTriangleAgainstPlanes([
			[v1.clone(), v2.clone(), v3.clone()],
		]);
	}

	isBackFace(v1: Vector3, v2: Vector3, v3: Vector3): boolean {
		if (!this.#camera) {
			return false;
		}

		ShapeUtils.calculateNormal(v1, v2, v3, _normal);
		return _normal.dot(v1) < 0;
	}

	isFrontFace(v1: Vector3, v2: Vector3, v3: Vector3): boolean {
		return !this.isBackFace(v1, v2, v3);
	}

	isPointVisible(point: Vector3): boolean {
		return this.frustum.containsPoint(point);
	}

	reset(): this {
		this.#camera = undefined;
		return this;
	}

	setFromCamera(camera: Camera): this {
		this.#camera = camera;
		this.frustum.setFromProjectionMatrix(camera.projectionMatrix);
		return this;
	}

	shouldCull(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		material: Material,
	): boolean {
		if (material.wireframe) {
			return false;
		}

		const isBackFace = this.isBackFace(v1, v2, v3);

		switch (material.side) {
			case Side.front:
				return isBackFace;
			case Side.back:
				return !isBackFace;
			case Side.double:
				return false;
			default:
				return isBackFace;
		}
	}

	#clipLineAgainstPlane(
		plane: Plane,
		direction: Vector3,
		start: Vector3,
		t0: number,
		t1: number,
	): boolean {
		const normal = plane.normal;
		const denom = normal.dot(direction);
		const dist = plane.distanceToPoint(start);

		if (denom === 0) {
			return dist >= 0;
		}

		const t = -dist / denom;
		let newT0 = t0;
		let newT1 = t1;

		if (denom < 0) {
			if (t > newT0) {
				newT0 = t;
			}
		} else if (t < newT1) {
			newT1 = t;
		}

		return newT0 <= newT1;
	}

	#clipLineAgainstPlanes(start: Vector3, end: Vector3): Vector3[] | undefined {
		const direction = _v3.subVectors(end, start);
		let t0 = 0;
		let t1 = 1;

		if (!this.#clipLineAgainstAllPlanes(direction, start, t0, t1)) {
			return undefined;
		}

		t0 = MathUtils.fastMax(0, t0);
		t1 = MathUtils.fastMin(1, t1);

		const clippedStart = _v1.copy(start).add(_v4.copy(direction).mulScalar(t0));
		const clippedEnd = _v2.copy(start).add(_v5.copy(direction).mulScalar(t1));
		return [clippedStart.clone(), clippedEnd.clone()];
	}

	#clipLineAgainstAllPlanes(
		direction: Vector3,
		start: Vector3,
		t0: number,
		t1: number,
	): boolean {
		for (let i = 0; i < 6; i++) {
			const plane = this.frustum.planes[i];
			if (!plane) {
				throw new Error(`Easel.FrustumProcessor: invalid plane at index ${i}`);
			}

			if (!this.#clipLineAgainstPlane(plane, direction, start, t0, t1)) {
				return false;
			}
		}
		return true;
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
		const [p1, p2, p3] = this.#validateTriangle(triangle);

		const [a, b, c] = this.#getOrderedPoints(p1, p2, p3, p1Behind, p2Behind);
		const [da, db, dc] = this.#getOrderedDistances(
			d1,
			d2,
			d3,
			p1Behind,
			p2Behind,
		);

		const t1 = da / (da - db);
		const t2 = da / (da - dc);

		_v4.copy(a).lerp(b, t1);
		_v5.copy(a).lerp(c, t2);

		newTriangles.push(
			[_v4.clone(), b.clone(), c.clone()],
			[_v4.clone(), c.clone(), _v5.clone()],
		);
	}

	#clipTriangleAgainstPlanes(triangles: Vector3[][]): Vector3[][] {
		let clippedTriangles = triangles;
		for (let i = 0; i < 6; i++) {
			const plane = this.frustum.planes[i];
			if (!plane) {
				throw new Error(`Easel.FrustumProcessor: invalid plane at index ${i}`);
			}

			clippedTriangles = this.#clipTrianglesAgainstPlane(
				clippedTriangles,
				plane,
			);
			if (clippedTriangles.length === 0) {
				break;
			}
		}
		return clippedTriangles;
	}

	#clipTrianglesAgainstPlane(
		triangles: Vector3[][],
		plane: Plane,
	): Vector3[][] {
		const newTriangles: Vector3[][] = [];

		for (const triangle of triangles) {
			this.#processTriangle(triangle, plane, newTriangles);
		}

		return newTriangles;
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
		const [p1, p2, p3] = this.#validateTriangle(triangle);

		const [a, b, c] = this.#getOrderedPointsTwo(p1, p2, p3, p1Behind, p2Behind);
		const [da, db, dc] = this.#getOrderedDistancesTwo(
			d1,
			d2,
			d3,
			p1Behind,
			p2Behind,
		);

		const t1 = dc / (dc - da);
		const t2 = dc / (dc - db);

		_v4.copy(c).lerp(a, t1);
		_v5.copy(c).lerp(b, t2);

		newTriangles.push([c.clone(), _v4.clone(), _v5.clone()]);
	}

	#computeOutCode(
		point: Vector3,
		Inside: number,
		Left: number,
		Right: number,
		Bottom: number,
		Top: number,
		Near: number,
		Far: number,
	): number {
		let code = Inside;

		for (let i = 0; i < 6; i++) {
			const plane = this.frustum.planes[i];
			if (!plane) {
				throw new Error(`Easel.FrustumProcessor: invalid plane at index ${i}`);
			}
			if (plane.distanceToPoint(point) < 0) {
				code |= this.#getPlaneCode(i, Left, Right, Bottom, Top, Near, Far);
			}
		}

		return code;
	}

	#isTriangleInFrustum(v1: Vector3, v2: Vector3, v3: Vector3): boolean {
		return (
			this.frustum.containsPoint(v1) &&
			this.frustum.containsPoint(v2) &&
			this.frustum.containsPoint(v3)
		);
	}

	#getOrderedDistances(
		d1: number,
		d2: number,
		d3: number,
		p1Behind: boolean,
		p2Behind: boolean,
	): [number, number, number] {
		const da = p1Behind ? d1 : p2Behind ? d2 : d3;
		const db = p1Behind ? d2 : p2Behind ? d3 : d1;
		const dc = p1Behind ? d3 : p2Behind ? d1 : d2;
		return [da, db, dc];
	}

	#getOrderedPoints(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
		p1Behind: boolean,
		p2Behind: boolean,
	): [Vector3, Vector3, Vector3] {
		const a = p1Behind ? p1 : p2Behind ? p2 : p3;
		const b = p1Behind ? p2 : p2Behind ? p3 : p1;
		const c = p1Behind ? p3 : p2Behind ? p1 : p2;
		return [a, b, c];
	}

	#getOrderedPointsTwo(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
		p1Behind: boolean,
		p2Behind: boolean,
	): [Vector3, Vector3, Vector3] {
		const a = p1Behind ? (p2Behind ? p1 : p3) : p2;
		const b = p1Behind ? (p2Behind ? p2 : p1) : p3;
		const c = p1Behind ? (p2Behind ? p3 : p2) : p1;
		return [a, b, c];
	}

	#getOrderedDistancesTwo(
		d1: number,
		d2: number,
		d3: number,
		p1Behind: boolean,
		p2Behind: boolean,
	): [number, number, number] {
		const da = p1Behind ? (p2Behind ? d1 : d3) : d2;
		const db = p1Behind ? (p2Behind ? d2 : d1) : d3;
		const dc = p1Behind ? (p2Behind ? d3 : d2) : d1;
		return [da, db, dc];
	}

	#getPlaneCode(
		index: number,
		Left: number,
		Right: number,
		Bottom: number,
		Top: number,
		Near: number,
		Far: number,
	): number {
		switch (index) {
			case 0:
				return Left;
			case 1:
				return Right;
			case 2:
				return Bottom;
			case 3:
				return Top;
			case 4:
				return Near;
			case 5:
				return Far;
			default:
				throw new Error(
					`Easel.FrustumProcessor: invalid plane index: ${index}`,
				);
		}
	}

	#processTriangle(
		triangle: Vector3[],
		plane: Plane,
		newTriangles: Vector3[][],
	): void {
		const [p1, p2, p3] = triangle;
		if (!(p1 && p2 && p3)) {
			throw new Error("Easel.FrustumProcessor: invalid triangle");
		}

		const d1 = plane.distanceToPoint(p1);
		const d2 = plane.distanceToPoint(p2);
		const d3 = plane.distanceToPoint(p3);

		const p1Behind = d1 < 0;
		const p2Behind = d2 < 0;
		const p3Behind = d3 < 0;

		const behindCount =
			(p1Behind ? 1 : 0) + (p2Behind ? 1 : 0) + (p3Behind ? 1 : 0);

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
			default:
				break;
		}
	}

	#validateTriangle(triangle: Vector3[]): [Vector3, Vector3, Vector3] {
		const [p1, p2, p3] = triangle;
		if (!(p1 && p2 && p3)) {
			throw new Error("Easel.FrustumProcessor: invalid triangle");
		}
		return [p1, p2, p3];
	}
}
