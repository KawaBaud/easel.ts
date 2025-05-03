import type { Camera } from "../../cameras/Camera.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { Renderer } from "../Renderer.ts";
import { RendererUtils } from "../RendererUtils.ts";
import { CanvasUtils } from "./CanvasUtils.ts";

export class CanvasRenderer extends Renderer {
	readonly isCanvasRenderer = true;

	domElement: HTMLCanvasElement;
	context: CanvasRenderingContext2D;

	constructor() {
		super();
		this.domElement = globalThis.document.createElement("canvas");

		const context = this.domElement.getContext("2d");
		if (!context) {
			throw new Error("CanvasRenderer: unable to get 2D context");
		}

		this.context = context;
		this.setSize(this.width, this.height);
	}

	clear(): void {
		const { context, width, height } = this;
		context.clearRect(0, 0, width, height);
	}

	render(scene: Scene, camera: Camera): void {
		if (this.autoClear) this.clear();

		CanvasUtils.setBackgroundColor(
			this.context,
			this.width,
			this.height,
			scene.background,
		);

		camera.updateMatrixWorld();

		const objects = RendererUtils.gatherObjects(
			scene,
			camera,
			this.width,
			this.height,
		);

		for (const { object } of objects) {
			CanvasUtils.renderMesh(
				this.context,
				object,
				camera,
				this.width,
				this.height,
			);
		}
	}

	setPixelRatio(ratio: number): void {
		this.pixelRatio = ratio;
		this.setSize(this.width, this.height);
	}

	setSize(width: number, height: number): void {
		this.width = width;
		this.height = height;

		this.domElement.width = width * this.pixelRatio;
		this.domElement.height = height * this.pixelRatio;

		this.domElement.style.width = `${width}px`;
		this.domElement.style.height = `${height}px`;

		this.context.setTransform(
			this.pixelRatio,
			0,
			0,
			this.pixelRatio,
			0,
			0,
		);
	}
}
