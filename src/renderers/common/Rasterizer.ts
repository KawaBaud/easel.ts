import type { Camera } from "../../cameras/Camera.ts";
import { Color, type ColorValue } from "../../common/Color.ts";
import { MathUtils } from "../../maths/MathUtils.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import type { Mesh } from "../../objects/Mesh.ts";
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

	#tempColor = new Color(0, 0, 0);

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
		const r = MathUtils.fastTrunc(this.#tempColor.r * 255);
		const g = MathUtils.fastTrunc(this.#tempColor.g * 255);
		const b = MathUtils.fastTrunc(this.#tempColor.b * 255);

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

		const x1 = MathUtils.fastTrunc(p1.x);
		const y1 = MathUtils.fastTrunc(p1.y);
		const x2 = MathUtils.fastTrunc(p2.x);
		const y2 = MathUtils.fastTrunc(p2.y);

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

		const screenX = MathUtils.fastTrunc(screenPoint.x);
		const screenY = MathUtils.fastTrunc(screenPoint.y);
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
		wireframe
			? (
				this.drawLine(v1, v2, color),
					this.drawLine(v2, v3, color),
					this.drawLine(v3, v1, color)
			)
			: this.drawTriangleFilled(v1, v2, v3, color);
		return this;
	}

	drawTriangleFilled(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		color: ColorValue,
	): this {
		let p1 = this.#projectToScreen(v1);
		let p2 = this.#projectToScreen(v2);
		let p3 = this.#projectToScreen(v3);
		[p1, p2, p3] = this.#sortVerticesByY(p1, p2, p3);

		p1.y === p2.y
			? this.#drawFlatTopTriangle(p1, p2, p3, color)
			: p2.y === p3.y
			? this.#drawFlatBottomTriangle(p1, p2, p3, color)
			: (() => {
				const p4x = p1.x + ((p2.y - p1.y) / (p3.y - p1.y)) * (p3.x - p1.x);
				const p4 = new Vector3(p4x, p2.y, 0);

				this.#drawFlatBottomTriangle(p1, p2, p4, color);
				this.#drawFlatTopTriangle(p2, p4, p3, color);
			})();
		return this;
	}

	getPixel(x: number, y: number): ColorValue {
		const idx = (y * this.width + x) * 4;

		const r = this.data[idx];
		const g = this.data[idx + 1];
		const b = this.data[idx + 2];
		return `rgb(${r}, ${g}, ${b})`;
	}

	rasterizeTriangle(
		triangle: Vector3[],
		camera: Camera,
		material: Mesh["material"],
	): void {
		if (triangle.length === 3) {
			const cv1 = triangle[0];
			const cv2 = triangle[1];
			const cv3 = triangle[2];

			if (cv1 && cv2 && cv3) {
				cv1.applyMatrix4(camera.projectionMatrix);
				cv2.applyMatrix4(camera.projectionMatrix);
				cv3.applyMatrix4(camera.projectionMatrix);

				this.drawTriangle(
					cv1,
					cv2,
					cv3,
					material.color,
					material.wireframe,
				);
			}
		}
	}

	setPixel(x: number, y: number, color: ColorValue): this {
		this.#tempColor.parse(color);
		const r = MathUtils.fastTrunc(this.#tempColor.r * 255);
		const g = MathUtils.fastTrunc(this.#tempColor.g * 255);
		const b = MathUtils.fastTrunc(this.#tempColor.b * 255);

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

	#drawFlatTopTriangle(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
		color: ColorValue,
	): void {
		const { x: x1, y: y1 } = p1;
		const { x: x2, y: y2 } = p2;
		const { x: x3, y: y3 } = p3;

		const dP1P3 = (x3 - x1) / (y3 - y1);
		const dP2P3 = (x3 - x2) / (y3 - y2);

		for (
			let y = MathUtils.clamp(Math.ceil(y1), 0, this.height - 1);
			y <= MathUtils.clamp(Math.floor(y3), 0, this.height - 1);
			y++
		) {
			const sx = x1 + (y - y1) * dP1P3;
			const ex = x2 + (y - y2) * dP2P3;
			this.#scanline(y, sx, ex, color);
		}
	}

	#drawFlatBottomTriangle(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
		color: ColorValue,
	): void {
		const { x: x1, y: y1 } = p1;
		const { x: x2, y: y2 } = p2;
		const { x: x3, y: y3 } = p3;

		const dP1P2 = (x2 - x1) / (y2 - y1);
		const dP1P3 = (x3 - x1) / (y3 - y1);

		for (
			let y = MathUtils.clamp(Math.ceil(y1), 0, this.height - 1);
			y <= MathUtils.clamp(Math.floor(y2), 0, this.height - 1);
			y++
		) {
			const sx = x1 + (y - y1) * dP1P2;
			const ex = x1 + (y - y1) * dP1P3;
			this.#scanline(y, sx, ex, color);
		}
	}

	#projectToScreen(vertex: Vector3): Vector3 {
		const screenX = MathUtils.fastRound((vertex.x + 1) * 0.5 * this.width);
		const screenY = MathUtils.fastRound((1 - vertex.y) * 0.5 * this.height);
		return new Vector3(screenX, screenY, vertex.z);
	}

	#scanline(
		y: number,
		x1: number,
		x2: number,
		color: ColorValue,
	): void {
		const startX = MathUtils.clamp(
			Math.ceil(Math.min(x1, x2)),
			0,
			this.width - 1,
		);
		const endX = MathUtils.clamp(
			Math.floor(Math.max(x1, x2)),
			0,
			this.width - 1,
		);
		for (let x = startX; x <= endX; x++) {
			this.setPixel(x, y, color);
		}
	}

	#sortVerticesByY(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
	): [Vector3, Vector3, Vector3] {
		if (p1.y > p2.y) [p1, p2] = [p2, p1];
		if (p1.y > p3.y) [p1, p3] = [p3, p1];
		if (p2.y > p3.y) [p2, p3] = [p3, p2];
		return [p1, p2, p3];
	}
}
