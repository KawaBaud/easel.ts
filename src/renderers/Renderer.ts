import type { Camera } from "../cameras/Camera.ts";
import { PerspCamera } from "../cameras/PerspCamera.ts";
import type { Scene } from "../scenes/Scene.ts";
import type { ColorValue } from "../types.ts";

export interface RendererOptions {
	width?: number;
	height?: number;
	alpha?: boolean;
}

export abstract class Renderer {
	width: number;
	height: number;
	alpha: boolean;

	get aspect(): number {
		return this.width / this.height;
	}

	abstract get domElement(): HTMLElement;

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

	abstract setSize(width: number, height: number): this;
	abstract setClearColor(color: ColorValue): this;
}
