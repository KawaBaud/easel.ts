import type { Camera } from "../../cameras/Camera";
import type { Object3D } from "../../objects/Object3D";
import type { Scene } from "../../scenes/Scene";
import { RenderList } from "../common/RenderList";

export abstract class Pipeline {
	renderList = new RenderList();

	populate(scene: Scene, _camera: Camera): this {
		this.renderList.clear();
		this.#traverseScene(scene);
		return this;
	}

	#traverseScene(object: Object3D): void {
		this.renderList.add(object);

		for (const child of object.children) {
			if (child.visible) {
				this.#traverseScene(child);
			}
		}
	}
}
