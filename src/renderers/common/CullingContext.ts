import type { Material } from "../../materials/Material.ts";
import { Vector3 } from "../../maths/Vector3.ts";

const _normal = new Vector3();
const _v1 = new Vector3();
const _v2 = new Vector3();

export class CullingContext {
	shouldCullTriangle(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		material: Material,
	): boolean {
		if (!material.backfaceCulled || material.wireframe) return false;

		_v1.subVectors(v2, v1);
		_v2.subVectors(v3, v1);
		_normal.crossVectors(_v1, _v2);

		return _normal.z < 0;
	}
}
