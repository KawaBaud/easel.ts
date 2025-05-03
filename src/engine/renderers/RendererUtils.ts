import type { Camera } from "../cameras/Camera.ts";
import { Vector3 } from "../maths/Vector3.ts";
import type { Mesh } from "../objects/Mesh.ts";
import type { Object3D } from "../objects/Object3D.ts";
import type { Scene } from "../scenes/Scene.ts";
import type { RenderObject } from "./common/RenderObject.ts";

export interface ProjectedVertex {
	x: number;
	y: number;
	z: number;
}

export class RendererUtils {
	static projectVector(
		vector: Vector3,
		camera: Camera,
		width: number,
		height: number,
	): ProjectedVertex {
		const v = new Vector3().copy(vector);
		v.applyMatrix4(camera.matrixWorldInverse);
		v.applyMatrix4(camera.projectionMatrix);

		return {
			x: (v.x + 1) * width / 2,
			y: (-v.y + 1) * height / 2,
			z: v.z,
		};
	}

	static gatherObjects(
		scene: Scene,
		camera: Camera,
		width: number,
		height: number,
	): RenderObject[] {
		const objects: RenderObject[] = [];

		scene.traverseVisible((object: Object3D) => {
			object.updateWorldMatrix(true, false);

			const hasMeshProps = "shape" in object && "material" in object;
			if (hasMeshProps) {
				const mesh = object as Mesh;
				const position = new Vector3().copy(mesh.position);
				const projected = RendererUtils.projectVector(
					position,
					camera,
					width,
					height,
				);

				objects.push({
					object: mesh,
					z: projected.z,
				});
			}
		});

		return objects.sort((a, b) => b.z - a.z);
	}
}
