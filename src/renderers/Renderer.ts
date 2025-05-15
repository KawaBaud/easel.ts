import type { Camera } from "../cameras/Camera.ts";
import { PerspCamera } from "../cameras/PerspCamera.ts";
import { Color } from "../common/Color.ts";
import type { Scene } from "../scenes/Scene.ts";
import type { ColorValue } from "../types.ts";
import { CanvasUtils } from "./canvas/CanvasUtils.ts";
import { RenderPipeline } from "./pipelines/RenderPipeline.ts";
import { Rasterizer } from "./Rasterizer.ts";

export interface RendererOptions {
	width?: number;
	height?: number;
	alpha?: boolean;
}

export class Renderer {
	width: number;
	height: number;
	alpha: boolean;

	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;

	imageData: ImageData;
	data: Uint8ClampedArray;

	rasterizer: Rasterizer;
	pipeline: RenderPipeline;

	#clearColor = new Color(0, 0, 0);

	get aspect(): number {
		return this.width / this.height;
	}

	get domElement(): HTMLCanvasElement {
		return this.canvas;
	}

	constructor(options: RendererOptions = {}) {
		this.width = options.width ?? globalThis.innerWidth;
		this.height = options.height ?? globalThis.innerHeight;
		this.alpha = options.alpha ?? false;

		this.canvas = CanvasUtils.createCanvasElement();
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.context = CanvasUtils.createCanvasRenderingContext2D(this.canvas, {
			willReadFrequently: true,
		});
		this.context.imageSmoothingEnabled = false;

		this.imageData = this.context.createImageData(this.width, this.height);
		this.data = this.imageData.data;

		this.rasterizer = new Rasterizer({
			width: this.width,
			height: this.height,
			canvas: this.canvas,
		});
		this.pipeline = new RenderPipeline(this.width, this.height);
	}

	render(scene: Scene, camera: Camera): this {
		if (camera instanceof PerspCamera) {
			const currentAspect = this.aspect;
			if (camera.aspect !== currentAspect) {
				camera.aspect = currentAspect;
				camera.updateProjectionMatrix();
			}
		}

		camera.updateMatrixWorld();

		this.rasterizer.beginFrame();
		this.rasterizer.clear(this.#clearColor);

		this.pipeline.render(scene, camera, this.rasterizer);

		this.rasterizer.endFrame();

		return this;
	}

	setClearColor(color: ColorValue): this {
		color instanceof Color
			? this.#clearColor.copy(color)
			: this.#clearColor.parse(color);
		return this;
	}

	setSize(width: number, height: number): this {
		this.width = width;
		this.height = height;

		this.canvas.style.width = `${width}px`;
		this.canvas.style.height = `${height}px`;
		this.canvas.width = width;
		this.canvas.height = height;
		this.context.imageSmoothingEnabled = false;

		this.imageData = this.context.createImageData(width, height);
		this.data = this.imageData.data;

		this.rasterizer.setSize(width, height);
		this.pipeline.setSize(width, height);

		return this;
	}
}
