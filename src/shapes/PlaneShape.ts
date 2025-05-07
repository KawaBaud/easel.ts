import { Vector3 } from "../maths/Vector3.ts";
import { Shape } from "./Shape.ts";

export class PlaneShape extends Shape {
	constructor(width = 1, height = 1) {
		super();

		const halfWidth = width / 2;
		const halfHeight = height / 2;

		this.vertices = [
			new Vector3(-halfWidth, 0, -halfHeight),
			new Vector3(halfWidth, 0, -halfHeight),
			new Vector3(halfWidth, 0, halfHeight),
			new Vector3(-halfWidth, 0, halfHeight),
		];

		const triangleA = [0, 1, 2];
		const triangleB = [2, 3, 0];

		this.indices = [...triangleA, ...triangleB];
	}

	override clone(): PlaneShape {
		return new PlaneShape().copy(this);
	}
}
