import {
    MAX_LOGICAL_HEIGHT,
    MAX_LOGICAL_WIDTH,
    MIN_LOGICAL_HEIGHT,
    MIN_LOGICAL_WIDTH,
} from "../constants.js";
import { MathsUtils } from "../maths/MathsUtils.js";
import { createMatrix4 } from "../maths/Matrix4.js";

/**
 * @typedef {import("../cameras/Camera.js").Camera} Camera
 * @typedef {import("../scenes/Scene.js").Scene} Scene
 * @typedef {Object} Renderer
 * @property {HTMLElement} domElement
 */

/**
 * @param {Object} [options={}]
 * @returns {Renderer}
 */
export function createRenderer(options = {}) {
    const width = MathsUtils.clamp(
        options.width ?? MIN_LOGICAL_WIDTH,
        MIN_LOGICAL_WIDTH,
        MAX_LOGICAL_WIDTH,
    );
    const height = MathsUtils.clamp(
        options.height ?? MIN_LOGICAL_HEIGHT,
        MIN_LOGICAL_HEIGHT,
        MAX_LOGICAL_HEIGHT,
    );

    const _aspectRatio = width / height;

    const _renderer = {
        /**
         * @type {number}
         */
        width: width,

        /**
         * @type {number}
         */
        height: height,

        /**
         * @returns {boolean}
         */
        get isRenderer() {
            return true;
        },

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
