import { Color } from "../../core/Color.ts";
import type { Vector3 } from "../../maths/Vector3.ts";
import { CanvasUtils } from "../canvas/CanvasUtils.ts";

export class Rasterizer {
	readonly isRasterizer: boolean = true;

	#context: CanvasRenderingContext2D;
	#imageData: ImageData | null = null;
	#canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		this.#canvas = canvas;
		this.#context = CanvasUtils.createCanvasRenderingContext2D(canvas, {
			willReadFrequently: true,
		});
	}

	beginFrame(): void {
		this.#imageData = this.#context.getImageData(
			0,
			0,
			this.#canvas.width,
			this.#canvas.height,
		);
	}

	clear(color?: Color): void {
		if (!color) color = new Color(0, 0, 0);
		this.#context.fillStyle = color.toString();
		this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
	}

	drawLine(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		color?: Color,
	): void {
		x0 = Math.floor(x0);
		y0 = Math.floor(y0);
		x1 = Math.floor(x1);
		y1 = Math.floor(y1);

		const dx = Math.abs(x1 - x0);
		const dy = Math.abs(y1 - y0);
		const sx = x0 < x1 ? 1 : -1;
		const sy = y0 < y1 ? 1 : -1;
		let err = dx - dy;

		while (true) {
			this.setPixel(x0, y0, color);
			if (x0 === x1 && y0 === y1) break;
			const e2 = 2 * err;
			if (e2 > -dy) {
				err -= dy;
				x0 += sx;
			}
			if (e2 < dx) {
				err += dx;
				y0 += sy;
			}
		}
	}

	drawPixel(
		x: number,
		y: number,
		color?: Color,
	): void {
		this.setPixel(x, y, color);
	}

	drawTriangle(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		color?: Color,
	): void {
		if (!v1 || !v2) return;
		if (!v3) {
			this.drawLine(v1.x, v1.y, v2.x, v2.y, color);
			return;
		}

		this.drawLine(v1.x, v1.y, v2.x, v2.y, color);
		this.drawLine(v2.x, v2.y, v3.x, v3.y, color);
		this.drawLine(v3.x, v3.y, v1.x, v1.y, color);
	}

	endFrame(): void {
		if (this.#imageData) {
			this.#context.putImageData(this.#imageData, 0, 0);
			this.#imageData = null;
		}
	}

	getPixel(x: number, y: number): Uint8ClampedArray {
		if (!this.#imageData) {
			throw new Error("beginFrame must be called before getPixel");
		}

		x = Math.floor(x);
		y = Math.floor(y);

		if (
			(x < 0 || x >= this.#imageData.width) ||
			(y < 0 || y >= this.#imageData.height)
		) return new Uint8ClampedArray([0, 0, 0, 0]);

		const index = (y * this.#imageData.width + x) * 4;
		return this.#imageData.data.slice(index, index + 4);
	}

	setPixel(
		x: number,
		y: number,
		color?: Color,
	): void {
		if (!this.#imageData) {
			throw new Error("beginFrame must be called before setPixel");
		}

		x = Math.floor(x);
		y = Math.floor(y);

		if (
			x < 0 || x >= this.#imageData.width || y < 0 ||
			y >= this.#imageData.height
		) return;

		const index = (y * this.#imageData.width + x) * 4;

		if (color) {
			this.#imageData.data[index] = color.r * 255;
			this.#imageData.data[index + 1] = color.g * 255;
			this.#imageData.data[index + 2] = color.b * 255;
			this.#imageData.data[index + 3] = 255;
		} else {
			this.#imageData.data[index] = 255;
			this.#imageData.data[index + 1] = 255;
			this.#imageData.data[index + 2] = 255;
			this.#imageData.data[index + 3] = 255;
		}
	}
}
