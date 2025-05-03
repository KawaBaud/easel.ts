import type { Camera } from "../cameras/Camera.ts";
import { Vector3 } from "../maths/Vector3.ts";
import type { Mesh } from "../objects/Mesh.ts";
import type { Object3D } from "../objects/Object3D.ts";
import type { Scene } from "../scenes/Scene.ts";
import { get } from "../utils.ts";

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
			throw new Error("CanvasRenderer: unable to get 2D context");
		}

		this.context = context;
		this.setSize(this.width, this.height);
	}

	clear(): void {
		const { context, width, height } = this;
		context.clearRect(0, 0, width, height);
	}

	projectVector(
		vector: Vector3,
		camera: Camera,
	): { x: number; y: number; z: number } {
		const v = new Vector3().copy(vector);
		v.applyMatrix4(camera.matrixWorldInverse);
		v.applyMatrix4(camera.projectionMatrix);

		return {
			x: (v.x + 1) * this.width / 2,
			y: (-v.y + 1) * this.height / 2,
			z: v.z,
		};
	}

	render(scene: Scene, camera: Camera): void {
		if (this.autoClear) this.clear();

		if (scene.background) {
			const { context, width, height } = this;
			const bg = scene.background;
			if (typeof bg === "string") {
				context.fillStyle = bg;
			} else if (typeof bg === "number") {
				context.fillStyle = `#${bg.toString(16).padStart(6, "0")}`;
			}
			context.fillRect(0, 0, width, height);
		}

		camera.updateMatrixWorld();

		const objects: { object: Mesh; z: number }[] = [];

		scene.traverseVisible((object: Object3D) => {
			object.updateWorldMatrix(true, false);

			const hasMeshProps = "shape" in object && "material" in object;
			if (hasMeshProps) {
				const mesh = object as Mesh;
				const position = new Vector3().copy(mesh.position);
				const projected = this.projectVector(position, camera);

				objects.push({
					object: mesh,
					z: projected.z,
				});
			}
		});

		objects.sort((a, b) => b.z - a.z);

		for (const { object } of objects) {
			const mesh = object;
			const shape = mesh.shape;
			const material = mesh.material;

			const projectedVertices = shape.vertices.map((vertex) => {
				const worldVertex = new Vector3().copy(vertex);
				worldVertex.applyMatrix4(mesh.worldMatrix);
				return this.projectVector(worldVertex, camera);
			});

			const ctx = this.context;
			const colorHex = material.color.toString(16).padStart(6, "0");
			ctx.fillStyle = `#${colorHex}`;
			ctx.strokeStyle = `#${colorHex}`;

			for (let i = 0; i < shape.indices.length; i += 3) {
				const idx1 = get(shape.indices, i);
				const idx2 = get(shape.indices, i + 1);
				const idx3 = get(shape.indices, i + 2);

				const a = projectedVertices[idx1];
				const b = projectedVertices[idx2];
				const c = projectedVertices[idx3];

				if (!a || !b || !c) continue;

				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.lineTo(c.x, c.y);
				ctx.closePath();

				ctx.fill();
				if (material.wireframe) {
					ctx.strokeStyle = "#000000";
					ctx.stroke();
				}
			}

			if (object.name) {
				const position = new Vector3().copy(mesh.position);
				const projected = this.projectVector(position, camera);

				ctx.fillStyle = "white";
				ctx.font = "12px Arial";
				ctx.textAlign = "center";
				ctx.fillText(
					object.name,
					projected.x,
					projected.y + 20,
				);
			}
		}
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
