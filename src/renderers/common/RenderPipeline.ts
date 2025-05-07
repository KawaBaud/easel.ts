import type { Camera } from "../../cameras/Camera.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import { Mesh } from "../../objects/Mesh.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { ShapeUtils } from "../../shapes/ShapeUtils.ts";
import "../../types.ts";
import { ClippingContext } from "./ClippingContext.ts";
import { Pipeline } from "./Pipeline.ts";
import type { Rasterizer } from "./Rasterizer.ts";
import { RenderTarget } from "./RenderTarget.ts";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

export class RenderPipeline extends Pipeline {
	renderTarget: RenderTarget;

	#clippingContext = new ClippingContext();

	constructor(width?: number, height?: number) {
		super();
		this.renderTarget = new RenderTarget(width, height);
	}

	render(scene: Scene, camera: Camera, rasterizer: Rasterizer): this {
		camera.updateMatrixWorld();

		this.#clippingContext.setFromCamera(camera);

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

	#processTriangle(
		indices: number[],
		startIndex: number,
		vertices: Vector3[],
		mesh: Mesh,
		camera: Camera,
		rasterizer: Rasterizer,
		material: Mesh["material"],
	): void {
		const idx1 = indices.safeAt(startIndex);
		const idx2 = indices.safeAt(startIndex + 1);
		const idx3 = indices.safeAt(startIndex + 2);

		if (
			(idx1 >= vertices.length) ||
			(idx2 >= vertices.length) ||
			(idx3 >= vertices.length)
		) return;

		const v1 = vertices[idx1];
		const v2 = vertices[idx2];
		const v3 = vertices[idx3];
		if (!v1 || !v2 || !v3) return;

		_v1.copy(v1).applyMatrix4(mesh.worldMatrix);
		_v2.copy(v2).applyMatrix4(mesh.worldMatrix);
		_v3.copy(v3).applyMatrix4(mesh.worldMatrix);

		const worldV1 = _v1.clone().applyMatrix4(camera.matrixWorldInverse);
		const worldV2 = _v2.clone().applyMatrix4(camera.matrixWorldInverse);
		const worldV3 = _v3.clone().applyMatrix4(camera.matrixWorldInverse);

		const clippedTriangles = this.#clippingContext
			.clipTriangle(worldV1, worldV2, worldV3);
		if (clippedTriangles.length === 0) return;

		for (const triangle of clippedTriangles) {
			rasterizer.rasterizeTriangle(triangle, camera, material);
		}
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
			this.#processTriangle(
				indices,
				i,
				vertices,
				mesh,
				camera,
				rasterizer,
				material,
			);
		}
	}
}
