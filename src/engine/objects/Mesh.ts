import type { Material } from "../materials/Material.ts";
import type { Shape } from "../shapes/Shape.ts";
import { Object3D } from "./Object3D.ts";

export class Mesh extends Object3D {
	readonly isMesh: boolean = true;

	constructor(
		public shape: Shape,
		public material: Material,
	) {
		super();
		this.updateMatrix();
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
