import type { Camera } from "../../cameras/Camera.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { Pipeline } from "./Pipeline.ts";
import type { Rasterizer } from "./Rasterizer.ts";
import { RenderTarget } from "./RenderTarget.ts";

export class RenderPipeline extends Pipeline {
	renderTarget: RenderTarget;

	constructor(width?: number, height?: number) {
		super();
		this.renderTarget = new RenderTarget(width, height);
	}

	override render(scene: Scene, camera: Camera, rasterizer: Rasterizer): this {
		super.render(scene, camera, rasterizer);
		return this;
	}

	setSize(width: number, height: number): this {
		this.renderTarget.setSize(width, height);
		return this;
	}
}
