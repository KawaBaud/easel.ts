import type { Camera } from "../../cameras/Camera.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import type { Mesh } from "../../objects/Mesh.ts";
import type { Object3D } from "../../objects/Object3D.ts";
import type { Scene } from "../../scenes/Scene.ts";

export interface ProjectedVertex {
	x: number;
	y: number;
	z: number;
}

export interface RenderObject {
	object: Mesh;
	z: number;
}

export abstract class Pipeline {
	readonly isPipeline = true;

	width = 640;
	height = 480;

	abstract projectVector(vector: Vector3, camera: Camera): ProjectedVertex;

	gatherObjects(scene: Scene, camera: Camera): RenderObject[] {
		const objects: RenderObject[] = [];

		scene.traverseVisible((object: Object3D) => {
			object.updateWorldMatrix(true, false);

			const hasMeshProps = "shape" in object && "material" in object;
			if (hasMeshProps) {
				const mesh = object as Mesh;
				const position = new Vector3().copy(mesh.position);
				const projected = this.projectVector(position, camera);

				objects.push({
					object: mesh,
					z: projected.z,
				});
			}
		});

		return objects.sort((a, b) => b.z - a.z);
	}
}
