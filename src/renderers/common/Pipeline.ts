import type { Camera } from "../../cameras/Camera.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import type { Mesh } from "../../objects/Mesh.ts";
import type { Object3D } from "../../objects/Object3D.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { fromArray } from "../../utils.ts";
import type { Rasterizer } from "./Rasterizer.ts";
import { RenderList } from "./RenderList.ts";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

export class Pipeline {
	renderList = new RenderList();

	cull(scene: Scene, _camera: Camera): this {
		this.renderList.clear();
		this.#traverseScene(scene);
		return this;
	}

	render(scene: Scene, camera: Camera, rasterizer: Rasterizer): this {
		camera.updateMatrixWorld();

		this.cull(scene, camera);

		for (const object of this.renderList.objects) {
			if (object.isMesh) {
				object.updateWorldMatrix(true, false);
				this.#renderMesh(object, camera, rasterizer);
			}
		}

		return this;
	}

	#renderMesh(mesh: Mesh, camera: Camera, rasterizer: Rasterizer): void {
		const shape = mesh.shape;
		const material = mesh.material;

		if (!shape || !shape.indices || shape.indices.length === 0) return;

		const vertices = shape.vertices;
		const indices = shape.indices;

		for (let i = 0; i < indices.length; i += 3) {
			const idx1 = fromArray(indices, i);
			const idx2 = fromArray(indices, i + 1);
			const idx3 = fromArray(indices, i + 2);
			if (
				(idx1 >= vertices.length) ||
				(idx2 >= vertices.length) ||
				(idx3 >= vertices.length)
			) continue;

			const v1 = vertices[idx1];
			const v2 = vertices[idx2];
			const v3 = vertices[idx3];
			if (!v1 || !v2 || !v3) continue;

			_v1.copy(v1);
			_v2.copy(v2);
			_v3.copy(v3);

			_v1.applyMatrix4(mesh.worldMatrix);
			_v2.applyMatrix4(mesh.worldMatrix);
			_v3.applyMatrix4(mesh.worldMatrix);

			_v1.applyMatrix4(camera.matrixWorldInverse);
			_v2.applyMatrix4(camera.matrixWorldInverse);
			_v3.applyMatrix4(camera.matrixWorldInverse);

			_v1.applyMatrix4(camera.projectionMatrix);
			_v2.applyMatrix4(camera.projectionMatrix);
			_v3.applyMatrix4(camera.projectionMatrix);

			rasterizer.drawTriangle(
				_v1,
				_v2,
				_v3,
				material.color,
				material.wireframe,
			);
		}
	}

	#traverseScene(object: Object3D): void {
		if (object.isMesh) this.renderList.add(object);

		for (const child of object.children) {
			if (child.visible) this.#traverseScene(child);
		}
	}
}
