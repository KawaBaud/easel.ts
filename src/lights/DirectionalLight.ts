import { Vector3 } from "../maths/Vector3.ts";
import type { ColorValue } from "../types/types.ts";
import { Light } from "./Light.ts";

export class DirectionalLight extends Light {
	#direction = new Vector3(0, -1, 0);
	#target = new Vector3();

	constructor(color?: ColorValue, intensity = 1) {
		super(color, intensity);

		this.name = "DirectionalLight";
	}

	get direction(): Vector3 {
		return this.#direction;
	}

	set direction(value: Vector3) {
		this.#direction.copy(value).unitize();
	}

	get target(): Vector3 {
		return this.#target;
	}

	set target(value: Vector3) {
		this.#target.copy(value);
		this.#updateDirection();
	}

	override clone(): DirectionalLight {
		return new DirectionalLight(this.color, this.intensity).copy(this);
	}

	override copy(source: DirectionalLight): this {
		super.copy(source);

		this.direction.copy(source.direction);
		this.target.copy(source.target);
		return this;
	}

	override updateWorldMatrix(force = false, updateChildren = true): void {
		super.updateWorldMatrix(force, updateChildren);

		this.#updateDirection();
	}

	setFromDirection(direction: Vector3): this {
		this.direction.copy(direction).unitize();
		return this;
	}

	#updateDirection(): void {
		this.#direction.copy(this.position).sub(this.target).unitize().negate();
	}
}
