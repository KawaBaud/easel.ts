import { Pipeline } from "./Pipeline.ts";
import type { RenderList } from "./RenderList.ts";
import { RenderTarget } from "./RenderTarget.ts";

export class RenderPipeline {
	readonly isRenderPipeline: boolean = true;

	renderTarget: RenderTarget = new RenderTarget();
	#pipeline = new Pipeline();

	get renderList(): RenderList {
		return this.#pipeline.renderList;
	}
}
