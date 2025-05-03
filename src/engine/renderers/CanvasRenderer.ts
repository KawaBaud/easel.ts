import type { IsometricCamera } from "../cameras/IsometricCamera.ts";
import type { Scene } from "../scenes/Scene.ts";

export class CanvasRenderer {
	readonly isCanvasRenderer = true;

	domElement: HTMLCanvasElement;
	context: CanvasRenderingContext2D;

	width = 640;
	height = 480;

	pixelRatio = globalThis.devicePixelRatio;
	autoClear = true;

	constructor() {
		this.domElement = globalThis.document.createElement("canvas");
		const context = this.domElement.getContext("2d");

		if (!context) {
			throw new Error("CanvasRenderer: Unable to get 2D context");
		}

		this.context = context;
		this.setSize(this.width, this.height);
	}

	clear(): void {
		const { context, width, height } = this;
		context.clearRect(0, 0, width, height);
	}

	render(scene: Scene, camera: IsometricCamera): void {
		if (this.autoClear) this.clear();

		if (scene.background) {
			const { context, width, height } = this;
			context.fillStyle = scene.background;
			context.fillRect(0, 0, width, height);
		}

		camera.updateMatrixWorld();

		scene.traverseVisible((object) => {
			// placeholder for proper rendering logic
			// we'd check object type in reality
			// and then render the f*cker

			// for now let's js draw placeholder for Object2D instances
			if (object.isObject2D && object !== scene) {
				const screenPosition = camera.worldToScreen(
					object.position.x,
					object.position.y,
				);

				const size = 20 * camera.zoom;

				this.context.fillStyle = "rgba(0, 255, 0, 0.5)";
				this.context.fillRect(
					screenPosition.x - size / 2,
					screenPosition.y - size / 2,
					size,
					size,
				);

				if (object.name) {
					this.context.fillStyle = "white";
					this.context.font = "12px Arial";
					this.context.textAlign = "center";
					this.context.fillText(
						object.name,
						screenPosition.x,
						screenPosition.y + size / 2 + 15,
					);
				}
			}
		});
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
