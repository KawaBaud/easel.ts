import { MIN_LOGICAL_HEIGHT, MIN_LOGICAL_WIDTH } from "../constants.js";

/**
 * @typedef {Object} RenderTarget
 * @property {number} width
 * @property {number} height
 */

/**
 * @param {Object} [options={}]
 * @returns {RenderTarget}
 */
export function createRenderTarget(options = {}) {
    const _width = Math.max(
        MIN_LOGICAL_WIDTH,
        options.width ?? MIN_LOGICAL_WIDTH,
    );
    const _height = Math.max(
        MIN_LOGICAL_HEIGHT,
        options.height ?? MIN_LOGICAL_HEIGHT,
    );

    const _target = {
        /**
         * @returns {number}
         */
        get width() {
            return _width;
        },

        /**
         * @returns {number}
         */
        get height() {
            return _height;
        },

        /**
         * @returns {number}
         */
        get aspectRatio() {
            return _width / _height;
        },

        /**
         * @returns {boolean}
         */
        get isRenderTarget() {
            return true;
        },
    };
    return _target;
}
