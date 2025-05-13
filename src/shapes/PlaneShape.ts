import { Vector3 } from "../maths/Vector3.ts";
import { Shape } from "./Shape.ts";

export class PlaneShape extends Shape {
	constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
		super();

		const gridX = Math.floor(widthSegments);
		const gridY = Math.floor(heightSegments);
		const gridX1 = gridX + 1;
		const gridY1 = gridY + 1;

		const segmentWidth = width / gridX;
		const segmentHeight = height / gridY;

		for (let iy = 0; iy < gridY1; iy++) {
			const y = iy * segmentHeight - height / 2;
			for (let ix = 0; ix < gridX1; ix++) {
				const x = ix * segmentWidth - width / 2;
				this.vertices.push(new Vector3(x, y, 0));
			}
		}

		for (let iy = 0; iy < gridY; iy++) {
			for (let ix = 0; ix < gridX; ix++) {
				const a = ix + gridX1 * iy;
				const b = ix + gridX1 * (iy + 1);
				const c = (ix + 1) + gridX1 * (iy + 1);
				const d = (ix + 1) + gridX1 * iy;

				this.indices.push(a, b, d);
				this.indices.push(b, c, d);
			}
		}
	}

	override clone(): PlaneShape {
		return new PlaneShape().copy(this);
	}
}
