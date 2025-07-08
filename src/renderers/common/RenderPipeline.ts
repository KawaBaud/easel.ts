import type { Camera } from "../../cameras/Camera";
import { Vector3 } from "../../maths/Vector3";
import { Mesh } from "../../objects/Mesh";
import type { Scene } from "../../scenes/Scene";
import { ShapeUtils } from "../../shapes/ShapeUtils";
import "../../types";
import type { CanvasRenderer } from "../CanvasRenderer";
import { FrustumProcessor } from "../common/FrustumProcessor";
import { Pipeline } from "./Pipeline";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _worldV1 = new Vector3();
const _worldV2 = new Vector3();
const _worldV3 = new Vector3();

export class RenderPipeline extends Pipeline {
	#frustumProcessor = new FrustumProcessor();
	width: number;
	height: number;

	constructor(width?: number, height?: number) {
		super();
		this.width = width ?? globalThis.innerWidth;
		this.height = height ?? globalThis.innerHeight;
	}

	render(scene: Scene, camera: Camera, renderer: CanvasRenderer): this {
		camera.updateMatrixWorld();

		this.#frustumProcessor.setFromCamera(camera);

		this.populate(scene, camera);

		for (const object of this.renderList.objects) {
			if (object instanceof Mesh) {
				object.updateWorldMatrix(true, false);
				this.#renderMesh(object, camera, renderer);
			}
		}

		return this;
	}

	setSize(width: number, height: number): this {
		this.width = width;
		this.height = height;
		return this;
	}

	#processTriangle(
		indices: Uint16Array,
		startIndex: number,
		vertices: Vector3[],
		mesh: Mesh,
		camera: Camera,
		renderer: CanvasRenderer,
		material: Mesh["material"],
	): void {
		const idx1 = indices[startIndex] as number;
		const idx2 = indices[startIndex + 1] as number;
		const idx3 = indices[startIndex + 2] as number;
		if (
			idx1 >= vertices.length ||
			idx2 >= vertices.length ||
			idx3 >= vertices.length
		) {
			return;
		}

		const v1 = vertices[idx1];
		const v2 = vertices[idx2];
		const v3 = vertices[idx3];
		if (!(v1 && v2 && v3)) {
			return;
		}

		_v1.copy(v1).applyMatrix4(mesh.worldMatrix);
		_v2.copy(v2).applyMatrix4(mesh.worldMatrix);
		_v3.copy(v3).applyMatrix4(mesh.worldMatrix);

		_worldV1.copy(_v1).applyMatrix4(camera.matrixWorldInverse);
		_worldV2.copy(_v2).applyMatrix4(camera.matrixWorldInverse);
		_worldV3.copy(_v3).applyMatrix4(camera.matrixWorldInverse);

		if (
			this.#frustumProcessor.shouldCull(_worldV1, _worldV2, _worldV3, material)
		) {
			return;
		}

		const clippedTriangles = this.#frustumProcessor.clipTriangle(
			_worldV1,
			_worldV2,
			_worldV3,
		);
		if (clippedTriangles.length === 0) {
			return;
		}
		for (const triangle of clippedTriangles) {
			renderer.rasterize(triangle, camera, material);
		}
	}

	#renderMesh(mesh: Mesh, camera: Camera, renderer: CanvasRenderer): void {
		const shape = mesh.shape;
		const material = mesh.material;

		if (!shape?.vertices || shape.vertices.length === 0) {
			return;
		}

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
				renderer,
				material,
			);
		}
	}
}
