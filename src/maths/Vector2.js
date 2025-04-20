import { MathsUtils } from "./MathsUtils.js";

/**
 * @typedef {Object} Vector2
 * @property {number} x
 * @property {number} y
 * @property {boolean} isVector2
 * @property {number} length
 * @property {number} lengthSq
 */

/**
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @returns {Vector2}
 */
export function createVector2(x = 0, y = 0) {
    const _v = {
        /**
         * @default 0
         */
        x,

        /**
         * @default 0
         */
        y,

        /**
         * @returns {boolean}
         */
        get isVector2() {
            return true;
        },

        /**
         * @returns {number}
         */
        get length() {
            return Math.sqrt(_v.lengthSq);
        },

        /**
         * @returns {number}
         */
        get lengthSq() {
            return (_v.x * _v.x) + (_v.y * _v.y);
        },

        /**
         * @param {Vector2} v
         * @returns {Vector2}
         */
        add(v) {
            _v.x += v.x;
            _v.y += v.y;
            return _v;
        },

        /**
         * @param {number} scalar
         * @returns {Vector2}
         */
        addScalar(scalar) {
            _v.x += scalar;
            _v.y += scalar;
            return _v;
        },

        /**
         * @param {Vector2} a
         * @param {Vector2} b
         * @returns {Vector2}
         */
        addVectors(a, b) {
            return _v.set(a.x + b.x, a.y + b.y);
        },

        /**
         * @returns {number}
         */
        angle() {
            return MathsUtils.fastAtan2(-_v.y, -_v.x) + Math.PI;
        },

        /**
         * @param {Vector2} v
         * @returns {number}
         */
        angleTo(v) {
            const denom = Math.sqrt(_v.lengthSq * v.lengthSq);
            if (denom === 0) return MathsUtils.TAU;

            const theta = _v.dot(v) / denom;
            return Math.acos(MathsUtils.clamp(theta, -1, 1));
        },

        /**
         * @returns {Vector2}
         */
        ceil() {
            return _v.set(
                Math.ceil(_v.x),
                Math.ceil(_v.y),
            );
        },

        /**
         * @param {Vector2} min
         * @param {Vector2} max
         * @returns {Vector2}
         */
        clamp(min, max) {
            return _v.max(min).min(max);
        },

        /**
         * @param {number} min
         * @param {number} max
         * @returns {Vector2}
         */
        clampScalar(min, max) {
            return _v.set(
                MathsUtils.clamp(_v.x, min, max),
                MathsUtils.clamp(_v.y, min, max),
            );
        },

        /**
         * @returns {Vector2}
         */
        clone() {
            return createVector2().copy(_v);
        },

        /**
         * @param {Vector2} v
         * @returns {Vector2}
         */
        copy(v) {
            return v === undefined ? _v : _v.set(v.x, v.y);
        },

        /**
         * @param {Vector2} v
         * @returns {number}
         */
        cross(v) {
            return (_v.x * v.y) - (_v.y * v.x);
        },

        /**
         * @param {Vector2} v
         * @returns {number}
         */
        distanceTo(v) {
            return Math.sqrt(_v.distanceSqTo(v));
        },

        /**
         * @param {Vector2} v
         * @returns {number}
         */
        distanceSqTo(v) {
            const dx = _v.x - v.x;
            const dy = _v.y - v.y;
            return (dx * dx) + (dy * dy);
        },

        /**
         * @param {Vector2} v
         * @returns {Vector2}
         */
        div(v) {
            _v.x /= v.x;
            _v.y /= v.y;
            return _v;
        },

        /**
         * @param {number} scalar
         * @returns {Vector2}
         */
        divScalar(scalar) {
            _v.x /= scalar;
            _v.y /= scalar;
            return _v;
        },

        /**
         * @param {Vector2} a
         * @param {Vector2} b
         * @returns {Vector2}
         */
        divVectors(a, b) {
            return _v.set(a.x / b.x, a.y / b.y);
        },

        /**
         * @param {Vector2} v
         * @returns {number}
         */
        dot(v) {
            return (_v.x * v.x) + (_v.y * v.y);
        },

        /**
         * @param {Vector2} v
         * @returns {boolean}
         */
        equals(v) {
            return (
                (_v.x === v.x) &&
                (_v.y === v.y)
            );
        },

        /**
         * @returns {Vector2}
         */
        floor() {
            return _v.set(
                Math.floor(_v.x),
                Math.floor(_v.y),
            );
        },

        /**
         * @param {Array<number>} array
         * @param {number} [offset=0]
         * @returns {Vector2}
         */
        fromArray(array, offset = 0) {
            return _v.set(
                array[offset],
                array[offset + 1],
            );
        },

        /**
         * @param {Vector2} v
         * @param {number} alpha
         * @returns {Vector2}
         */
        lerp(v, alpha) {
            _v.x += (v.x - _v.x) * alpha;
            _v.y += (v.y - _v.y) * alpha;
            return _v;
        },

        /**
         * @param {Vector2} v1
         * @param {Vector2} v2
         * @param {number} alpha
         * @returns {Vector2}
         */
        lerpVectors(v1, v2, alpha) {
            return _v.set(
                v1.x + (v2.x - v1.x) * alpha,
                v1.y + (v2.y - v1.y) * alpha,
            );
        },

        /**
         * @param {Vector2} v
         * @returns {Vector2}
         */
        max(v) {
            return _v.set(
                Math.max(_v.x, v.x),
                Math.max(_v.y, v.y),
            );
        },

        /**
         * @param {Vector2} v
         * @returns {Vector2}
         */
        min(v) {
            return _v.set(
                Math.min(_v.x, v.x),
                Math.min(_v.y, v.y),
            );
        },

        /**
         * @param {Vector2} v
         * @returns {Vector2}
         */
        mul(v) {
            _v.x *= v.x;
            _v.y *= v.y;
            return _v;
        },

        /**
         * @param {number} scalar
         * @returns {Vector2}
         */
        mulScalar(scalar) {
            _v.x *= scalar;
            _v.y *= scalar;
            return _v;
        },

        /**
         * @param {Vector2} a
         * @param {Vector2} b
         * @returns {Vector2}
         */
        mulVectors(a, b) {
            return _v.set(a.x * b.x, a.y * b.y);
        },

        /**
         * @returns {Vector2}
         */
        negate() {
            return _v.set(-_v.x, -_v.y);
        },

        /**
         * @param {number} angle - in radians
         * @returns {Vector2}
         */
        rotate(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);

            const x = _v.x, y = _v.y;
            _v.x = (x * c) - (y * s);
            _v.y = (x * s) + (y * c);
            return _v;
        },

        /**
         * @param {Vector2} centre
         * @param {number} angle - in radians
         * @returns {Vector2}
         */
        rotateAround(centre, angle) {
            return _v.sub(centre).rotate(angle).add(centre);
        },

        /**
         * @param {number} x
         * @param {number} y
         * @returns {Vector2}
         */
        set(x, y) {
            _v.x = x;
            _v.y = y;
            return _v;
        },

        /**
         * @param {Array<number>} array
         * @param {number} [offset=0]
         * @returns {Vector2}
         */
        setFromArray(array, offset = 0) {
            return _v.fromArray(array, offset);
        },

        /**
         * @param {number} scalar
         * @returns {Vector2}
         */
        setScalar(scalar) {
            return _v.set(scalar, scalar);
        },

        /**
         * @param {Vector2} v
         * @returns {Vector2}
         */
        sub(v) {
            _v.x -= v.x;
            _v.y -= v.y;
            return _v;
        },

        /**
         * @param {number} scalar
         * @returns {Vector2}
         */
        subScalar(scalar) {
            _v.x -= scalar;
            _v.y -= scalar;
            return _v;
        },

        /**
         * @param {Vector2} a
         * @param {Vector2} b
         * @returns {Vector2}
         */
        subVectors(a, b) {
            return _v.set(a.x - b.x, a.y - b.y);
        },

        /**
         * @param {Array<number>} [array=[]]
         * @param {number} [offset=0]
         * @returns {Array<number>}
         */
        toArray(array = [], offset = 0) {
            array[offset] = _v.x;
            array[offset + 1] = _v.y;
            return array;
        },

        /**
         * @returns {Vector2}
         */
        unit() {
            const length = _v.length;
            if (length === 0) return _v;
            return _v.divScalar(length);
        },

        /**
         * @returns {IterableIterator<number>}
         */
        *[Symbol.iterator]() {
            yield _v.x;
            yield _v.y;
        },
    };
    return _v;
}
