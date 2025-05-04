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
		const ctx = canvas.getContext("2d", options);
		if (!ctx) throw new Error("2D context not supported");
		return ctx;
	},
};
