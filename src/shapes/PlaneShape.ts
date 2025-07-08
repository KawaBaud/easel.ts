import { Vector3 } from "../maths/Vector3";
import { Shape } from "./Shape";

export class PlaneShape extends Shape {
	constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
		super();

		const gridX = Math.floor(widthSegments);
		const gridY = Math.floor(heightSegments);
		const gridX1 = gridX + 1;
		const gridY1 = gridY + 1;

		const segmentWidth = width / gridX;
		const segmentHeight = height / gridY;
		const widthHalf = width / 2;
		const heightHalf = height / 2;

		this.vertices = Array.from({ length: gridX1 * gridY1 }, (_, i) => {
			const ix = i % gridX1;
			const iy = Math.floor(i / gridX1);
			return new Vector3(
				ix * segmentWidth - widthHalf,
				iy * segmentHeight - heightHalf,
				0,
			);
		});

		this.indices = new Uint16Array(gridX * gridY * 6);
		for (let i = 0; i < this.indices.length; i++) {
			const cellIndex = Math.floor(i / 6);

			const ix = cellIndex % gridX;
			const iy = Math.floor(cellIndex / gridX);

			const a = ix + gridX1 * iy;
			const b = ix + gridX1 * (iy + 1);
			const c = ix + 1 + gridX1 * (iy + 1);
			const d = ix + 1 + gridX1 * iy;
			this.indices[i] = Number([a, b, d, b, c, d][i % 6]);
		}
	}

	override clone(): PlaneShape {
		return new PlaneShape().copy(this);
	}
}
