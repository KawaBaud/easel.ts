import { RenderList } from "./RenderList.ts";

export class Pipeline {
	readonly isPipeline: boolean = true;

	renderList = new RenderList();
}
