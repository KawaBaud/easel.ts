import type { Camera } from "../../cameras/Camera.ts";
import type { Scene } from "../../scenes/Scene.ts";

export class RenderContext {
	readonly isRenderContext: boolean = true;

	constructor(
		public scene: Scene,
		public camera: Camera,
	) {}

	setCamera(camera: Camera): this {
		this.camera = camera;
		return this;
	}

	setScene(scene: Scene): this {
		this.scene = scene;
		return this;
	}

	update(): this {
		if (this.camera) this.camera.updateMatrixWorld();
		if (this.scene) this.scene.updateWorldMatrix(true, false);
		return this;
	}
}
