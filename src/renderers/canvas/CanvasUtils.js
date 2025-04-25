/**
 * @namespace
 */
export const CanvasUtils = {
    /**
     * @returns {HTMLCanvasElement}
     */
    createCanvasElement() {
        const canvas = globalThis.document.createElement("canvas");
        canvas.style.display = "block";
        canvas.style.imageRendering = "pixelated";
        return canvas;
    },

    /**
     * @param {HTMLCanvasElement} canvas
     * @returns {CanvasRenderingContext2D}
     */
    createCanvasRenderingContext2D(canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D context not supported");
        return ctx;
    },
};
