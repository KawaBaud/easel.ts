import { createRenderer } from "../Renderer.js";
import { createRenderPipeline } from "../common/RenderPipeline.js";
import { createCanvasRasteriser } from "./CanvasRasteriser.js";
import { CanvasUtils } from "./CanvasUtils.js";

/**
 * @typedef {import("../../cameras/Camera.js").Camera} Camera
 * @typedef {import("../../scenes/Scene.js").Scene} Scene
 * @typedef {Object} CanvasRenderer
 * @property {HTMLCanvasElement} domElement
 * @property {boolean} isCanvasRenderer
 * @property {HTMLCanvasElement} [bufferCanvas]
 */

/**
 * @param {Object} [options={}]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {boolean} [options.useBuffer=false]
 * @returns {CanvasRenderer}
 */
export function createCanvasRenderer(options = {}) {
    const _renderer = createRenderer(options);
    const _useBuffer = options.useBuffer ?? false;

    const _canvas = CanvasUtils.createCanvasElement(
        options.width,
        options.height,
    );
    _canvas.style.width = "100vw";
    _canvas.style.height = "100vh";
    _canvas.style.objectFit = "contain";
    _canvas.style.imageRendering = "pixelated";

    let _bufferCanvas = null;
    let _rasteriser = null;

    if (_useBuffer) {
        _bufferCanvas = globalThis.document.createElement("canvas");
        _bufferCanvas.width = _canvas.width;
        _bufferCanvas.height = _canvas.height;
        _rasteriser = createCanvasRasteriser(_bufferCanvas);
    } else {
        _rasteriser = createCanvasRasteriser(_canvas);
    }

    const _renderPipeline = createRenderPipeline(options);

    const _canvasRenderer = {
        domElement: _canvas,

        /**
         * @readonly
         * @default true
         */
        isCanvasRenderer: true,

        /**
         * @returns {HTMLCanvasElement|null}
         */
        get bufferCanvas() {
            return _bufferCanvas;
        },

        /**
         * @returns {boolean}
         */
        get useBuffer() {
            return _useBuffer;
        },

        /**
         * @param {Scene} scene
         * @param {Camera} camera
         * @returns {CanvasRenderer}
         */
        render(scene, camera) {
            _renderer.render(scene, camera);

            _rasteriser.clear(scene.background);

            _renderPipeline.render(scene, camera, (p1, p2, p3, colour) => {
                _rasteriser.drawTriangle(p1, p2, p3, colour);
            });

            if (_useBuffer && _bufferCanvas) {
                const ctx = _canvas.getContext("2d");
                ctx.clearRect(0, 0, _canvas.width, _canvas.height);
                ctx.drawImage(_bufferCanvas, 0, 0);
            }

            return _canvasRenderer;
        },
    };

    _renderer.setupResizeHandler();
    return _canvasRenderer;
}
