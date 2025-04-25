import { MIN_LOGICAL_HEIGHT, MIN_LOGICAL_WIDTH } from "../../constants.js";

/**
 * @typedef {Object} RenderTarget
 * @property {number} width
 * @property {number} height
 * @property {number} aspectRatio
 */

/**
 * @param {Object} [options={}]
 * @returns {RenderTarget}
 */
export function createRenderTarget(options = {}) {
    const _width = options.width ?? MIN_LOGICAL_WIDTH;
    const _height = options.height ?? MIN_LOGICAL_HEIGHT;

    const _target = {
        /**
         * @type {number}
         */
        width: _width,

        /**
         * @type {number}
         */
        height: _height,

        /**
         * @type {number}
         * @default _width / _height
         */
        aspectRatio: _width / _height,

        /**
         * @type {boolean}
         * @readonly
         * @default true
         */
        isRenderTarget: true,
    };

    return _target;
}
