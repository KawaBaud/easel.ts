import { Color, type ColorValue } from "../../common/Color.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import { CanvasUtils } from "../CanvasUtils.ts";

export interface RasterizerOptions {
	width?: number;
	height?: number;
	canvas?: HTMLCanvasElement;
}

export class Rasterizer {
	width: number;
	height: number;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	imageData: ImageData;
	data: Uint8ClampedArray;
	#tempColor = new Color();

	constructor(options: RasterizerOptions = {}) {
		this.width = options.width ?? globalThis.innerWidth;
		this.height = options.height ?? globalThis.innerHeight;

		this.canvas = options.canvas ?? CanvasUtils.createCanvasElement();
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.ctx = CanvasUtils.createCanvasRenderingContext2D(this.canvas, {
			willReadFrequently: true,
		});
		this.ctx.imageSmoothingEnabled = false;

		this.imageData = this.ctx.createImageData(this.width, this.height);
		this.data = this.imageData.data;
	}

	beginFrame(): this {
		this.data = this.imageData.data;
		return this;
	}

	clear(color: ColorValue): this {
		this.#tempColor.parse(color);
		const r = (this.#tempColor.r * 255) | 0;
		const g = (this.#tempColor.g * 255) | 0;
		const b = (this.#tempColor.b * 255) | 0;

		for (let i = 0; i < this.data.length; i += 4) {
			this.data[i] = r;
			this.data[i + 1] = g;
			this.data[i + 2] = b;
			this.data[i + 3] = 255; // alpha
		}
		return this;
	}

	endFrame(): this {
		this.ctx.putImageData(this.imageData, 0, 0);
		return this;
	}

	drawLine(start: Vector3, end: Vector3, color: ColorValue): this {
		const p1 = this.#projectToScreen(start);
		const p2 = this.#projectToScreen(end);

		const x1 = p1.x | 0;
		const y1 = p1.y | 0;
		const x2 = p2.x | 0;
		const y2 = p2.y | 0;

		if (
			(x1 < 0 && x2 < 0) ||
			(y1 < 0 && y2 < 0) ||
			(x1 >= this.width && x2 >= this.width) ||
			(y1 >= this.height && y2 >= this.height)
		) return this;

		const dx = Math.abs(x2 - x1);
		const dy = Math.abs(y2 - y1);
		const sx = x1 < x2 ? 1 : -1;
		const sy = y1 < y2 ? 1 : -1;
		let err = dx - dy;

		this.#tempColor.parse(color);
		let x = x1;
		let y = y1;

		while (true) {
			if (
				(x >= 0 && x < this.width) &&
				(y >= 0 && y < this.height)
			) this.setPixel(x, y, color);

			if (x === x2 && y === y2) break;

			const e2 = err << 1;
			if (e2 > -dy) {
				err -= dy;
				x += sx;
			}
			if (e2 < dx) {
				err += dx;
				y += sy;
			}
		}

		return this;
	}

	drawPoint(point: Vector3, color: ColorValue): this {
		const screenPoint = this.#projectToScreen(point);

		const screenX = screenPoint.x | 0;
		const screenY = screenPoint.y | 0;
		if (
			(screenX < 0 || (screenX >= this.width)) ||
			(screenY < 0 || (screenY >= this.height))
		) return this;

		this.setPixel(screenX, screenY, color);
		return this;
	}

	drawTriangle(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		color: ColorValue,
		wireframe = false,
	): this {
		if (wireframe) {
			this.drawLine(v1, v2, color);
			this.drawLine(v2, v3, color);
			this.drawLine(v3, v1, color);
			return this;
		}
		return this;
	}

	getPixel(x: number, y: number): ColorValue {
		const idx = (y * this.width + x) * 4;

		const r = this.data[idx];
		const g = this.data[idx + 1];
		const b = this.data[idx + 2];
		return `rgb(${r}, ${g}, ${b})`;
	}

	setPixel(x: number, y: number, color: ColorValue): this {
		this.#tempColor.parse(color);
		const r = (this.#tempColor.r * 255) | 0;
		const g = (this.#tempColor.g * 255) | 0;
		const b = (this.#tempColor.b * 255) | 0;

		const idx = (y * this.width + x) * 4;
		this.data[idx] = r;
		this.data[idx + 1] = g;
		this.data[idx + 2] = b;
		this.data[idx + 3] = 255;

		return this;
	}

	setSize(width: number, height: number): this {
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx.imageSmoothingEnabled = false;

		this.imageData = this.ctx.createImageData(width, height);
		this.data = this.imageData.data;

		return this;
	}

	#projectToScreen(point: Vector3): Vector3 {
		const x = ((point.x + 1) * this.width / 2) | 0;
		const y = ((-point.y + 1) * this.height / 2) | 0;
		return new Vector3(x, y, point.z);
	}
}
