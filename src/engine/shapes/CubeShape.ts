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

		this.indices = [
			0,
			1,
			2,
			0,
			2,
			3,
			1,
			5,
			6,
			1,
			6,
			2,
			5,
			4,
			7,
			5,
			7,
			6,
			4,
			0,
			3,
			4,
			3,
			7,
			3,
			2,
			6,
			3,
			6,
			7,
			4,
			5,
			1,
			4,
			1,
			0,
		];
	}

	override clone(): CubeShape {
		return new CubeShape().copy(this);
	}
}
