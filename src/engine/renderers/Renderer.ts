import type { Camera } from "../cameras/Camera.ts";
import type { Color } from "../core/Color.ts";
import type { Scene } from "../scenes/Scene.ts";

export abstract class Renderer {
	readonly isRenderer: boolean = true;

	abstract clear(color?: Color): void;
	abstract render(scene: Scene, camera: Camera): void;
	abstract setPixelRatio(pixelRatio: number): void;
	abstract setSize(width: number, height: number): void;
}
