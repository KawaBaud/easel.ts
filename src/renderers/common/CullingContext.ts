import type { Camera } from "../../cameras/Camera.ts";
import type { Material } from "../../materials/Material.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import { ShapeUtils } from "../../shapes/ShapeUtils.ts";
import "../../types.ts";

const _normal = new Vector3();

export class CullingContext {
	#camera: Camera | null = null;

	get camera(): Camera | null {
		return this.#camera;
	}

	isBackFace(v1: Vector3, v2: Vector3, v3: Vector3): boolean {
		if (!this.#camera) return false;

		ShapeUtils.calculateNormal(v1, v2, v3, _normal);
		return Vector3.dot(-_normal.x, -_normal.y, -_normal.z, v1) < 0;
	}

	isFrontFace(v1: Vector3, v2: Vector3, v3: Vector3): boolean {
		return !this.isBackFace(v1, v2, v3);
	}

	setFromCamera(camera: Camera): this {
		this.#camera = camera;
		return this;
	}

	shouldCull(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		material: Material,
	): boolean {
		return (!material.wireframe) ? this.isBackFace(v1, v2, v3) : false;
	}
}
