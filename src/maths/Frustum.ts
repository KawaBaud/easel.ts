import "../types.ts";
import type { Box3 } from "./Box3.ts";
import type { Matrix4 } from "./Matrix4.ts";
import { Plane } from "./Plane.ts";
import type { Sphere } from "./Sphere.ts";
import type { Vector3 } from "./Vector3.ts";

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
		if (planes.safeAt(0).distanceToPoint(point) < 0) return false;
		if (planes.safeAt(1).distanceToPoint(point) < 0) return false;
		if (planes.safeAt(2).distanceToPoint(point) < 0) return false;
		if (planes.safeAt(3).distanceToPoint(point) < 0) return false;
		if (planes.safeAt(4).distanceToPoint(point) < 0) return false;
		if (planes.safeAt(5).distanceToPoint(point) < 0) return false;
		return true;
	}

	copy(frustum: Frustum): this {
		const planes = this.planes;
		planes.safeAt(0).copy(frustum.planes.safeAt(0));
		planes.safeAt(1).copy(frustum.planes.safeAt(1));
		planes.safeAt(2).copy(frustum.planes.safeAt(2));
		planes.safeAt(3).copy(frustum.planes.safeAt(3));
		planes.safeAt(4).copy(frustum.planes.safeAt(4));
		planes.safeAt(5).copy(frustum.planes.safeAt(5));
		return this;
	}

	intersectsBox(box: Box3): boolean {
		const planes = this.planes;

		for (let i = 0; i < 6; i++) {
			const plane = planes.safeAt(i);
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
		const centre = sphere.centre;
		const negRadius = -sphere.radius;

		for (let i = 0; i < 6; i++) {
			const distance = planes.safeAt(i).distanceToPoint(centre);
			if (distance < negRadius) return false;
		}

		return true;
	}

	setFromProjectionMatrix(m: Matrix4): this {
		const me = m.elements;
		const planes = this.planes;

		const me0 = me.safeAt(0),
			me1 = me.safeAt(1),
			me2 = me.safeAt(2),
			me3 = me.safeAt(3);
		const me4 = me.safeAt(4),
			me5 = me.safeAt(5),
			me6 = me.safeAt(6),
			me7 = me.safeAt(7);
		const me8 = me.safeAt(8),
			me9 = me.safeAt(9),
			me10 = me.safeAt(10),
			me11 = me.safeAt(11);
		const me12 = me.safeAt(12),
			me13 = me.safeAt(13),
			me14 = me.safeAt(14),
			me15 = me.safeAt(15);

		planes.safeAt(0).setComponents(
			me3 - me0,
			me7 - me4,
			me11 - me8,
			me15 - me12,
		).unitize(); /* left */
		planes.safeAt(1).setComponents(
			me3 + me0,
			me7 + me4,
			me11 + me8,
			me15 + me12,
		).unitize(); /* right */
		planes.safeAt(2).setComponents(
			me3 + me1,
			me7 + me5,
			me11 + me9,
			me15 + me13,
		).unitize(); /* bottom */
		planes.safeAt(3).setComponents(
			me3 - me1,
			me7 - me5,
			me11 - me9,
			me15 - me13,
		).unitize(); /* top */
		planes.safeAt(4).setComponents(
			me3 - me2,
			me7 - me6,
			me11 - me10,
			me15 - me14,
		).unitize(); /* near */
		planes.safeAt(5).setComponents(
			me3 + me2,
			me7 + me6,
			me11 + me10,
			me15 + me14,
		).unitize(); /* far */
		return this;
	}
}
