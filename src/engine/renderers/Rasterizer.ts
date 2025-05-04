import type { Color } from "../core/Color.ts";
import type { Vector3 } from "../maths/Vector3.ts";

export abstract class Rasterizer {
	readonly isRasterizer: boolean = true;

	abstract beginFrame(): void;
	abstract clear(color?: Color): void;

	abstract drawLine(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		color?: Color,
	): void;
	abstract drawPixel(
		x: number,
		y: number,
		color?: Color,
	): void;
	abstract drawTriangle(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		color?: Color,
	): void;

	abstract endFrame(): void;
}
