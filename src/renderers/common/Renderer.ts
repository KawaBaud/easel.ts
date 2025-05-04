import type { Camera } from "../../cameras/Camera.ts";
import { PerspCamera } from "../../cameras/PerspCamera.ts";
import type { Scene } from "../../scenes/Scene.ts";

export interface RendererOptions {
	width?: number;
	height?: number;
	alpha?: boolean;
}

export class Renderer {
	width: number;
	height: number;
	alpha: boolean;

	get aspect(): number {
		return this.width / this.height;
	}

	constructor(options: RendererOptions = {}) {
		this.width = options.width ?? globalThis.innerWidth;
		this.height = options.height ?? globalThis.innerHeight;
		this.alpha = options.alpha ?? false;
	}

	render(_scene: Scene, camera: Camera): this {
		if (camera instanceof PerspCamera) {
			const currentAspect = this.aspect;
			if (camera.aspect !== currentAspect) {
				camera.aspect = currentAspect;
				camera.updateProjectionMatrix();
			}
		}

		camera.updateMatrixWorld();
		return this;
	}

	setSize(width: number, height: number): this {
		this.width = width;
		this.height = height;

		return this;
	}
}
