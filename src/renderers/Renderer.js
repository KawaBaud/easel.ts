import { createMatrix4 } from "../maths/Matrix4.js";

/**
 * @typedef {import("../cameras/Camera.js").Camera} Camera
 * @typedef {import("../scenes/Scene.js").Scene} Scene
 * @typedef {Object} Renderer
 * @property {HTMLElement} domElement
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

    const _aspectRatio = _width / _height;

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
                camera.matrixWorldInverse = createMatrix4().identity();
            }
            if (!camera.projectionMatrix) {
                camera.projectionMatrix = createMatrix4().identity();
            }
            if (camera.isPerspCamera && camera.aspect !== _aspectRatio) {
                camera.aspect = _aspectRatio;
                camera.updateProjectionMatrix();
            }
            camera.updateMatrixWorld();

            return _renderer;
        },

        /**
         * @param {Function} callback
         */
        setupResizeHandler(callback) {
            globalThis.addEventListener("resize", () => {
                if (callback) callback();
            });
        },
    };

    return _renderer;
}
