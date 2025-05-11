import type { Camera } from "../../cameras/Camera.ts";
import type { Material } from "../../materials/Material.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import "../../types.ts";

const _normal = new Vector3();
const _edge1 = new Vector3();
const _edge2 = new Vector3();

export class CullingContext {
	#camera: Camera | null = null;

	get camera(): Camera | null {
		return this.#camera;
	}

	calculateNormal(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		target = _normal,
	): Vector3 {
		_edge1.subVectors(v2, v1);
		_edge2.subVectors(v3, v1);
		target.crossVectors(_edge1, _edge2);
		return target.lengthSq ? target.unitize() : target.set(0, 0, 1);
	}

	isBackFace(v1: Vector3, v2: Vector3, v3: Vector3): boolean {
		if (!this.#camera) return false;

		this.calculateNormal(v1, v2, v3);

		const centreX = (v1.x + v2.x + v3.x) / 3;
		const centreY = (v1.y + v2.y + v3.y) / 3;
		const centreZ = (v1.z + v2.z + v3.z) / 3;

		const dotProduct = (_normal.x * -centreX) + (_normal.y * -centreY) +
			(_normal.z * -centreZ);
		return dotProduct < 0;
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
		return (!material.backfaceCulled || material.wireframe)
			? false
			: this.isBackFace(v1, v2, v3);
	}
}
