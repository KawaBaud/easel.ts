import "../types.ts";
import { Vector3 } from "./Vector3.ts";

export class Sphere {
	#centre = new Vector3();
	#radius = 1;

	constructor(centre = new Vector3(), radius = 1) {
		this.#centre = centre.clone();
		this.#radius = radius;
	}

	get centre(): Vector3 {
		return this.#centre;
	}

	set centre(value: Vector3) {
		this.#centre.copy(value);
	}

	get radius(): number {
		return this.#radius;
	}

	set radius(value: number) {
		this.#radius = value;
	}

	clone(): Sphere {
		return new Sphere(this.centre, this.radius);
	}

	containsPoint(point: Vector3): boolean {
		return point.clone().sub(this.centre).lengthSq <= this.radius * this.radius;
	}

	copy(sphere: Sphere): this {
		this.centre.copy(sphere.centre);
		this.radius = sphere.radius;
		return this;
	}

	distanceToPoint(point: Vector3): number {
		return point.clone().sub(this.centre).length - this.radius;
	}

	equals(sphere: Sphere): boolean {
		return (
			(sphere.centre.x === this.centre.x) &&
			(sphere.centre.y === this.centre.y) &&
			(sphere.centre.z === this.centre.z) &&
			(sphere.radius === this.radius)
		);
	}

	intersectsSphere(sphere: Sphere): boolean {
		const radiusSum = this.radius + sphere.radius;
		return this.centre.clone().sub(sphere.centre)
			.lengthSq <= (radiusSum * radiusSum);
	}

	translate(offset: Vector3): this {
		this.centre.add(offset);
		return this;
	}
}
