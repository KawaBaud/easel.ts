export const CanvasUtils = {
	createCanvasElement(): HTMLCanvasElement {
		const canvas = globalThis.document.createElement("canvas");
		canvas.style.display = "block";
		canvas.style.imageRendering = "pixelated";
		return canvas;
	},

	createCanvasRenderingContext2D(
		canvas: HTMLCanvasElement,
	): CanvasRenderingContext2D {
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("2D context not supported");
		return ctx;
	},
};
