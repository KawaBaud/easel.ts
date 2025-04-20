import { MathsUtils } from "./MathsUtils.js";
import { createQuaternion } from "./Quaternion.js";

/**
 * @typedef {import("./Euler.js").Euler} Euler
 * @typedef {import("./Matrix4.js").Matrix4} Matrix4
 * @typedef {import("./Quaternion.js").Quaternion} Quaternion
 * @typedef {Object} Vector3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {boolean} isVector3
 * @property {number} length
 * @property {number} lengthSq
 */

/**
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @returns {Vector3}
 */
export function createVector3(x = 0, y = 0, z = 0) {
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
         * @default 0
         */
        z,

        /**
         * @returns {boolean}
         */
        get isVector3() {
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
            return (_v.x * _v.x) + (_v.y * _v.y) + (_v.z * _v.z);
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        add(v) {
            _v.x += v.x;
            _v.y += v.y;
            _v.z += v.z;
            return _v;
        },

        /**
         * @param {number} scalar
         * @returns {Vector3}
         */
        addScalar(scalar) {
            _v.x += scalar;
            _v.y += scalar;
            _v.z += scalar;
            return _v;
        },

        /**
         * @param {Vector3} a
         * @param {Vector3} b
         * @returns {Vector3}
         */
        addVectors(a, b) {
            return _v.set(a.x + b.x, a.y + b.y, a.z + b.z);
        },

        /**
         * @param {Vector3} a
         * @param {Vector3} b
         * @returns {Vector3}
         */
        angle(a, b) {
            return Math.acos(a.dot(b) / (a.length * b.length));
        },

        /**
         * @param {Vector3} v
         * @returns {number}
         */
        angleTo(v) {
            const denom = Math.sqrt(_v.lengthSq * v.lengthSq);
            if (denom === 0) return MathsUtils.TAU;

            const theta = _v.dot(v) / denom;
            return Math.acos(MathsUtils.clamp(theta, -1, 1));
        },

        /**
         * @param {Euler} euler
         * @returns {Vector3}
         */
        applyEuler(euler) {
            const q = createQuaternion().setFromEuler(euler);
            return _v.applyQuaternion(q);
        },

        /**
         * @param {Matrix4} m
         * @returns {Vector3}
         */
        applyMatrix4(m) {
            const me = m.elements;

            const w = (me[3] * _v.x) + (me[7] * _v.y) + (me[11] * _v.z) +
                me[15];
            const iw = w !== 0 ? 1 / w : 1;

            return _v.set(
                ((me[0] * _v.x) + (me[4] * _v.y) + (me[8] * _v.z) + me[12]) *
                    iw,
                ((me[1] * _v.x) + (me[5] * _v.y) + (me[9] * _v.z) + me[13]) *
                    iw,
                ((me[2] * _v.x) + (me[6] * _v.y) + (me[10] * _v.z) + me[14]) *
                    iw,
            );
        },

        /**
         * @param {Quaternion} q
         * @returns {Vector3}
         */
        applyQuaternion(q) {
            const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
            const ix = (qw * _v.x) + (qy * _v.z) - (qz * _v.y);
            const iy = (qw * _v.y) + (qz * _v.x) - (qx * _v.z);
            const iz = (qw * _v.z) + (qx * _v.y) - (qy * _v.x);
            const iw = (-qx * _v.x) - (qy * _v.y) - (qz * _v.z);

            return _v.set(
                (ix * qw) + (iw * -qx) + (iy * -qz) - (iz * -qy),
                (iy * qw) + (iw * -qy) + (iz * -qx) - (ix * -qz),
                (iz * qw) + (iw * -qz) + (ix * -qy) - (iy * -qx),
            );
        },

        /**
         * @returns {Vector3}
         */
        ceil() {
            return _v.set(
                Math.ceil(_v.x),
                Math.ceil(_v.y),
                Math.ceil(_v.z),
            );
        },

        /**
         * @param {Vector3} min
         * @param {Vector3} max
         * @returns {Vector3}
         */
        clamp(min, max) {
            return _v.max(min).min(max);
        },

        /**
         * @param {number} min
         * @param {number} max
         * @returns {Vector3}
         */
        clampScalar(min, max) {
            return _v.set(
                MathsUtils.clamp(_v.x, min, max),
                MathsUtils.clamp(_v.y, min, max),
                MathsUtils.clamp(_v.z, min, max),
            );
        },

        /**
         * @returns {Vector3}
         */
        clone() {
            return createVector3().copy(_v);
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        copy(v) {
            return v === undefined ? _v : _v.set(v.x, v.y, v.z);
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        cross(v) {
            return _v.crossVectors(_v, v);
        },

        /**
         * @param {Vector3} a
         * @param {Vector3} b
         * @returns {Vector3}
         */
        crossVectors(a, b) {
            const ax = a.x, ay = a.y, az = a.z;
            const bx = b.x, by = b.y, bz = b.z;

            return _v.set(
                (ay * bz) - (az * by),
                (az * bx) - (ax * bz),
                (ax * by) - (ay * bx),
            );
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        distanceTo(v) {
            return Math.sqrt(_v.distanceSqTo(v));
        },

        /**
         * @param {Vector3} v
         * @returns {number}
         */
        distanceSqTo(v) {
            const dx = _v.x - v.x;
            const dy = _v.y - v.y;
            const dz = _v.z - v.z;
            return (dx * dx) + (dy * dy) + (dz * dz);
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        div(v) {
            _v.x /= v.x;
            _v.y /= v.y;
            _v.z /= v.z;
            return _v;
        },

        /**
         * @param {number} scalar
         * @returns {Vector3}
         */
        divScalar(scalar) {
            _v.x /= scalar;
            _v.y /= scalar;
            _v.z /= scalar;
            return _v;
        },

        /**
         * @param {Vector3} a
         * @param {Vector3} b
         * @returns {Vector3}
         */
        divVectors(a, b) {
            return _v.set(a.x / b.x, a.y / b.y, a.z / b.z);
        },

        /**
         * @param {Vector3} v
         * @returns {number}
         */
        dot(v) {
            return (_v.x * v.x) + (_v.y * v.y) + (_v.z * v.z);
        },

        /**
         * @param {Vector3} v
         * @returns {boolean}
         */
        equals(v) {
            return (
                (_v.x === v.x) &&
                (_v.y === v.y) &&
                (_v.z === v.z)
            );
        },

        /**
         * @returns {Vector3}
         */
        floor() {
            return _v.set(
                Math.floor(_v.x),
                Math.floor(_v.y),
                Math.floor(_v.z),
            );
        },

        /**
         * @param {Array<number>} array
         * @param {number} [offset=0]
         * @returns {Vector3}
         */
        fromArray(array, offset = 0) {
            return _v.set(
                array[offset],
                array[offset + 1],
                array[offset + 2],
            );
        },

        /**
         * @param {Vector3} v
         * @param {number} alpha
         * @returns {Vector3}
         */
        lerp(v, alpha) {
            _v.x += (v.x - _v.x) * alpha;
            _v.y += (v.y - _v.y) * alpha;
            _v.z += (v.z - _v.z) * alpha;
            return _v;
        },

        /**
         * @param {Vector3} v1
         * @param {Vector3} v2
         * @param {number} alpha
         * @returns {Vector3}
         */
        lerpVectors(v1, v2, alpha) {
            return _v.set(
                v1.x + (v2.x - v1.x) * alpha,
                v1.y + (v2.y - v1.y) * alpha,
                v1.z + (v2.z - v1.z) * alpha,
            );
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        max(v) {
            return _v.set(
                Math.max(_v.x, v.x),
                Math.max(_v.y, v.y),
                Math.max(_v.z, v.z),
            );
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        min(v) {
            return _v.set(
                Math.min(_v.x, v.x),
                Math.min(_v.y, v.y),
                Math.min(_v.z, v.z),
            );
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        mul(v) {
            _v.x *= v.x;
            _v.y *= v.y;
            _v.z *= v.z;
            return _v;
        },

        /**
         * @param {number} scalar
         * @returns {Vector3}
         */
        mulScalar(scalar) {
            _v.x *= scalar;
            _v.y *= scalar;
            _v.z *= scalar;
            return _v;
        },

        /**
         * @param {Vector3} a
         * @param {Vector3} b
         * @returns {Vector3}
         */
        mulVectors(a, b) {
            return _v.set(a.x * b.x, a.y * b.y, a.z * b.z);
        },

        /**
         * @returns {Vector3}
         */
        negate() {
            return _v.set(-_v.x, -_v.y, -_v.z);
        },

        /**
         * @param {Camera} camera
         * @returns {Vector3}
         */
        project(camera) {
            return _v
                .applyMatrix4(camera.matrixWorldInverse)
                .applyMatrix4(camera.projectionMatrix);
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        projectOnto(v) {
            const denom = v.lengthSq;
            if (denom === 0) return _v.set(0, 0, 0);

            const scalar = v.dot(_v) / denom;
            return _v.copy(v).mulScalar(scalar);
        },

        /**
         * @param {Vector3} normal
         * @returns {Vector3}
         */
        reflect(normal) {
            return _v.sub(normal.mulScalar(2 * _v.dot(normal)));
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} [z]
         * @returns {Vector3}
         */
        set(x, y, z) {
            if (z === undefined) z = _v.z;
            _v.x = x;
            _v.y = y;
            _v.z = z;
            return _v;
        },

        /**
         * @param {Array<number>} array
         * @param {number} [offset=0]
         * @returns {Vector3}
         */
        setFromArray(array, offset = 0) {
            return _v.fromArray(array, offset);
        },

        /**
         * @param {number} scalar
         * @returns {Vector3}
         */
        setScalar(scalar) {
            return _v.set(scalar, scalar, scalar);
        },

        /**
         * @param {number} v
         * @returns {Vector3}
         */
        sub(v) {
            _v.x -= v.x;
            _v.y -= v.y;
            _v.z -= v.z;
            return _v;
        },

        /**
         * @param {number} scalar
         * @returns {Vector3}
         */
        subScalar(scalar) {
            _v.x -= scalar;
            _v.y -= scalar;
            _v.z -= scalar;
            return _v;
        },

        /**
         * @param {Vector3} a
         * @param {Vector3} b
         * @returns {Vector3}
         */
        subVectors(a, b) {
            return _v.set(a.x - b.x, a.y - b.y, a.z - b.z);
        },

        /**
         * @param {Array<number>} [array=[]]
         * @param {number} [offset=0]
         * @returns {Array<number>}
         */
        toArray(array = [], offset = 0) {
            array[offset] = _v.x;
            array[offset + 1] = _v.y;
            array[offset + 2] = _v.z;
            return array;
        },

        /**
         * @returns {Vector3}
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
            yield _v.z;
        },
    };
    return _v;
}
