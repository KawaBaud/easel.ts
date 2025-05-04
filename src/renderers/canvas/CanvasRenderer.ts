import type { Camera } from "../../cameras/Camera.ts";
import { Color, type ColorValue } from "../../common/Color.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { Rasterizer } from "../common/Rasterizer.ts";
import { RenderPipeline } from "../common/RenderPipeline.ts";
import { Renderer, type RendererOptions } from "../Renderer.ts";
import { CanvasUtils } from "./CanvasUtils.ts";

export class CanvasRenderer extends Renderer {
	domElement: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	rasterizer: Rasterizer;
	pipeline: RenderPipeline;
	#clearColor = new Color(0, 0, 0);

	constructor(options?: RendererOptions) {
		super(options);

		this.domElement = CanvasUtils.createCanvasElement();
		this.domElement.width = this.width;
		this.domElement.height = this.height;

		this.context = CanvasUtils.createCanvasRenderingContext2D(this.domElement);

		this.rasterizer = new Rasterizer({
			width: this.width,
			height: this.height,
			canvas: this.domElement,
		});

		this.pipeline = new RenderPipeline(this.width, this.height);
	}

	override render(scene: Scene, camera: Camera): this {
		super.render(scene, camera);

		this.rasterizer.beginFrame();
		this.rasterizer.clear(this.#clearColor);

		this.pipeline.render(scene, camera, this.rasterizer);

		this.rasterizer.endFrame();
		return this;
	}

	override setSize(width: number, height: number): this {
		super.setSize(width, height);

		this.domElement.width = width;
		this.domElement.height = height;
		this.rasterizer.setSize(width, height);
		this.pipeline.setSize(width, height);

		return this;
	}

	setClearColor(color: ColorValue): this {
		color instanceof Color
			? this.#clearColor.copy(color)
			: this.#clearColor.parse(color);
		return this;
	}
}
