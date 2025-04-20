import { MathsUtils } from "../../maths/MathsUtils.js";
import { CanvasUtils } from "./CanvasUtils.js";

/**
 * @typedef {Object} CanvasRasteriser
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {CanvasRasteriser}
 */
export function createCanvasRasteriser(canvas) {
    const _ctx = CanvasUtils.createCanvasRenderingContext2D(canvas);
    let _imageData = null;

    const _rasteriser = {
        /**
         * @returns {CanvasRenderingContext2D}
         */
        get context() {
            return _ctx;
        },

        /**
         * @returns {void}
         */
        beginFrame() {
            _imageData = _ctx.getImageData(0, 0, canvas.width, canvas.height);
        },

        /**
         * @param {string} [colour="#000000"]
         * @returns {void}
         */
        clear(colour) {
            _ctx.fillStyle = colour || "#000000";
            _ctx.fillRect(0, 0, canvas.width, canvas.height);
        },

        /**
         * Bresenham's Line
         * @param {number} x0
         * @param {number} y0
         * @param {number} x1
         * @param {number} y1
         * @param {string} [colour="#fff"]
         * @returns {void}
         */
        drawLine(x0, y0, x1, y1, colour = "#fff") {
            const dx = Math.abs(x1 - x0);
            const dy = -Math.abs(y1 - y0);
            const stepX = x0 < x1 ? 1 : -1;
            const stepY = y0 < y1 ? 1 : -1;
            let error = dx + dy;

            _rasteriser.drawPixel(x0, y0, colour);

            while (true) {
                if (x0 === x1 && y0 === y1) break;
                const error2 = MathsUtils.shlmul(error);
                if (error2 > dy) {
                    error += dy;
                    x0 += stepX;
                }
                if (error2 < dx) {
                    error += dx;
                    y0 += stepY;
                }
                _rasteriser.drawPixel(x0, y0, colour);
            }
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {string} [colour="#000000"]
         * @returns {void}
         */
        drawPixel(x, y, colour = "#000000") {
            _ctx.fillStyle = colour;
            _ctx.fillRect(x, y, 1, 1);
        },

        /**
         * @param {Vector3} v1
         * @param {Vector3} v2
         * @param {Vector3} v3
         * @param {string} [colour="#fff"]
         * @returns {void}
         */
        drawTriangle(v1, v2, v3, colour = "#fff") {
            if (!v1 || !v2 || !v3) return;

            _rasteriser.drawLine(v1.x, v1.y, v2.x, v2.y, colour);
            _rasteriser.drawLine(v2.x, v2.y, v3.x, v3.y, colour);
            _rasteriser.drawLine(v3.x, v3.y, v1.x, v1.y, colour);
        },

        /**
         * @returns {void}
         */
        endFrame() {
            if (_imageData) {
                _ctx.putImageData(_imageData, 0, 0);
                _imageData = null;
            }
        },

        /**
         * @param {number} x
         * @param {number} y
         * @returns {Uint8ClampedArray}
         */
        getPixel(x, y) {
            if (!_imageData) {
                throw new Error("beginFrame must be called before getPixel");
            }

            const index = (MathsUtils.fastTrunc(y) * _imageData.width +
                MathsUtils.fastTrunc(x)) *
                4;
            return _imageData.data.slice(index, index + 4);
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} r
         * @param {number} g
         * @param {number} b
         * @param {number} [a=255]
         * @returns {void}
         */
        setPixel(x, y, r, g, b, a = 255) {
            if (!_imageData) {
                throw new Error("beginFrame must be called before setPixel");
            }

            const index =
                (Maths.fastTrunc(y) * _imageData.width + Maths.fastTrunc(x)) *
                4;
            _imageData.data[index] = r;
            _imageData.data[index + 1] = g;
            _imageData.data[index + 2] = b;
            _imageData.data[index + 3] = a;
        },
    };
    return _rasteriser;
}
