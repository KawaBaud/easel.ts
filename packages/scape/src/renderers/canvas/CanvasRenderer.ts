import { Renderer, type RendererOptions } from "../Renderer.ts";
import { CanvasUtils } from "./CanvasUtils.ts";

export class CanvasRenderer extends Renderer {
	domElement: HTMLCanvasElement;

	constructor(options?: RendererOptions) {
		super(options);

		this.domElement = CanvasUtils.createCanvasElement();
	}
}
