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

    const _canvas = CanvasUtils.createCanvasElement();
    _canvas.style.width = "100vw";
    _canvas.style.height = "100vh";
    _canvas.style.objectFit = "contain";

    let _buffer = null;
    let _rasteriser = null;

    if (_useBuffer) {
        _buffer = globalThis.document.createElement("canvas");
        _buffer.width = _canvas.width;
        _buffer.height = _canvas.height;
        _rasteriser = createCanvasRasteriser(_buffer);
    } else {
        _rasteriser = createCanvasRasteriser(_canvas);
    }

    const _renderPipeline = createRenderPipeline(options);

    const _canvasRenderer = {
        /**
         * @type {HTMLCanvasElement}
         */
        domElement: _canvas,

        /**
         * @type {boolean}
         * @readonly
         * @default true
         */
        isCanvasRenderer: true,

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

            if (_useBuffer && _buffer) {
                const ctx = _canvas.getContext("2d");
                ctx.clearRect(0, 0, _canvas.width, _canvas.height);
                ctx.drawImage(_buffer, 0, 0);
            }

            return _canvasRenderer;
        },
    };

    _renderer.setupResizeHandler();
    return _canvasRenderer;
}
