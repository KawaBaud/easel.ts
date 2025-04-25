import { MIN_LOGICAL_HEIGHT, MIN_LOGICAL_WIDTH } from "../../constants.js";
import { createVector4 } from "../../maths/Vector4.js";
import { createRenderer } from "../Renderer.js";
import { createRenderPipeline } from "../common/RenderPipeline.js";
import { createCanvasRasteriser } from "./CanvasRasteriser.js";
import { CanvasUtils } from "./CanvasUtils.js";

/**
 * @typedef {import("../../cameras/Camera.js").Camera} Camera
 * @typedef {import("../../scenes/Scene.js").Scene} Scene
 * @typedef {import("../common/RenderTarget.js").RenderTarget} RenderTarget
 * @typedef {import("../../maths/Vector4.js").Vector4} Vector4
 * @typedef {Object} CanvasRenderer
 * @property {HTMLCanvasElement} domElement
 * @property {boolean} isCanvasRenderer
 */

/**
 * @param {Object} [options={}]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @returns {CanvasRenderer}
 */
export function createCanvasRenderer(options = {}) {
    const _renderer = createRenderer(options);

    const _canvas = CanvasUtils.createCanvasElement();
    const _bufferCanvas = globalThis.document.createElement("canvas");
    _bufferCanvas.width = MIN_LOGICAL_WIDTH;
    _bufferCanvas.height = MIN_LOGICAL_HEIGHT;

    const _rasteriser = createCanvasRasteriser(_bufferCanvas);
    const _renderPipeline = createRenderPipeline(options);

    const _currentViewport = createVector4(
        0,
        0,
        _bufferCanvas.width,
        _bufferCanvas.height,
    );
    const _currentScissor = createVector4(
        0,
        0,
        _bufferCanvas.width,
        _bufferCanvas.height,
    );
    let _currentScissorTest = false;

    let _currentRenderTarget = null;

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
         * @returns {RenderTarget}
         */
        get renderTarget() {
            return _renderPipeline.renderTarget;
        },

        /**
         * @param {string} [colour="#000000"]
         * @returns {CanvasRenderer}
         */
        clear(colour = "#000000") {
            _rasteriser.clear(colour);
            return _canvasRenderer;
        },

        /**
         * @param {RenderTarget} renderTarget
         * @returns {CanvasRenderer}
         */
        setRenderTarget(renderTarget) {
            _currentRenderTarget = renderTarget;

            if (renderTarget) {
                _currentViewport.copy(renderTarget.viewport);
                _currentScissor.copy(renderTarget.scissor);
                _currentScissorTest = renderTarget.scissorTest;
            } else {
                _currentRenderTarget = null;
                _currentViewport.set(
                    0,
                    0,
                    _bufferCanvas.width,
                    _bufferCanvas.height,
                );
                _currentScissor.set(
                    0,
                    0,
                    _bufferCanvas.width,
                    _bufferCanvas.height,
                );
                _currentScissorTest = false;
            }

            return _canvasRenderer;
        },

        /**
         * @param {Vector4} scissor
         * @returns {CanvasRenderer}
         */
        setScissor(scissor) {
            _currentScissor.copy(scissor);
            if (_currentRenderTarget) {
                _currentRenderTarget.scissor.copy(scissor);
            }

            return _canvasRenderer;
        },

        /**
         * @param {boolean} scissorTest
         * @returns {CanvasRenderer}
         */
        setScissorTest(scissorTest) {
            _currentScissorTest = scissorTest;
            if (_currentRenderTarget) {
                _currentRenderTarget.scissorTest = scissorTest;
            }

            return _canvasRenderer;
        },

        /**
         * @param {number} width
         * @param {number} height
         * @param {boolean} [updateStyle=true]
         * @returns {CanvasRenderer}
         */
        setSize(width, height, updateStyle = true) {
            _canvas.width = width;
            _canvas.height = height;

            if (updateStyle) {
                _canvas.style.width = width + "px";
                _canvas.style.height = height + "px";
            }

            _renderer.width = MIN_LOGICAL_WIDTH;
            _renderer.height = MIN_LOGICAL_HEIGHT;

            _renderPipeline.renderTarget.setSize(
                MIN_LOGICAL_WIDTH,
                MIN_LOGICAL_HEIGHT,
            );

            return _canvasRenderer;
        },

        /**
         * @param {Vector4} viewport
         * @returns {CanvasRenderer}
         */
        setViewport(viewport) {
            _currentViewport.copy(viewport);
            if (_currentRenderTarget) {
                _currentRenderTarget.viewport.copy(viewport);
            }

            return _canvasRenderer;
        },

        /**
         * @param {Scene} scene
         * @param {Camera} camera
         * @returns {CanvasRenderer}
         */
        render(scene, camera) {
            _renderer.render(scene, camera);
            _rasteriser.clear(scene.background);

            const ctx = _bufferCanvas.getContext("2d");
            if (ctx) {
                if (_currentScissorTest) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(
                        _currentScissor.x,
                        _currentScissor.y,
                        _currentScissor.z,
                        _currentScissor.w,
                    );
                    ctx.clip();
                }

                _renderPipeline.render(scene, camera, (p1, p2, p3, colour) => {
                    _rasteriser.drawTriangle(p1, p2, p3, colour);
                });

                if (_currentScissorTest) ctx.restore();
            }

            const displayCtx = _canvas.getContext("2d");
            if (!displayCtx) return _canvasRenderer;
            displayCtx.imageSmoothingEnabled = false;

            displayCtx.clearRect(
                0,
                0,
                _canvas.width,
                _canvas.height,
            );
            displayCtx.drawImage(
                _bufferCanvas,
                0,
                0,
                _bufferCanvas.width,
                _bufferCanvas.height,
                0,
                0,
                _canvas.width,
                _canvas.height,
            );

            return _canvasRenderer;
        },
    };

    _renderer.setupResizeHandler((width, height) => {
        _canvasRenderer.setSize(width, height);
    });

    _canvasRenderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
    return _canvasRenderer;
}
