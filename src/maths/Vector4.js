/**
 * @typedef {Object} Vector4
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} w
 * @property {boolean} isVector4
 */

/**
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @param {number} [w=0]
 * @returns {Vector4}
 */
export function createVector4(x = 0, y = 0, z = 0, w = 0) {
    const _v = {
        /**
         * @type {number}
         * @default 0
         */
        x,

        /**
         * @type {number}
         * @default 0
         */
        y,

        /**
         * @type {number}
         * @default 0
         */
        z,

        /**
         * @type {number}
         * @default 0
         */
        w,

        /**
         * @type {boolean}
         * @readonly
         * @default true
         */
        isVector4: true,

        /**
         * @returns {Vector4}
         */
        clone() {
            return createVector4().copy(_v);
        },

        /**
         * @param {Vector4} v
         * @returns {Vector4}
         */
        copy(v) {
            return v === undefined ? _v : _v.set(v.x, v.y, v.z, v.w);
        },

        /**
         * @param {Vector4} v
         * @returns {boolean}
         */
        equals(v) {
            return (
                (_v.x === v.x) &&
                (_v.y === v.y) &&
                (_v.z === v.z) &&
                (_v.w === v.w)
            );
        },

        /**
         * @param {Array<number>} array
         * @param {number} [offset=0]
         * @returns {Vector4}
         */
        fromArray(array, offset = 0) {
            return _v.set(
                array[offset],
                array[offset + 1],
                array[offset + 2],
                array[offset + 3],
            );
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @param {number} w
         * @returns {Vector4}
         */
        set(x, y, z, w) {
            _v.x = x;
            _v.y = y;
            _v.z = z;
            _v.w = w;
            return _v;
        },

        /**
         * @param {number} scalar
         * @returns {Vector4}
         */
        setScalar(scalar) {
            _v.x = scalar;
            _v.y = scalar;
            _v.z = scalar;
            _v.w = scalar;
            return _v;
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
            array[offset + 3] = _v.w;
            return array;
        },

        /**
         * @returns {IterableIterator<number>}
         */
        *[Symbol.iterator]() {
            yield _v.x;
            yield _v.y;
            yield _v.z;
            yield _v.w;
        },
    };

    return _v;
}
