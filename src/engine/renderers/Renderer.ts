import type { Camera } from "../cameras/Camera.ts";
import type { Scene } from "../scenes/Scene.ts";

export abstract class Renderer {
	readonly isRenderer = true;

	width = 640;
	height = 480;
	pixelRatio = globalThis.devicePixelRatio;
	autoClear = true;

	abstract clear(): void;
	abstract render(scene: Scene, camera: Camera): void;
	abstract setSize(width: number, height: number): void;
	abstract setPixelRatio(ratio: number): void;
}
