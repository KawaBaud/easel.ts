import "../types.ts";
import type { Line3 } from "./Line3.ts";
import { Matrix3 } from "./Matrix3.ts";
import type { Matrix4 } from "./Matrix4.ts";
import type { Sphere } from "./Sphere.ts";
import { Vector3 } from "./Vector3.ts";

export class Plane {
	#normal = new Vector3(1, 0, 0);
	#constant = 0;

	constructor(normal = new Vector3(1, 0, 0), constant = 0) {
		const length = normal.length;
		this.#normal = normal.clone().unitize();
		this.#constant = constant / length;
	}

	get normal(): Vector3 {
		return this.#normal;
	}

	set normal(value: Vector3) {
		this.#normal.copy(value).unitize();
	}

	get constant(): number {
		return this.#constant;
	}

	set constant(value: number) {
		this.#constant = value;
	}

	applyMatrix4(m: Matrix4): this {
		const normalMatrix = new Matrix3().getNormalMatrix(m);
		const referencePoint = this.coplanarPoint(new Vector3()).applyMatrix4(m);

		this.normal.applyMatrix3(normalMatrix).unitize();
		this.constant = -referencePoint.dot(this.normal);
		return this;
	}

	coplanarPoint(target = new Vector3()): Vector3 {
		return target.copy(this.normal).mulScalar(-this.constant);
	}

	clone(): Plane {
		return new Plane(this.normal, this.constant);
	}

	copy(plane: Plane): this {
		this.normal.copy(plane.normal);
		this.constant = plane.constant;
		return this;
	}

	distanceToPoint(point: Vector3): number {
		return this.normal.dot(point) + this.constant;
	}

	equals(plane: Plane): boolean {
		return plane.normal.equals(this.normal) && plane.constant === this.constant;
	}

	intersectLine(
		line: Line3,
		target = new Vector3(),
	): Vector3 | null {
		const dir = line.end.sub(line.start);
		const denom = this.normal.dot(dir);
		if (denom === 0) {
			return this.distanceToPoint(line.start) === 0
				? target.copy(line.start)
				: null;
		}

		const t = -(line.start.dot(this.normal) + this.constant) / denom;
		if (t < 0 || t > 1) return null;

		return target.copy(dir).mulScalar(t).add(line.start);
	}

	intersectsSphere(sphere: Sphere): boolean {
		return this.distanceToPoint(sphere.centre) <= sphere.radius;
	}

	projectPoint(point: Vector3, target = new Vector3()): Vector3 {
		return target.copy(this.normal).mulScalar(-this.distanceToPoint(point)).add(
			point,
		);
	}

	setComponents(x: number, y: number, z: number, w: number): this {
		this.normal.set(x, y, z);
		this.constant = w;
		return this;
	}

	setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): this {
		const v1 = b.clone().sub(a);
		const v2 = c.clone().sub(a);
		const normal = v1.clone().cross(v2).unitize();

		this.setFromNormalAndCoplanarPoint(normal, a);
		return this;
	}

	setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): this {
		this.normal.copy(normal).unitize();
		this.constant = -point.clone().dot(this.normal);
		return this;
	}

	translate(offset: Vector3): this {
		this.constant -= offset.dot(this.normal);
		return this;
	}

	unitize(): this {
		const length = this.normal.length;
		this.normal.divScalar(length);
		this.constant /= length;
		return this;
	}
}
