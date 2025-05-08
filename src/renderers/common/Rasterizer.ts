import type { Camera } from "../../cameras/Camera.ts";
import { Color, type ColorValue } from "../../common/Color.ts";
import { MathUtils } from "../../maths/MathUtils.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import type { Mesh } from "../../objects/Mesh.ts";
import { CanvasUtils } from "../CanvasUtils.ts";

const _color = new Color(0, 0, 0);
const _pv1 = new Vector3();
const _pv2 = new Vector3();
const _pv3 = new Vector3();
const _p4 = new Vector3();
const _screenP1 = new Vector3();
const _screenP2 = new Vector3();
const _screenP3 = new Vector3();

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
		_color.parse(color);
		const r = MathUtils.fastTrunc(_color.r * 255);
		const g = MathUtils.fastTrunc(_color.g * 255);
		const b = MathUtils.fastTrunc(_color.b * 255);

		for (let i = 0; i < this.data.length; i += 4) {
			this.data[i] = r;
			this.data[i + 1] = g;
			this.data[i + 2] = b;
			this.data[i + 3] = 255; /* alpha */
		}

		return this;
	}

	endFrame(): this {
		this.ctx.putImageData(this.imageData, 0, 0);
		return this;
	}

	drawLine(start: Vector3, end: Vector3, color: ColorValue): this {
		this.#projectToScreen(start, _screenP1);
		this.#projectToScreen(end, _screenP2);

		let x1 = _screenP1.x;
		let y1 = _screenP1.y;
		const x2 = _screenP2.x;
		const y2 = _screenP2.y;

		const dx = Math.abs(x2 - x1);
		const dy = Math.abs(y2 - y1);
		const sx = x1 < x2 ? 1 : -1;
		const sy = y1 < y2 ? 1 : -1;
		let err = dx - dy;

		while (true) {
			if ((x1 >= 0 && x1 < this.width) && (y1 >= 0 && y1 < this.height)) {
				this.setPixel(x1, y1, color);
			}

			if (x1 === x2 && y1 === y2) break;

			const e2 = err << 1;
			if (e2 > -dy) {
				err -= dy;
				x1 += sx;
			}
			if (e2 < dx) {
				err += dx;
				y1 += sy;
			}
		}

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
		this.#projectToScreen(v1, _screenP1);
		this.#projectToScreen(v2, _screenP2);
		this.#projectToScreen(v3, _screenP3);

		const [p1, p2, p3] = this.#sortVerticesByY(_screenP1, _screenP2, _screenP3);

		p1.y === p2.y
			? this.#fillFlatTopTriangle(p1, p2, p3, color)
			: p2.y === p3.y
			? this.#fillFlatBottomTriangle(p1, p2, p3, color)
			: (() => {
				const p4x = p1.x + ((p2.y - p1.y) / (p3.y - p1.y)) * (p3.x - p1.x);
				_p4.set(p4x, p2.y, 0);
				this.#fillFlatBottomTriangle(p1, p2, _p4, color);
				this.#fillFlatTopTriangle(p2, _p4, p3, color);
			})();

		return this;
	}

	rasterize(
		triangle: Vector3[],
		camera: Camera,
		material: Mesh["material"],
	): void {
		if (triangle.length === 3) {
			const cv1 = triangle[0];
			const cv2 = triangle[1];
			const cv3 = triangle[2];

			if (cv1 && cv2 && cv3) {
				_pv1.copy(cv1).applyMatrix4(camera.projectionMatrix);
				_pv2.copy(cv2).applyMatrix4(camera.projectionMatrix);
				_pv3.copy(cv3).applyMatrix4(camera.projectionMatrix);

				this.drawTriangle(
					_pv1,
					_pv2,
					_pv3,
					material.color,
					material.wireframe,
				);
			}
		}
	}

	setPixel(x: number, y: number, color: ColorValue): this {
		_color.parse(color);
		const r = MathUtils.fastTrunc(_color.r * 255);
		const g = MathUtils.fastTrunc(_color.g * 255);
		const b = MathUtils.fastTrunc(_color.b * 255);

		const idx = (y * this.width + x) << 2;
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

	#fillFlatTopTriangle(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
		color: ColorValue,
	): void {
		const { x: x1, y: y1 } = p1;
		const { x: x2, y: y2 } = p2;
		const { x: x3, y: y3 } = p3;

		const edge0 = (x3 - x1) / (y3 - y1);
		const edge1 = (x3 - x2) / (y3 - y2);

		for (
			let y = MathUtils.clamp(Math.ceil(y1), 0, this.height - 1);
			y <= MathUtils.clamp(MathUtils.fastTrunc(y3), 0, this.height - 1);
			y++
		) {
			const sx = x1 + (y - y1) * edge0;
			const ex = x2 + (y - y2) * edge1;
			this.#fillScanline(y, sx, ex, color);
		}
	}

	#fillFlatBottomTriangle(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
		color: ColorValue,
	): void {
		const { x: x1, y: y1 } = p1;
		const { x: x2, y: y2 } = p2;
		const { x: x3, y: y3 } = p3;

		const edge0 = (x2 - x1) / (y2 - y1);
		const edge1 = (x3 - x1) / (y3 - y1);

		for (
			let y = MathUtils.clamp(Math.ceil(y1), 0, this.height - 1);
			y <= MathUtils.clamp(MathUtils.fastTrunc(y2), 0, this.height - 1);
			y++
		) {
			const sx = x1 + (y - y1) * edge0;
			const ex = x1 + (y - y1) * edge1;
			this.#fillScanline(y, sx, ex, color);
		}
	}

	#fillScanline(
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
			MathUtils.fastTrunc(MathUtils.fastMax(x1, x2)),
			0,
			this.width - 1,
		);

		_color.parse(color);
		const r = MathUtils.fastTrunc(_color.r * 255);
		const g = MathUtils.fastTrunc(_color.g * 255);
		const b = MathUtils.fastTrunc(_color.b * 255);

		const rowOffset = y * this.width * 4;

		for (let x = startX; x <= endX; x++) {
			const idx = rowOffset + x * 4;
			this.data[idx] = r;
			this.data[idx + 1] = g;
			this.data[idx + 2] = b;
			this.data[idx + 3] = 255;
		}
	}

	#projectToScreen(vertex: Vector3, target = new Vector3()): Vector3 {
		const screenX = MathUtils.fastTrunc(((vertex.x + 1) * this.width) >> 1);
		const screenY = MathUtils.fastTrunc(((1 - vertex.y) * this.height) >> 1);

		const clippedX = MathUtils.clamp(screenX, 0, this.width - 1);
		const clippedY = MathUtils.clamp(screenY, 0, this.height - 1);
		return target.set(clippedX, clippedY, vertex.z);
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
