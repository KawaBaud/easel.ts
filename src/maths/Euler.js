import { Maths } from "./Maths.js";
import { createMatrix4 } from "./Matrix4.js";
import { createQuaternion } from "./Quaternion.js";

/**
 * @typedef {Object} Euler
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {string} order
 */

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {string} order
 * @returns {Euler}
 */
export function createEuler(x = 0, y = 0, z = 0, order = "XYZ") {
    const _e = {
        /**
         * @type {number}
         */
        x,

        /**
         * @type {number}
         */
        y,

        /**
         * @type {number}
         */
        z,

        /**
         * @type {string}
         */
        order,

        /**
         * @returns {boolean}
         */
        get isEuler() {
            return true;
        },

        /**
         * @returns {Euler}
         */
        clone() {
            return createEuler(_e.x, _e.y, _e.z, _e.order);
        },

        /**
         * @param {Euler} euler
         * @returns {Euler}
         */
        copy(euler) {
            _e.x = euler.x, _e.y = euler.y, _e.z = euler.z;
            _e.order = euler.order;
            return _e;
        },

        /**
         * @param {Euler} euler
         * @returns {boolean}
         */
        equals(euler) {
            return (
                (euler.x === _e.x) &&
                (euler.y === _e.y) &&
                (euler.z === _e.z) &&
                (euler.order === _e.order)
            );
        },

        /**
         * @param {Array<number,number,number,string>} array
         * @param {number} offset
         * @returns {Euler}
         */
        fromArray(array, offset = 0) {
            _e.x = array[offset];
            _e.y = array[offset + 1];
            _e.z = array[offset + 2];
            if (array[offset + 3] !== undefined) _e.order = array[offset + 3];
            return _e;
        },

        /**
         * @param {string} newOrder
         * @returns {Euler}
         */
        reorder(newOrder) {
            const q = createQuaternion().setFromEuler(_e);
            return _e.setFromQuaternion(q, newOrder);
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @param {string} order
         * @returns {Euler}
         */
        set(x, y, z, order) {
            _e.x = x, _e.y = y, _e.z = z;
            _e.order = order || _e.order;
            return _e;
        },

        /**
         * @param {Matrix4} m
         * @param {string} order
         * @returns {Euler}
         */
        setFromRotationMatrix(m, order) {
            const te = m.elements;

            const m11 = te[0], m12 = te[4], m13 = te[8];
            const m21 = te[1], m22 = te[5], m23 = te[9];
            const m31 = te[2], m32 = te[6], m33 = te[10];

            order = order || _e.order;
            if (order === "XYZ") {
                _e.y = Math.asin(Math.min(Math.max(m13, -1), 1));
                Math.abs(m13) < 0.9999999
                    ? (_e.x = Maths.fastAtan2(-m23, m33),
                        _e.z = Maths.fastAtan2(-m12, m11))
                    : (_e.x = Maths.fastAtan2(m32, m22), _e.z = 0);
            } else if (order === "YXZ") {
                _e.x = Math.asin(-Math.min(Math.max(m23, -1), 1));
                Math.abs(m23) < 0.9999999
                    ? (_e.y = Maths.fastAtan2(m13, m33),
                        _e.z = Maths.fastAtan2(m21, m22))
                    : (_e.y = Maths.fastAtan2(-m31, m11), _e.z = 0);
            } else if (order === "ZXY") {
                _e.x = Math.asin(Math.min(Math.max(m32, -1), 1));
                Math.abs(m32) < 0.9999999
                    ? (_e.y = Maths.fastAtan2(-m31, m33),
                        _e.z = Maths.fastAtan2(-m12, m22))
                    : (_e.y = 0, _e.z = Maths.fastAtan2(m21, m11));
            } else if (order === "ZYX") {
                _e.y = Math.asin(-Math.min(Math.max(m31, -1), 1));
                Math.abs(m31) < 0.9999999
                    ? (_e.x = Maths.fastAtan2(m32, m33),
                        _e.z = Maths.fastAtan2(m21, m11))
                    : (_e.x = 0, _e.z = Maths.fastAtan2(-m12, m22));
            } else if (order === "YZX") {
                _e.z = Math.asin(Math.min(Math.max(m21, -1), 1));
                Math.abs(m21) < 0.9999999
                    ? (_e.x = Maths.fastAtan2(-m23, m22),
                        _e.y = Maths.fastAtan2(-m31, m11))
                    : (_e.x = 0, _e.y = Maths.fastAtan2(m13, m33));
            } else if (order === "XZY") {
                _e.z = Math.asin(-Math.min(Math.max(m12, -1), 1));
                Math.abs(m12) < 0.9999999
                    ? (_e.x = Maths.fastAtan2(m32, m22),
                        _e.y = Maths.fastAtan2(m13, m11))
                    : (_e.x = Maths.fastAtan2(-m23, m33), _e.y = 0);
            }
            _e.order = order;
            return _e;
        },

        /**
         * @param {Quaternion} q
         * @param {string} order
         * @returns {Euler}
         */
        setFromQuaternion(q, order) {
            const m = createMatrix4().makeRotationFromQuaternion(q);
            return _e.setFromRotationMatrix(m, order);
        },

        /**
         * @param {Vector3} v
         * @param {string} order
         * @returns {Euler}
         */
        setFromVector3(v, order) {
            return _e.set(v.x, v.y, v.z, order);
        },

        /**
         * @param {Array<number,number,number,string>} array
         * @param {number} offset
         * @returns {Array<number,number,number,string>}
         */
        toArray(array = [], offset = 0) {
            array[offset] = _e.x;
            array[offset + 1] = _e.y;
            array[offset + 2] = _e.z;
            array[offset + 3] = _e.order;
            return array;
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        toVector3(v) {
            return v.set(_e.x, _e.y, _e.z);
        },
    };
    return _e;
}

export const Euler = {
    // static methods go here
};
