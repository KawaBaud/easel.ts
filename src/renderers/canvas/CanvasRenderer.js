import { createRenderer } from "../Renderer.js";
import { createRenderPipeline } from "../common/RenderPipeline.js";
import { createCanvasRasteriser } from "./CanvasRasteriser.js";
import { CanvasUtils } from "./CanvasUtils.js";

/**
 * @typedef {import("../../cameras/Camera.js").Camera} Camera
 * @typedef {import("../../scenes/Scene.js").Scene} Scene
 * @typedef {Object} CanvasRenderer
 * @property {HTMLCanvasElement} domElement
 */

/**
 * @param {Object} [options={}]
 * @returns {CanvasRenderer}
 */
export function createCanvasRenderer(options = {}) {
    const _baseRenderer = createRenderer(options);
    const _canvas = CanvasUtils.createCanvasElement(
        options.width,
        options.height,
        false,
    );

    _canvas.style.width = "100vw";
    _canvas.style.height = "100vh";
    _canvas.style.objectFit = "contain";
    _canvas.style.imageRendering = "pixelated";

    const _rasteriser = createCanvasRasteriser(_canvas);
    const _renderPipeline = createRenderPipeline(options);

    const _renderer = {
        domElement: _canvas,

        /**
         * @returns {boolean}
         */
        get isRenderer() {
            return true;
        },

        /**
         * @param {Scene} scene
         * @param {Camera} camera
         * @returns {CanvasRenderer}
         */
        render(scene, camera) {
            _baseRenderer.render(scene, camera);

            _rasteriser.clear(scene.background);
            _renderPipeline.render(scene, camera, (p1, p2, p3, colour) => {
                _rasteriser.drawTriangle(p1, p2, p3, colour);
            });

            return _renderer;
        },
    };

    _baseRenderer.setupResizeHandler();

    return _renderer;
}
