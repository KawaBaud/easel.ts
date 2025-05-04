export const CanvasUtils = {
	createCanvasElement(): HTMLCanvasElement {
		const canvas = globalThis.document.createElement("canvas");
		canvas.style.display = "block";
		canvas.style.imageRendering = "pixelated";
		return canvas;
	},

	createCanvasRenderingContext2D(
		canvas: HTMLCanvasElement,
		options: CanvasRenderingContext2DSettings = {},
	): CanvasRenderingContext2D {
		return canvas.getContext("2d", options) ?? (() => {
			throw new Error("2D context not supported");
		})();
	},
};
