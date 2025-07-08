import type { Camera } from "../cameras/Camera";
import { Color } from "../common/Color";
import type { Material } from "../materials/Material";
import { MathUtils } from "../maths/MathUtils";
import { Vector3 } from "../maths/Vector3";
import type { Scene } from "../scenes/Scene";
import type { ColorValue } from "../types";
import { CanvasUtils } from "./canvas/CanvasUtils";
import { RenderPipeline } from "./common/RenderPipeline";
import { Renderer, type RendererOptions } from "./Renderer";

const _pv1 = new Vector3();
const _pv2 = new Vector3();
const _pv3 = new Vector3();
const _p4 = new Vector3();
const _screenP1 = new Vector3();
const _screenP2 = new Vector3();
const _screenP3 = new Vector3();

export class CanvasRenderer extends Renderer {
	context: CanvasRenderingContext2D;
	imageData: ImageData;
	data: Uint8ClampedArray;
	pipeline: RenderPipeline;

	#canvas: HTMLCanvasElement;
	#clearColor = new Color(0, 0, 0);

	static #getPixelIndex(x: number, y: number, width: number): number {
		return (y * width + x) << 2;
	}

	get domElement(): HTMLCanvasElement {
		return this.#canvas;
	}

	constructor(options: RendererOptions = {}) {
		super(options);

		this.#canvas = CanvasUtils.createCanvasElement();
		this.#canvas.width = this.width;
		this.#canvas.height = this.height;

		this.context = CanvasUtils.createCanvasRenderingContext2D(this.#canvas, {
			willReadFrequently: true,
		});
		this.context.imageSmoothingEnabled = false;

		this.imageData = this.context.createImageData(this.width, this.height);
		this.data = this.imageData.data;

		this.pipeline = new RenderPipeline(this.width, this.height);
	}

	beginFrame(): this {
		this.data = this.imageData.data;
		return this;
	}

	clear(color: ColorValue): this {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				this.setPixel(x, y, color);
			}
		}
		return this;
	}

	drawLine(start: Vector3, end: Vector3, color: ColorValue): this {
		this.#projectToScreen(start, _screenP1);
		this.#projectToScreen(end, _screenP2);

		const dx = Math.abs(_screenP2.x - _screenP1.x);
		const dy = Math.abs(_screenP2.y - _screenP1.y);
		if (dx < 1 && dy < 1) {
			return this;
		}

		let x1 = _screenP1.x;
		let y1 = _screenP1.y;
		const x2 = _screenP2.x;
		const y2 = _screenP2.y;

		const sx = x1 < x2 ? 1 : -1;
		const sy = y1 < y2 ? 1 : -1;
		let err = dx - dy;

		while (true) {
			if (x1 >= 0 && x1 < this.width && y1 >= 0 && y1 < this.height) {
				this.setPixel(x1, y1, color);
			}
			if (x1 === x2 && y1 === y2) {
				break;
			}

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
		if (wireframe) {
			this.drawLine(v1, v2, color);
			this.drawLine(v2, v3, color);
			this.drawLine(v3, v1, color);
		} else {
			this.drawTriangleFilled(v1, v2, v3, color);
		}

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

		const [p1, p2, p3] = this.#sortVerticesY(_screenP1, _screenP2, _screenP3);

		p1.y === p2.y
			? this.#fillFlatTriangleTop(p1, p2, p3, color)
			: p2.y === p3.y
				? this.#fillFlatTriangleBottom(p1, p2, p3, color)
				: (() => {
						const p4x = p1.x + ((p2.y - p1.y) / (p3.y - p1.y)) * (p3.x - p1.x);
						_p4.set(p4x, p2.y, 0);
						this.#fillFlatTriangleBottom(p1, p2, _p4, color);
						this.#fillFlatTriangleTop(p2, _p4, p3, color);
					})();

		return this;
	}

	endFrame(): this {
		this.context.putImageData(this.imageData, 0, 0);
		return this;
	}

	rasterize(triangle: Vector3[], camera: Camera, material: Material): void {
		if (triangle.length === 3) {
			const cv1 = triangle[0];
			const cv2 = triangle[1];
			const cv3 = triangle[2];

			if (cv1 && cv2 && cv3) {
				_pv1.copy(cv1).applyMatrix4(camera.projectionMatrix);
				_pv2.copy(cv2).applyMatrix4(camera.projectionMatrix);
				_pv3.copy(cv3).applyMatrix4(camera.projectionMatrix);

				this.drawTriangle(_pv1, _pv2, _pv3, material.color, material.wireframe);
			}
		}
	}

	setClearColor(color: ColorValue): this {
		color instanceof Color
			? this.#clearColor.copy(color)
			: this.#clearColor.parse(color);
		return this;
	}

	setPixel(x: number, y: number, color: ColorValue): this {
		const idx = CanvasRenderer.#getPixelIndex(x, y, this.width);
		this.#setPixelData(idx, color);
		return this;
	}

	setSize(width: number, height: number): this {
		this.width = width;
		this.height = height;

		this.#canvas.style.width = `${width}px`;
		this.#canvas.style.height = `${height}px`;
		this.#canvas.width = width;
		this.#canvas.height = height;
		this.context.imageSmoothingEnabled = false;

		this.imageData = this.context.createImageData(width, height);
		this.data = this.imageData.data;

		this.pipeline.setSize(width, height);

		return this;
	}

	#fillFlatTriangle(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
		color: ColorValue,
		isTopTriangle: boolean,
	): void {
		const { x: x1, y: y1 } = p1;
		const { x: x2, y: y2 } = p2;
		const { x: x3, y: y3 } = p3;

		const edge0 = isTopTriangle ? (x3 - x1) / (y3 - y1) : (x2 - x1) / (y2 - y1);
		const edge1 = isTopTriangle ? (x3 - x2) / (y3 - y2) : (x3 - x1) / (y3 - y1);

		const startY = MathUtils.clamp(Math.ceil(y1), 0, this.height - 1);
		const endY = MathUtils.clamp(
			MathUtils.fastTrunc(isTopTriangle ? y3 : y2),
			0,
			this.height - 1,
		);

		for (let y = startY; y <= endY; y++) {
			const sx = x1 + (y - y1) * edge0;
			const ex = isTopTriangle ? x2 + (y - y2) * edge1 : x1 + (y - y1) * edge1;
			this.#fillScanline(y, sx, ex, color);
		}
	}

	#fillFlatTriangleBottom(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
		color: ColorValue,
	): void {
		this.#fillFlatTriangle(p1, p2, p3, color, false);
	}

	#fillFlatTriangleTop(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
		color: ColorValue,
	): void {
		this.#fillFlatTriangle(p1, p2, p3, color, true);
	}

	#fillScanline(y: number, x1: number, x2: number, color: ColorValue): void {
		const startX = MathUtils.clamp(
			Math.ceil(MathUtils.fastMin(x1, x2)),
			0,
			this.width - 1,
		);
		const endX = MathUtils.clamp(
			MathUtils.fastTrunc(MathUtils.fastMax(x1, x2)),
			0,
			this.width - 1,
		);

		for (let x = startX; x <= endX; x++) {
			this.setPixel(x, y, color);
		}
	}

	#projectToScreen(vertex: Vector3, target = new Vector3()): Vector3 {
		const screenX = MathUtils.fastTrunc(((vertex.x + 1) * this.width) >> 1);
		const screenY = MathUtils.fastTrunc(((1 - vertex.y) * this.height) >> 1);

		const clippedX = MathUtils.clamp(screenX, 0, this.width - 1);
		const clippedY = MathUtils.clamp(screenY, 0, this.height - 1);
		return target.set(clippedX, clippedY, vertex.z);
	}

	#setPixelData(idx: number, color: ColorValue): void {
		const rgb = Color.toRgb(color);
		this.data[idx] = rgb.r;
		this.data[idx + 1] = rgb.g;
		this.data[idx + 2] = rgb.b;
		this.data[idx + 3] = Color.RGB_SCALE;
	}

	#sortVerticesY(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3,
	): [Vector3, Vector3, Vector3] {
		let sortedP1 = p1.clone();
		let sortedP2 = p2.clone();
		let sortedP3 = p3.clone();

		if (sortedP1.y > sortedP2.y) {
			[sortedP1, sortedP2] = [sortedP2, sortedP1];
		}
		if (sortedP1.y > sortedP3.y) {
			[sortedP1, sortedP3] = [sortedP3, sortedP1];
		}
		if (sortedP2.y > sortedP3.y) {
			[sortedP2, sortedP3] = [sortedP3, sortedP2];
		}
		return [sortedP1, sortedP2, sortedP3];
	}

	override render(scene: Scene, camera: Camera): this {
		super.render(scene, camera);

		this.beginFrame();
		this.clear(this.#clearColor);

		this.pipeline.render(scene, camera, this);

		this.endFrame();

		return this;
	}
}
