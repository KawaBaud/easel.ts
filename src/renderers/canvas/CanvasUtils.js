import { MIN_LOGICAL_HEIGHT, MIN_LOGICAL_WIDTH } from "../../constants.js";

/**
 * @namespace
 */
export const CanvasUtils = {
    /**
     * @param {number} width
     * @param {number} height
     * @param {boolean} [offscreen=false]
     * @returns {OffscreenCanvas|HTMLCanvasElement}
     */
    createCanvasElement(width, height, offscreen = false) {
        if (offscreen) {
            return new OffscreenCanvas(
                width || MIN_LOGICAL_WIDTH,
                height || MIN_LOGICAL_HEIGHT,
            );
        }

        const canvas = globalThis.document.createElement("canvas");
        canvas.width = width || MIN_LOGICAL_WIDTH;
        canvas.height = height || MIN_LOGICAL_HEIGHT;
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
