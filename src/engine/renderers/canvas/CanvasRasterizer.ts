import { Vector2 } from "../../maths/Vector2.ts";
import type { Vector3 } from "../../maths/Vector3.ts";
import { Rasterizer } from "../Rasterizer.ts";
import { CanvasUtils } from "./CanvasUtils.ts";

export class CanvasRasterizer extends Rasterizer {
	readonly isCanvasRasterizer = true;

	#context: CanvasRenderingContext2D;
	#imageData: ImageData | null = null;
	#canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		super();
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

	clear(color: string | number = "#000000"): void {
		const colorStr = typeof color === "number"
			? `#${color.toString(16).padStart(6, "0")}`
			: color;
		this.#context.fillStyle = colorStr;
		this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
	}

	drawLine(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		color: string | number = "#FFFFFF",
	): void {
		const colorStr = typeof color === "number"
			? `#${color.toString(16).padStart(6, "0")}`
			: color;
		const dx = Math.abs(x1 - x0);
		const dy = -Math.abs(y1 - y0);
		const stepX = x0 < x1 ? 1 : -1;
		const stepY = y0 < y1 ? 1 : -1;
		let err = dx + dy;

		this.drawPixel(x0, y0, colorStr);

		while (true) {
			if (x0 === x1 && y0 === y1) break;
			const err2 = err << 1;
			if (err2 > dy) {
				err += dy;
				x0 += stepX;
			}
			if (err2 < dx) {
				err += dx;
				y0 += stepY;
			}
			this.drawPixel(x0, y0, colorStr);
		}
	}

	drawPixel(
		x: number,
		y: number,
		color: string | number = "#FFFFFF",
	): void {
		const colorStr = typeof color === "number"
			? `#${color.toString(16).padStart(6, "0")}`
			: color;
		this.#context.fillStyle = colorStr;
		this.#context.fillRect(x, y, 1, 1);
	}

	drawTriangle(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		color: string | number = "#FFFFFF",
	): void {
		if (!v1 || !v2) return;

		const hasBehindCamera = (v1 && "behindCamera" in v1 && v1.behindCamera) ||
			(v2 && "behindCamera" in v2 && v2.behindCamera) ||
			(v3 && "behindCamera" in v3 && v3.behindCamera);
		if (hasBehindCamera) return;

		if (!v3) {
			this.drawLine(v1.x, v1.y, v2.x, v2.y, color);
			return;
		}

		this.drawLine(v1.x, v1.y, v2.x, v2.y, color);
		this.drawLine(v2.x, v2.y, v3.x, v3.y, color);
		this.drawLine(v3.x, v3.y, v1.x, v1.y, color);
	}

	drawTriangleFilled(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		color: string | number = "#FFFFFF",
	): void {
		if (!v1 || !v2 || !v3) return;

		const hasBehindCamera = (v1 && "behindCamera" in v1 && v1.behindCamera) ||
			(v2 && "behindCamera" in v2 && v2.behindCamera) ||
			(v3 && "behindCamera" in v3 && v3.behindCamera);
		if (hasBehindCamera) return;

		const p1 = new Vector2(
			Math.round(v1.x),
			Math.round(v1.y),
		);
		const p2 = new Vector2(
			Math.round(v2.x),
			Math.round(v2.y),
		);
		const p3 = new Vector2(
			Math.round(v3.x),
			Math.round(v3.y),
		);

		const points = [p1, p2, p3];
		points.sort((a, b) => a.y - b.y);

		if (points.length < 3) return;

		const top = points[0];
		const middle = points[1];
		const bottom = points[2];

		if (!top || !middle || !bottom) return;

		let r = 255;
		let g = 255;
		let b = 255;
		if (typeof color === "number") {
			r = (color >> 16) & 0xFF;
			g = (color >> 8) & 0xFF;
			b = color & 0xFF;
		}

		this.#fillFlatBottomTriangle(top, middle, bottom, r, g, b);
		this.#fillFlatTopTriangle(top, middle, bottom, r, g, b);
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

		const index = (Math.trunc(y) * this.#imageData.width +
			Math.trunc(x)) * 4;

		return this.#imageData.data.slice(index, index + 4);
	}

	setPixel(
		x: number,
		y: number,
		r: number,
		g: number,
		b: number,
		a = 255,
	): void {
		if (!this.#imageData) {
			throw new Error("beginFrame must be called before setPixel");
		}

		const index = (Math.trunc(y) * this.#imageData.width +
			Math.trunc(x)) * 4;

		this.#imageData.data[index] = r;
		this.#imageData.data[index + 1] = g;
		this.#imageData.data[index + 2] = b;
		this.#imageData.data[index + 3] = a;
	}

	#fillFlatBottomTriangle(
		top: Vector2,
		middle: Vector2,
		bottom: Vector2,
		r: number,
		g: number,
		b: number,
	): void {
		if (middle.y === top.y) return;

		const slopeLeft = (middle.x - top.x) / (middle.y - top.y);
		const slopeRight = (bottom.x - top.x) / (bottom.y - top.y);

		let xLeft = top.x;
		let xRight = top.x;

		for (let y = top.y; y <= middle.y; y++) {
			this.#drawHorizontalLine(
				Math.round(xLeft),
				Math.round(xRight),
				y,
				r,
				g,
				b,
			);
			xLeft += slopeLeft;
			xRight += slopeRight;
		}
	}

	#fillFlatTopTriangle(
		top: Vector2,
		middle: Vector2,
		bottom: Vector2,
		r: number,
		g: number,
		b: number,
	): void {
		if (middle.y === bottom.y) return;

		const slopeLeft = (bottom.x - middle.x) / (bottom.y - middle.y);
		const slopeRight = (bottom.x - top.x) / (bottom.y - top.y);

		let xLeft = bottom.x;
		let xRight = bottom.x;

		for (let y = bottom.y; y >= middle.y; y--) {
			this.#drawHorizontalLine(
				Math.round(xLeft),
				Math.round(xRight),
				y,
				r,
				g,
				b,
			);
			xLeft -= slopeLeft;
			xRight -= slopeRight;
		}
	}

	#drawHorizontalLine(
		x1: number,
		x2: number,
		y: number,
		r: number,
		g: number,
		b: number,
	): void {
		if (x1 > x2) [x1, x2] = [x2, x1];

		for (let x = x1; x <= x2; x++) {
			this.setPixel(x, y, r, g, b);
		}
	}
}
