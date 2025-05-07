import { Vector3 } from "../maths/Vector3.ts";
import { Shape } from "./Shape.ts";

export class CubeShape extends Shape {
	constructor(width = 1, height = 1, depth = 1) {
		super();

		const halfWidth = width / 2;
		const halfHeight = height / 2;
		const halfDepth = depth / 2;

		this.vertices = [
			new Vector3(-halfWidth, -halfHeight, -halfDepth), // 0: front-bottom-left
			new Vector3(halfWidth, -halfHeight, -halfDepth), // 1: front-bottom-right
			new Vector3(halfWidth, halfHeight, -halfDepth), // 2: front-top-right
			new Vector3(-halfWidth, halfHeight, -halfDepth), // 3: front-top-left
			new Vector3(-halfWidth, -halfHeight, halfDepth), // 4: back-bottom-left
			new Vector3(halfWidth, -halfHeight, halfDepth), // 5: back-bottom-right
			new Vector3(halfWidth, halfHeight, halfDepth), // 6: back-top-right
			new Vector3(-halfWidth, halfHeight, halfDepth), // 7: back-top-left
		];

		const frontFace = [0, 1, 2, 2, 3, 0];
		const backFace = [5, 4, 7, 7, 6, 5];
		const rightFace = [1, 5, 6, 6, 2, 1];
		const leftFace = [4, 0, 3, 3, 7, 4];
		const topFace = [3, 2, 6, 6, 7, 3];
		const bottomFace = [1, 0, 4, 4, 5, 1];

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
