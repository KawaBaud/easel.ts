import type { Camera } from "../../cameras/Camera.ts";
import { Color } from "../../core/Color.ts";
import "../../maths/Vector3.ts";
import type { Vector3 } from "../../maths/Vector3.ts";
import type { Vector4 } from "../../maths/Vector4.ts";
import type { Mesh } from "../../objects/Mesh.ts";
import "../../objects/Object3D.ts";
import type { Object3D } from "../../objects/Object3D.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { Renderer } from "../Renderer.ts";
import { RenderPipeline } from "../common/RenderPipeline.ts";
import type { RenderTargetOptions } from "../common/RenderTarget.ts";
import { CanvasRasterizer } from "./CanvasRasterizer.ts";
import { CanvasUtils } from "./CanvasUtils.ts";

export class CanvasRenderer extends Renderer {
	readonly isCanvasRenderer: boolean = true;

	domElement: HTMLCanvasElement;
	#rasterizer: CanvasRasterizer;
	#pipeline = new RenderPipeline();
	#pixelRatio = 1;

	constructor(options: RenderTargetOptions = {}) {
		super();

		this.domElement = CanvasUtils.createCanvasElement();
		this.#rasterizer = new CanvasRasterizer(this.domElement);

		this.setSize(
			options.width ?? globalThis.innerWidth,
			options.height ?? globalThis.innerHeight,
		);
	}

	clear(color?: Color): void {
		this.#rasterizer.clear(color);
	}

	render(scene: Scene, camera: Camera): void {
		camera.updateMatrixWorld();
		scene.updateWorldMatrix(true, false);

		const bgColor = scene.background
			? new Color().setHex(Number(scene.background))
			: undefined;
		this.clear(bgColor);

		this.#rasterizer.beginFrame();

		this.#pipeline.renderList.clear();
		scene.traverseVisible((object: Object3D) => {
			if ("isMesh" in object) {
				this.#pipeline.renderList.add(object as Mesh);
			}
		});

		for (const mesh of this.#pipeline.renderList.items) {
			this.#renderMesh(mesh, camera);
		}

		this.#rasterizer.endFrame();
	}

	setPixelRatio(ratio: number): void {
		this.#pixelRatio = ratio;

		const width = this.domElement.width / this.#pixelRatio;
		const height = this.domElement.height / this.#pixelRatio;

		this.setSize(width, height);
	}

	setSize(width: number, height: number): void {
		this.domElement.width = Math.floor(width * this.#pixelRatio);
		this.domElement.height = Math.floor(height * this.#pixelRatio);

		this.domElement.style.width = `${width}px`;
		this.domElement.style.height = `${height}px`;

		this.#pipeline.renderTarget.setSize(width, height);
	}

	setViewport(viewport: Vector4): this {
		this.#pipeline.renderTarget.viewport.copy(viewport);
		return this;
	}

	#renderMesh(mesh: Mesh, camera: Camera): void {
		const { shape, material } = mesh;
		if (!shape.vertices.length) return;

		const color = new Color().setHex(material.color);
		const { width, height } = this.#pipeline.renderTarget;

		const indices = shape.indices;
		const vertices = shape.vertices;
		const screenVertices: Vector3[] = [];

		for (let i = 0; i < vertices.length; i++) {
			const vertex = vertices[i];
			if (!vertex) continue;

			const worldVertex = vertex.clone();
			worldVertex.applyMatrix4(mesh.worldMatrix);

			const screenVertex = worldVertex.clone().project(camera);
			screenVertex.x = ((screenVertex.x + 1) / 2) * width;
			screenVertex.y = ((1 - screenVertex.y) / 2) * height;

			screenVertices.push(screenVertex);
		}

		for (let i = 0; i < indices.length; i += 3) {
			const idx1 = indices[i];
			const idx2 = indices[i + 1];
			const idx3 = indices[i + 2];

			if (
				idx1 === undefined ||
				idx2 === undefined ||
				idx3 === undefined
			) continue;

			const v1 = screenVertices[idx1];
			const v2 = screenVertices[idx2];
			const v3 = screenVertices[idx3];
			if (!v1 || !v2 || !v3) continue;

			this.#rasterizer.drawTriangle(v1, v2, v3, color);
		}
	}
}
