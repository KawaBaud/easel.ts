import { Vector3 } from "./Vector3";

export class Sphere {
	#center = new Vector3();
	#radius = 1;

	constructor(center = new Vector3(), radius = 1) {
		this.#center = center.clone();
		this.#radius = radius;
	}

	get center(): Vector3 {
		return this.#center;
	}

	set center(value: Vector3) {
		this.#center.copy(value);
	}

	get radius(): number {
		return this.#radius;
	}

	set radius(value: number) {
		this.#radius = value;
	}

	clone(): Sphere {
		return new Sphere(this.center, this.radius);
	}

	containsPoint(point: Vector3): boolean {
		return point.clone().sub(this.center).lengthSq <= this.radius * this.radius;
	}

	copy(sphere: this): this {
		this.center.copy(sphere.center);
		this.radius = sphere.radius;
		return this;
	}

	distanceToPoint(point: Vector3): number {
		return point.clone().sub(this.center).length - this.radius;
	}

	equals(sphere: this): boolean {
		return (
			sphere.center.x === this.center.x &&
			sphere.center.y === this.center.y &&
			sphere.center.z === this.center.z &&
			sphere.radius === this.radius
		);
	}

	intersectsSphere(sphere: this): boolean {
		const radiusSum = this.radius + sphere.radius;
		return (
			this.center.clone().sub(sphere.center).lengthSq <= radiusSum * radiusSum
		);
	}

	translate(offset: Vector3): this {
		this.center.add(offset);
		return this;
	}
}
