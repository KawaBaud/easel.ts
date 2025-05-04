import type { Camera } from "../../cameras/Camera.ts";
import type { Vector3 } from "../../maths/Vector3.ts";
import type { Mesh } from "../../objects/Mesh.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { RenderList } from "./RenderList.ts";
import type { RenderTarget } from "./RenderTarget.ts";

export class Pipeline {
	readonly isPipeline = true;

	renderList: RenderList = new RenderList();

	cull(scene: Scene, _camera: Camera): this {
		this.renderList.clear();

		scene.traverseVisible((object) => {
			if ("isMesh" in object && "shape" in object && "material" in object) {
				this.renderList.add(object as Mesh);
			}
		});

		return this;
	}

	render(
		_scene: Scene,
		camera: Camera,
		target: RenderTarget,
		_render: (
			v1: Vector3,
			v2: Vector3,
			v3: Vector3,
			color: number,
			wireframe: boolean,
		) => void,
	): this {
		camera.updateMatrixWorld();

		this.renderList.depthSort();
		for (const object of this.renderList.items) {
			if ("isMesh" in object) {
				object.updateWorldMatrix(true, false);
				this.#renderMesh(object, camera, target, _render);
			}
		}

		return this;
	}

	#renderMesh(
		mesh: Mesh,
		_camera: Camera,
		_target: RenderTarget,
		_render: (
			v1: Vector3,
			v2: Vector3,
			v3: Vector3,
			color: number,
			wireframe: boolean,
		) => void,
	): void {
		const shape = mesh.shape;
		const material = mesh.material;

		if (!shape.vertices.length || !shape.indices.length) return;

		const worldVertices: Vector3[] = [];

		for (const vertex of shape.vertices) {
			const worldVertex = vertex.clone();
			worldVertex.applyMatrix4(mesh.worldMatrix);

			worldVertex.project(_camera);

			worldVertex.x = (worldVertex.x + 1) * _target.width / 2;
			worldVertex.y = (-worldVertex.y + 1) * _target.height / 2;

			worldVertices.push(worldVertex);
		}

		for (let i = 0; i < shape.indices.length; i += 3) {
			const idx1 = shape.indices[i];
			const idx2 = shape.indices[i + 1];
			const idx3 = shape.indices[i + 2];

			if (idx1 === undefined || idx2 === undefined || idx3 === undefined) {
				continue;
			}

			const v1 = worldVertices[idx1];
			const v2 = worldVertices[idx2];
			const v3 = worldVertices[idx3];
			if (!v1 || !v2 || !v3) continue;

			if (v1.z === 0 || v2.z === 0 || v3.z === 0) continue;

			_render(v1, v2, v3, material.color, material.wireframe);
		}
	}
}
