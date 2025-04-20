import { createCullingContext } from "./CullingContext.js";
import { createPipeline } from "./Pipeline.js";
import { createRenderContext } from "./RenderContext.js";
import { createRenderTarget } from "./RenderTarget.js";

/**
 * @typedef {import("../cameras/Camera.js").Camera} Camera
 * @typedef {import("../scenes/Scene.js").Scene} Scene
 * @typedef {import("../renderers/RenderTarget.js").RenderTarget} RenderTarget
 * @typedef {Object} RenderPipeline
 */

/**
 * @param {Object} options
 * @returns {RenderPipeline}
 */
export function createRenderPipeline(options) {
    const _pipeline = createPipeline();
    const _renderTarget = createRenderTarget(options);

    let _renderContext = null;
    let _cullingContext = null;

    const _renderPipeline = {
        /**
         * @returns {RenderTarget}
         */
        get renderTarget() {
            return _renderTarget;
        },

        /**
         * @param {Scene} scene
         * @param {Camera} camera
         * @param {Function} renderFunction
         * @returns {RenderPipeline}
         */
        render(scene, camera, renderFunction) {
            _renderContext = _renderContext
                ? _renderContext.setScene(scene).setCamera(camera)
                : createRenderContext(scene, camera);

            if (!_cullingContext) {
                _cullingContext = createCullingContext(camera);
            }

            _renderContext.update();

            _pipeline.cull(scene, camera, _cullingContext);
            _pipeline.render(scene, camera, _renderTarget, renderFunction);
            return _renderPipeline;
        },
    };
    return _renderPipeline;
}
