import type { Camera } from "../../cameras/Camera.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import { Mesh } from "../../objects/Mesh.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { ShapeUtils } from "../../shapes/ShapeUtils.ts";
import "../../types.ts";
import { Pipeline } from "./Pipeline.ts";
import type { Rasterizer } from "./Rasterizer.ts";
import { RenderTarget } from "./RenderTarget.ts";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

export class RenderPipeline extends Pipeline {
	renderTarget: RenderTarget;

	constructor(width?: number, height?: number) {
		super();
		this.renderTarget = new RenderTarget(width, height);
	}

	render(scene: Scene, camera: Camera, rasterizer: Rasterizer): this {
		camera.updateMatrixWorld();

		this.cull(scene, camera);

		for (const object of this.renderList.objects) {
			if (object instanceof Mesh) {
				object.updateWorldMatrix(true, false);
				this.#renderMesh(object, camera, rasterizer);
			}
		}

		return this;
	}

	setSize(width: number, height: number): this {
		this.renderTarget.setSize(width, height);
		return this;
	}

	#renderMesh(mesh: Mesh, camera: Camera, rasterizer: Rasterizer): void {
		const shape = mesh.shape;
		const material = mesh.material;

		if (!shape || (!shape.vertices || (shape.vertices.length === 0))) return;

		const vertices = shape.vertices;
		let indices = shape.indices;
		if (!indices || indices.length === 0) {
			indices = ShapeUtils.triangulate(vertices);
			shape.indices = indices;
		}

		for (let i = 0; i < indices.length; i += 3) {
			const idx1 = indices.safeAt(i);
			const idx2 = indices.safeAt(i + 1);
			const idx3 = indices.safeAt(i + 2);

			if (
				(idx1 >= vertices.length) ||
				(idx2 >= vertices.length) ||
				(idx3 >= vertices.length)
			) continue;

			const v1 = vertices[idx1];
			const v2 = vertices[idx2];
			const v3 = vertices[idx3];
			if (!v1 || !v2 || !v3) continue;

			_v1.copy(v1).applyMatrix4(mesh.worldMatrix);
			_v2.copy(v2).applyMatrix4(mesh.worldMatrix);
			_v3.copy(v3).applyMatrix4(mesh.worldMatrix);

			_v1.project(camera);
			_v2.project(camera);
			_v3.project(camera);

			rasterizer.drawTriangle(
				_v1,
				_v2,
				_v3,
				material.color,
				material.wireframe,
			);
		}
	}
}
