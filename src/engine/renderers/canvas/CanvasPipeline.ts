import type { Camera } from "../../cameras/Camera.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import type { ProjectedVertex } from "../Pipeline.ts";
import { Pipeline } from "../Pipeline.ts";

export class CanvasPipeline extends Pipeline {
	readonly isCanvasPipeline = true;

	projectVector(
		vector: Vector3,
		camera: Camera,
	): ProjectedVertex {
		const v = new Vector3().copy(vector);
		v.applyMatrix4(camera.matrixWorldInverse);
		v.applyMatrix4(camera.projectionMatrix);

		return {
			x: (v.x + 1) * this.width / 2,
			y: (-v.y + 1) * this.height / 2,
			z: v.z,
		};
	}
}
