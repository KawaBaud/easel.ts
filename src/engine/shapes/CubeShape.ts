import { Vector3 } from "../maths/Vector3.ts";
import { Shape } from "./Shape.ts";

export class CubeShape extends Shape {
	readonly isCubeShape = true;

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

		const frontIndices = [0, 1, 2, 3];
		const backIndices = [4, 5, 6, 7];
		const rightIndices = [1, 5, 6, 2];
		const leftIndices = [4, 0, 3, 7];
		const topIndices = [3, 2, 6, 7];
		const bottomIndices = [4, 5, 1, 0];

		this.indices = [
			...frontIndices,
			...backIndices,
			...rightIndices,
			...leftIndices,
			...topIndices,
			...bottomIndices,
		];
	}

	override clone(): CubeShape {
		return new CubeShape().copy(this);
	}
}
