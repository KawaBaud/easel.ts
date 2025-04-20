import { createRenderer } from "../Renderer.js";
import { createRenderPipeline } from "../common/RenderPipeline.js";
import { createCanvasRasteriser } from "./CanvasRasteriser.js";
import { CanvasUtils } from "./CanvasUtils.js";

/**
 * @typedef {import("../../cameras/Camera.js").Camera} Camera
 * @typedef {import("../../scenes/Scene.js").Scene} Scene
 * @typedef {Object} CanvasBufferRenderer
 * @property {HTMLCanvasElement} domElement
 */

/**
 * @param {Object} [options={}]
 * @returns {CanvasBufferRenderer}
 */
export function createCanvasBufferRenderer(options = {}) {
    const _renderer = createRenderer(options);
    const _canvas = CanvasUtils.createCanvasElement(
        options.width,
        options.height,
        true,
    );

    const _buffer = globalThis.document.createElement("canvas");
    _buffer.width = _canvas.width;
    _buffer.height = _canvas.height;

    const _rasteriser = createCanvasRasteriser(_buffer);
    const _renderPipeline = createRenderPipeline(options);

    const _bufferRenderer = {
        domElement: _canvas,

        /**
         * @returns {HTMLCanvasElement}
         */
        get buffer() {
            return _buffer;
        },

        /**
         * @returns {boolean}
         */
        get isRenderer() {
            return true;
        },

        /**
         * @param {Scene} scene
         * @param {Camera} camera
         * @returns {CanvasBufferRenderer}
         */
        render(scene, camera) {
            _renderer.render(scene, camera);

            _rasteriser.clear(scene.background);
            _renderPipeline.render(scene, camera, (p1, p2, p3, colour) => {
                _rasteriser.drawTriangle(p1, p2, p3, colour);
            });

            const ctx = _canvas.getContext("2d");
            ctx.clearRect(0, 0, _canvas.width, _canvas.height);
            ctx.drawImage(_buffer, 0, 0);

            return _bufferRenderer;
        },
    };
    return _bufferRenderer;
}
