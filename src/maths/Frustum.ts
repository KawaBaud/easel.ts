import type { Box3 } from "./Box3";
import type { Matrix4 } from "./Matrix4";
import { Plane } from "./Plane";
import type { Sphere } from "./Sphere";
import type { Vector3 } from "./Vector3";

export class Frustum {
	/* 0: left, 1: right, 2: bottom, 3: top, 4: near, 5: far */
	planes: Plane[] = [];

	constructor() {
		this.planes.push(new Plane());
		this.planes.push(new Plane());
		this.planes.push(new Plane());
		this.planes.push(new Plane());
		this.planes.push(new Plane());
		this.planes.push(new Plane());
	}

	clone(): Frustum {
		return new Frustum().copy(this);
	}

	containsPoint(point: Vector3): boolean {
		const planes = this.planes;
		if (planes.length !== 6) {
			throw new Error("EASEL.Frustum: planes array must have 6 elements");
		}
		for (let i = 0; i < 6; i++) {
			const plane = planes[i];
			if (!plane) {
				throw new Error(`EASEL.Frustum: undefined Plane ${i}`);
			}
			if (plane.distanceToPoint(point) < 0) {
				return false;
			}
		}
		return true;
	}

	copy(frustum: this): this {
		const planes = this.planes;
		for (let i = 0; i < 6; i++) {
			planes[i]?.copy(frustum.planes[i] ?? new Plane());
		}
		return this;
	}

	intersectsBox(box: Box3): boolean {
		const planes = this.planes;
		if (planes.length !== 6) {
			throw new Error("EASEL.Frustum: planes array must have 6 elements");
		}

		for (let i = 0; i < 6; i++) {
			const plane = planes[i];
			if (!plane) {
				throw new Error(`EASEL.Frustum: undefined Plane ${i}`);
			}
			const normal = plane.normal;

			const px = normal.x > 0 ? box.max.x : box.min.x;
			const py = normal.y > 0 ? box.max.y : box.min.y;
			const pz = normal.z > 0 ? box.max.z : box.min.z;

			if (plane.distanceToPoint({ x: px, y: py, z: pz } as Vector3) < 0) {
				return false;
			}
		}

		return true;
	}

	intersectsSphere(sphere: Sphere): boolean {
		const planes = this.planes;
		if (planes.length !== 6) {
			throw new Error("EASEL.Frustum: planes array must have 6 elements");
		}
		const center = sphere.center;
		const negRadius = -sphere.radius;

		for (let i = 0; i < 6; i++) {
			const plane = planes[i];
			if (!plane) {
				throw new Error(`EASEL.Frustum: undefined Plane ${i}`);
			}
			const distance = plane.distanceToPoint(center);
			if (distance < negRadius) {
				return false;
			}
		}

		return true;
	}

	makeEmpty(): this {
		for (let i = 0; i < 6; i++) {
			this.planes[i] = new Plane();
		}
		return this;
	}

	setFromProjectionMatrix(m: Matrix4): this {
		const me = m.elements;
		const planes = this.planes;

		this.#setPlaneComponents(planes, me);
		return this;
	}

	#extractMatrixElements(me: Float32Array): number[] {
		return Array.from({ length: 16 }, (_, i) => me[i] as number);
	}

	#setFrustumPlanes(planes: Plane[], me: number[]): void {
		this.#setLeftPlane(planes, me);
		this.#setRightPlane(planes, me);
		this.#setBottomPlane(planes, me);
		this.#setTopPlane(planes, me);
		this.#setNearPlane(planes, me);
		this.#setFarPlane(planes, me);
	}

	#setPlaneComponents(planes: Plane[], me: Float32Array): void {
		const matrixElements = this.#extractMatrixElements(me);
		this.#setFrustumPlanes(planes, matrixElements);
	}

	#setLeftPlane(planes: Plane[], me: number[]): void {
		const plane = planes[0] ?? new Plane();
		planes[0] = plane;
		plane
			.setComponents(
				(me[3] as number) - (me[0] as number),
				(me[7] as number) - (me[4] as number),
				(me[11] as number) - (me[8] as number),
				(me[15] as number) - (me[12] as number),
			)
			.unitize();
	}

	#setRightPlane(planes: Plane[], me: number[]): void {
		const plane = planes[1] ?? new Plane();
		planes[1] = plane;
		plane
			.setComponents(
				(me[3] as number) + (me[0] as number),
				(me[7] as number) + (me[4] as number),
				(me[11] as number) + (me[8] as number),
				(me[15] as number) + (me[12] as number),
			)
			.unitize();
	}

	#setBottomPlane(planes: Plane[], me: number[]): void {
		const plane = planes[2] ?? new Plane();
		planes[2] = plane;
		plane
			.setComponents(
				(me[3] as number) + (me[1] as number),
				(me[7] as number) + (me[5] as number),
				(me[11] as number) + (me[9] as number),
				(me[15] as number) + (me[13] as number),
			)
			.unitize();
	}

	#setTopPlane(planes: Plane[], me: number[]): void {
		const plane = planes[3] ?? new Plane();
		planes[3] = plane;
		plane
			.setComponents(
				(me[3] as number) - (me[1] as number),
				(me[7] as number) - (me[5] as number),
				(me[11] as number) - (me[9] as number),
				(me[15] as number) - (me[13] as number),
			)
			.unitize();
	}

	#setNearPlane(planes: Plane[], me: number[]): void {
		const plane = planes[4] ?? new Plane();
		planes[4] = plane;
		plane
			.setComponents(
				(me[3] as number) - (me[2] as number),
				(me[7] as number) - (me[6] as number),
				(me[11] as number) - (me[10] as number),
				(me[15] as number) - (me[14] as number),
			)
			.unitize();
	}

	#setFarPlane(planes: Plane[], me: number[]): void {
		const plane = planes[5] ?? new Plane();
		planes[5] = plane;
		plane
			.setComponents(
				(me[3] as number) + (me[2] as number),
				(me[7] as number) + (me[6] as number),
				(me[11] as number) + (me[10] as number),
				(me[15] as number) + (me[14] as number),
			)
			.unitize();
	}
}
