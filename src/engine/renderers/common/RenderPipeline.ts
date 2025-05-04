import type { Camera } from "../../cameras/Camera.ts";
import type { Vector3 } from "../../maths/Vector3.ts";
import type { Scene } from "../../scenes/Scene.ts";
import { Pipeline } from "./Pipeline.ts";
import { RenderContext } from "./RenderContext.ts";
import type { RenderList } from "./RenderList.ts";
import { RenderTarget } from "./RenderTarget.ts";

export class RenderPipeline {
	readonly isRenderPipeline = true;

	renderTarget: RenderTarget = new RenderTarget();

	#pipeline = new Pipeline();
	#renderContext: RenderContext | null = null;

	get renderList(): RenderList {
		return this.#pipeline.renderList;
	}

	render(
		scene: Scene,
		camera: Camera,
		_render: (
			v1: Vector3,
			v2: Vector3,
			v3: Vector3,
			color: number,
			wireframe: boolean,
		) => void,
	): this {
		this.#renderContext = this.#renderContext
			? this.#renderContext.setScene(scene).setCamera(camera)
			: new RenderContext(scene, camera);

		this.#renderContext.update();

		this.#pipeline.cull(scene, camera);
		this.#pipeline.render(scene, camera, this.renderTarget, _render);

		return this;
	}
}
