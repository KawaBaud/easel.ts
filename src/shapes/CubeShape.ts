import { Vector3 } from "../maths/Vector3.ts";
import { Shape } from "./Shape.ts";

export class CubeShape extends Shape {
	constructor(width = 1, height = 1, depth = 1) {
		super();

		const halfWidth = width / 2;
		const halfHeight = height / 2;
		const halfDepth = depth / 2;

		this.vertices = [
			new Vector3(-halfWidth, -halfHeight, -halfDepth),
			new Vector3(halfWidth, -halfHeight, -halfDepth),
			new Vector3(halfWidth, halfHeight, -halfDepth),
			new Vector3(-halfWidth, halfHeight, -halfDepth),
			new Vector3(-halfWidth, -halfHeight, halfDepth),
			new Vector3(halfWidth, -halfHeight, halfDepth),
			new Vector3(halfWidth, halfHeight, halfDepth),
			new Vector3(-halfWidth, halfHeight, halfDepth),
		];

		const frontFace = [0, 1, 3, 1, 2, 3];
		const backFace = [4, 7, 6, 4, 6, 5];
		const rightFace = [1, 2, 6, 1, 6, 5];
		const leftFace = [4, 7, 3, 4, 3, 0];
		const topFace = [3, 7, 6, 3, 6, 2];
		const bottomFace = [4, 0, 1, 4, 1, 5];

		this.indices = [
			...frontFace,
			...backFace,
			...rightFace,
			...leftFace,
			...topFace,
			...bottomFace,
		];
	}

	override clone(): CubeShape {
		return new CubeShape().copy(this);
	}
}
