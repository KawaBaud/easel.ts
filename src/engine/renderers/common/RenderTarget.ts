import { Vector4 } from "../../maths/Vector4.ts";

export type RenderTargetOptions = {
	width?: number;
	height?: number;
};

export class RenderTarget {
	readonly isRenderTarget: boolean = true;

	width: number;
	height: number;
	aspectRatio: number;
	viewport: Vector4;
	scissor: Vector4;
	scissorTest = false;

	constructor(options: RenderTargetOptions = {}) {
		this.width = options.width ?? globalThis.innerWidth;
		this.height = options.height ?? globalThis.innerHeight;
		this.aspectRatio = this.width / this.height;
		this.viewport = new Vector4(0, 0, this.width, this.height);
		this.scissor = new Vector4(0, 0, this.width, this.height);
	}

	setSize(width: number, height: number): this {
		this.width = width;
		this.height = height;
		this.aspectRatio = width / height;
		this.viewport.set(0, 0, width, height);
		this.scissor.set(0, 0, width, height);
		return this;
	}
}
