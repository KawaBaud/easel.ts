import type { SimpleMaterial } from "../materials/SimpleMaterial.ts";
import type { Shape } from "../shapes/Shape.ts";
import { Object3D } from "./Object3D.ts";

export class Mesh extends Object3D {
	#shape: Shape;
	#material: SimpleMaterial;

	constructor(
		shape: Shape,
		material: SimpleMaterial,
	) {
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

	get material(): SimpleMaterial {
		return this.#material;
	}

	set material(value: SimpleMaterial) {
		this.#material = value;
	}

	override clone(): Mesh {
		return new Mesh(this.shape.clone(), this.material.clone()).copy(this);
	}

	override copy(source: Mesh): this {
		super.copy(source);

		this.shape = source.shape.clone();
		this.material = source.material.clone();
		return this;
	}
}
