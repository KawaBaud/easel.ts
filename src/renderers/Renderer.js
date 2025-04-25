import { createMatrix4 } from "../maths/Matrix4.js";

/**
 * @typedef {import("../cameras/Camera.js").Camera} Camera
 * @typedef {import("../scenes/Scene.js").Scene} Scene
 * @typedef {Object} Renderer
 * @property {number} width
 * @property {number} height
 * @property {boolean} isRenderer
 */

/**
 * @param {Object} [options={}]
 * @returns {Renderer}
 */
export function createRenderer(options = {}) {
    const _width = options.width ?? globalThis.innerWidth;
    const _height = options.height ?? globalThis.innerHeight;

    const _renderer = {
        /**
         * @type {number}
         */
        width: _width,

        /**
         * @type {number}
         */
        height: _height,

        /**
         * @type {boolean}
         * @readonly
         * @default true
         */
        isRenderer: true,

        /**
         * @param {Scene} _scene
         * @param {Camera} camera
         * @returns {Renderer}
         */
        render(_scene, camera) {
            if (!camera.matrixWorldInverse) {
                camera.matrixWorldInverse = createMatrix4();
            }
            if (!camera.projectionMatrix) {
                camera.projectionMatrix = createMatrix4();
            }
            if (camera.isPerspCamera) camera.updateProjectionMatrix();
            camera.updateMatrixWorld();

            return _renderer;
        },

        /**
         * @param {Function} [callback]
         * @returns {void}
         */
        setupResizeHandler(callback) {
            const resizeHandler = () => {
                const width = globalThis.innerWidth;
                const height = globalThis.innerHeight;

                _renderer.width = width;
                _renderer.height = height;

                if (callback) callback(width, height);
            };

            let resizeTimeout;
            globalThis.addEventListener("resize", () => {
                if (resizeTimeout) globalThis.clearTimeout(resizeTimeout);
                resizeTimeout = globalThis.setTimeout(resizeHandler, 100);
            });
        },
    };

    return _renderer;
}
