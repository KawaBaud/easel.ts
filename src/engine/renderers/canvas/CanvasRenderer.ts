import type { Camera } from "../../cameras/Camera.ts";
import type { Vector3 } from "../../maths/Vector3.ts";
import { Vector4 } from "../../maths/Vector4.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { Renderer } from "../Renderer.ts";
import { RenderPipeline } from "../common/RenderPipeline.ts";
import { CanvasRasterizer } from "./CanvasRasterizer.ts";
import { CanvasUtils } from "./CanvasUtils.ts";

export class CanvasRenderer extends Renderer {
	readonly isCanvasRenderer = true;

	domElement: HTMLCanvasElement;
	#bufferCanvas: HTMLCanvasElement;
	#rasterizer: CanvasRasterizer;
	#renderPipeline: RenderPipeline;
	#currentViewport: Vector4;
	#currentScissor: Vector4;
	#currentScissorTest = false;
	#pixelRatio = 1;

	constructor(options: { width?: number; height?: number } = {}) {
		super();

		this.domElement = CanvasUtils.createCanvasElement();
		this.#bufferCanvas = globalThis.document.createElement("canvas");
		this.#bufferCanvas.width = options.width ?? globalThis.innerWidth;
		this.#bufferCanvas.height = options.height ?? globalThis.innerHeight;

		this.#rasterizer = new CanvasRasterizer(this.#bufferCanvas);
		this.#renderPipeline = new RenderPipeline();

		this.#currentViewport = new Vector4(
			0,
			0,
			this.#bufferCanvas.width,
			this.#bufferCanvas.height,
		);
		this.#currentScissor = new Vector4(
			0,
			0,
			this.#bufferCanvas.width,
			this.#bufferCanvas.height,
		);

		this.setSize(
			options.width ?? globalThis.innerWidth,
			options.height ?? globalThis.innerHeight,
		);
	}

	clear(color: string | number = "#000000"): void {
		this.#rasterizer.clear(color);
	}

	render(scene: Scene, camera: Camera): void {
		this.#rasterizer.clear(scene.background ?? "#000000");
		this.#rasterizer.beginFrame();

		const ctx = this.#bufferCanvas.getContext("2d");
		if (ctx) {
			if (this.#currentScissorTest) {
				ctx.save();
				ctx.beginPath();
				ctx.rect(
					this.#currentScissor.x,
					this.#currentScissor.y,
					this.#currentScissor.z,
					this.#currentScissor.w,
				);
				ctx.clip();
			}

			this.#renderPipeline.render(
				scene,
				camera,
				(
					p1: Vector3,
					p2: Vector3,
					p3: Vector3,
					color: number,
					wireframe: boolean,
				) => {
					if (wireframe) {
						this.#rasterizer.drawTriangle(p1, p2, p3, color);
					} else {
						this.#rasterizer.drawTriangleFilled(p1, p2, p3, color);
					}
				},
			);

			if (this.#currentScissorTest) ctx.restore();
		}

		this.#rasterizer.endFrame();

		const displayCtx = this.domElement.getContext("2d");
		if (!displayCtx) return;
		displayCtx.imageSmoothingEnabled = false;

		displayCtx.clearRect(
			0,
			0,
			this.domElement.width,
			this.domElement.height,
		);
		displayCtx.drawImage(
			this.#bufferCanvas,
			0,
			0,
			this.#bufferCanvas.width,
			this.#bufferCanvas.height,
			0,
			0,
			this.domElement.width,
			this.domElement.height,
		);
	}

	setPixelRatio(ratio: number): void {
		this.#pixelRatio = ratio;
		this.setSize(this.domElement.width, this.domElement.height);
	}

	setScissor(scissor: Vector4): this {
		this.#currentScissor.copy(scissor);
		return this;
	}

	setScissorTest(enable: boolean): this {
		this.#currentScissorTest = enable;
		return this;
	}

	setSize(width: number, height: number): void {
		this.domElement.width = width * this.#pixelRatio;
		this.domElement.height = height * this.#pixelRatio;
		this.domElement.style.width = `${width}px`;
		this.domElement.style.height = `${height}px`;

		this.#bufferCanvas.width = width;
		this.#bufferCanvas.height = height;

		this.#currentViewport.set(0, 0, width, height);
		this.#currentScissor.set(0, 0, width, height);

		this.#renderPipeline.renderTarget.setSize(width, height);
	}

	setViewport(viewport: Vector4): this {
		this.#currentViewport.copy(viewport);
		return this;
	}
}
