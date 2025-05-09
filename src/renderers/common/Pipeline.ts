import type { Camera } from "../../cameras/Camera.ts";
import type { Object3D } from "../../objects/Object3D.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { RenderList } from "../common/RenderList.ts";

export abstract class Pipeline {
	renderList = new RenderList();

	cull(scene: Scene, _camera: Camera): this {
		this.renderList.clear();
		this.#traverseScene(scene);
		return this;
	}

	#traverseScene(object: Object3D): void {
		this.renderList.add(object);

		for (const child of object.children) {
			if (child.visible) this.#traverseScene(child);
		}
	}
}
