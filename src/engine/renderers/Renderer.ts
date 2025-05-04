import type { Camera } from "../cameras/Camera.ts";
import type { Scene } from "../scenes/Scene.ts";

export abstract class Renderer {
	readonly isRenderer = true;

	abstract clear(color?: string | number): void;
	abstract render(scene: Scene, camera: Camera): void;
	abstract setSize(width: number, height: number): void;
}
