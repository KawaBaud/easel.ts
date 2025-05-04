import { RenderList } from "./RenderList.ts";

export class Pipeline {
	readonly isPipeline = true;

	renderList: RenderList = new RenderList();
}
