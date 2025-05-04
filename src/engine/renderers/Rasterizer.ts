import type { Vector3 } from "../maths/Vector3.ts";

export abstract class Rasterizer {
	readonly isRasterizer = true;

	abstract beginFrame(): void;
	abstract clear(color?: string | number): void;
	abstract drawLine(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		color?: string | number,
	): void;
	abstract drawPixel(
		x: number,
		y: number,
		color?: string | number,
	): void;
	abstract drawTriangle(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		color?: string | number,
	): void;
	abstract drawTriangleFilled(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		color?: string | number,
	): void;
	abstract endFrame(): void;
}
