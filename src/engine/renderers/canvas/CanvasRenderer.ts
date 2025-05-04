import type { Camera } from "../../cameras/Camera.ts";
import { Color } from "../../core/Color.ts";
import "../../maths/Vector3.ts";
import type { Vector4 } from "../../maths/Vector4.ts";
import "../../objects/Object3D.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { Renderer } from "../Renderer.ts";
import { Rasterizer } from "../common/Rasterizer.ts";
import { RenderPipeline } from "../common/RenderPipeline.ts";
import type { RenderTargetOptions } from "../common/RenderTarget.ts";
import { CanvasUtils } from "./CanvasUtils.ts";

export class CanvasRenderer extends Renderer {
	readonly isCanvasRenderer: boolean = true;

	domElement: HTMLCanvasElement;
	#rasterizer: Rasterizer;
	#pipeline = new RenderPipeline();
	#pixelRatio = 1;

	constructor(options: RenderTargetOptions = {}) {
		super();

		this.domElement = CanvasUtils.createCanvasElement();
		this.#rasterizer = new Rasterizer(this.domElement);

		this.setSize(
			options.width ?? globalThis.innerWidth,
			options.height ?? globalThis.innerHeight,
		);
	}

	clear(color?: Color): void {
		this.#rasterizer.clear(color);
	}

	render(scene: Scene, camera: Camera): void {
		camera.updateMatrixWorld();
		scene.updateWorldMatrix(true, false);

		const bgColor = scene.background
			? new Color().setHex(Number(scene.background))
			: undefined;
		this.clear(bgColor);

		this.#rasterizer.beginFrame();

		this.#pipeline.collectRenderList(scene);

		for (const mesh of this.#pipeline.renderList.items) {
			const color = new Color().setHex(mesh.material.color);
			this.#pipeline.renderMesh(mesh, camera, this.#rasterizer, color);
		}

		this.#rasterizer.endFrame();
	}

	setPixelRatio(ratio: number): void {
		this.#pixelRatio = ratio;

		const width = this.domElement.width / this.#pixelRatio;
		const height = this.domElement.height / this.#pixelRatio;

		this.setSize(width, height);
	}

	setSize(width: number, height: number): void {
		this.domElement.width = Math.floor(width * this.#pixelRatio);
		this.domElement.height = Math.floor(height * this.#pixelRatio);

		this.domElement.style.width = `${width}px`;
		this.domElement.style.height = `${height}px`;

		this.#pipeline.renderTarget.setSize(width, height);
	}

	setViewport(viewport: Vector4): this {
		this.#pipeline.renderTarget.viewport.copy(viewport);
		return this;
	}
}
