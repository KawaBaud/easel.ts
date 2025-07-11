import type { Material } from "../materials/Material";
import type { Shape } from "../shapes/Shape";
import { Object3D } from "./Object3D";

export class Mesh extends Object3D {
	#shape: Shape;
	#material: Material;

	constructor(shape: Shape, material: Material) {
		super();
		this.#shape = shape;
		this.#material = material;
		this.updateMatrix();
	}

	get shape(): Shape {
		return this.#shape;
	}

	set shape(value: Shape) {
		this.#shape = value;
		this.updateMatrix();
	}

	get material(): Material {
		return this.#material;
	}

	set material(value: Material) {
		this.#material = value;
	}

	override clone(): Mesh {
		return new Mesh(this.shape.clone(), this.material.clone()).copy(this);
	}

	override copy(source: this): this {
		super.copy(source);
		this.shape = source.shape.clone();
		this.material = source.material.clone();
		return this;
	}
}
