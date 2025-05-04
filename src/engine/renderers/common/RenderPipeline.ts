import type { Camera } from "../../cameras/Camera.ts";
import type { Color } from "../../core/Color.ts";
import type { Vector3 } from "../../maths/Vector3.ts";
import type { Mesh } from "../../objects/Mesh.ts";
import type { Object3D } from "../../objects/Object3D.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { Pipeline } from "./Pipeline.ts";
import type { Rasterizer } from "./Rasterizer.ts";
import { RenderTarget } from "./RenderTarget.ts";

export class RenderPipeline extends Pipeline {
	readonly isRenderPipeline: boolean = true;

	renderTarget: RenderTarget = new RenderTarget();

	collectRenderList(scene: Scene): void {
		this.renderList.clear();

		scene.traverseVisible((object: Object3D) => {
			if ("isMesh" in object) this.renderList.add(object as Mesh);
		});
	}

	renderMesh(
		mesh: Mesh,
		camera: Camera,
		rasterizer: Rasterizer,
		color?: Color,
	): void {
		const { shape } = mesh;
		if (!shape.vertices.length) return;

		const { width, height } = this.renderTarget;
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
				(idx1 === undefined) ||
				(idx2 === undefined) ||
				(idx3 === undefined)
			) continue;

			const v1 = screenVertices[idx1];
			const v2 = screenVertices[idx2];
			const v3 = screenVertices[idx3];
			if (!v1 || !v2 || !v3) continue;

			rasterizer.drawLine(v1.x, v1.y, v2.x, v2.y, color);
			rasterizer.drawLine(v2.x, v2.y, v3.x, v3.y, color);
			rasterizer.drawLine(v3.x, v3.y, v1.x, v1.y, color);
		}
	}
}
