export class RenderTarget {
	width: number;
	height: number;

	constructor(width?: number, height?: number) {
		this.width = width ?? globalThis.innerWidth;
		this.height = height ?? globalThis.innerHeight;
	}

	setSize(width: number, height: number): this {
		this.width = width;
		this.height = height;
		return this;
	}
}
