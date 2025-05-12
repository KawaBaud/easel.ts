import { CanvasUtils } from "./CanvasUtils.ts";
import { RenderTarget } from "./common/RenderTarget.ts";

export class CanvasRenderTarget extends RenderTarget {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	imageData: ImageData;
	data: Uint8ClampedArray;

	constructor(width?: number, height?: number) {
		super(width, height);

		this.canvas = CanvasUtils.createCanvasElement();
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.ctx = CanvasUtils.createCanvasRenderingContext2D(this.canvas, {
			willReadFrequently: true,
		});
		this.ctx.imageSmoothingEnabled = false;

		this.imageData = this.ctx.createImageData(this.width, this.height);
		this.data = this.imageData.data;
	}

	override setSize(width: number, height: number): this {
		super.setSize(width, height);

		this.canvas.style.width = `${width}px`;
		this.canvas.style.height = `${height}px`;
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx.imageSmoothingEnabled = false;

		this.imageData = this.ctx.createImageData(this.width, this.height);
		this.data = this.imageData.data;

		return this;
	}
}
