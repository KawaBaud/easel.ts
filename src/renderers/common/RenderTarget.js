import { createVector4 } from "../../maths/Vector4.js";

/**
 * @typedef {Object} RenderTarget
 * @property {number} width
 * @property {number} height
 * @property {number} aspectRatio
 * @property {Vector4} viewport
 * @property {Vector4} scissor
 * @property {boolean} scissorTest
 * @property {boolean} isRenderTarget
 */

/**
 * @param {Object} [options={}]
 * @returns {RenderTarget}
 */
export function createRenderTarget(options = {}) {
    const _width = options.width ?? globalThis.innerWidth;
    const _height = options.height ?? globalThis.innerHeight;

    const _viewport = createVector4(0, 0, _width, _height);
    const _scissor = createVector4(0, 0, _width, _height);

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
         * @type {Vector4}
         */
        viewport: _viewport,

        /**
         * @type {Vector4}
         */
        scissor: _scissor,

        /**
         * @type {boolean}
         * @default false
         */
        scissorTest: false,

        /**
         * @type {boolean}
         * @readonly
         * @default true
         */
        isRenderTarget: true,

        /**
         * @param {number} width
         * @param {number} height
         * @returns {RenderTarget}
         */
        setSize(width, height) {
            _target.width = width;
            _target.height = height;
            _target.aspectRatio = width / height;
            _viewport.set(0, 0, width, height);
            _scissor.set(0, 0, width, height);
            return _target;
        },
    };

    return _target;
}
