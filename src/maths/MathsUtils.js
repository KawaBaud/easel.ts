/**
 * @type {number}
 * @constant
 */
export const Q_ONE = 1 << 12;

const _TAU = 6.283185307179586;

const _TABLE_SIZE = 1024;
const _QUARTER_TABLE_SIZE = _TABLE_SIZE >> 2; // _TABLE_SIZE / 4
const _TABLE_MASK = _TABLE_SIZE - 1;
const _TABLE_SCALE = 162.97466172610083; // 1024 / (PI * 2)

const _Q_SIN_TABLE = new Int32Array(_TABLE_SIZE);

for (let i = 0; i < _TABLE_SIZE; i++) {
    const angle = i * _TAU / _TABLE_SIZE;
    _Q_SIN_TABLE[i] = (Math.sin(angle) * Q_ONE) | 0;
}

/**
 * @namespace
 */
export const MathsUtils = {
    /**
     * 0.0001
     * @type {number}
     * @readonly
     * @constant
     */
    EPSILON: 1e-4,

    /**
     * 2 * PI
     * @type {number}
     * @readonly
     * @constant
     */
    TAU: _TAU,

    /**
     * PI * PI
     * @type {number}
     * @readonly
     * @constant
     */
    PISQ: 9.869604401089358,

    /**
     * PI / 2
     * @type {number}
     * @readonly
     * @constant
     */
    HALF_PI: 1.5707963267948966,

    /**
     * PI / 3
     * @type {number}
     * @readonly
     * @constant
     */
    THIRD_PI: 1.0471975511965976,

    /**
     * PI / 4
     * @type {number}
     * @readonly
     * @constant
     */
    QUARTER_PI: 0.7853981633974483,

    /**
     * PI / 6
     * @type {number}
     * @readonly
     * @constant
     */
    SIXTH_PI: 0.5235987755982988,

    /**
     * 180 / PI
     * @type {number}
     * @readonly
     * @constant
     */
    RADIANS_TO_DEGREES: 57.29577951308232,

    /**
     * PI / 180
     * @type {number}
     * @readonly
     * @constant
     */
    DEGREES_TO_RADIANS: 0.017453292519943295,

    /**
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    },

    /**
     * @param {number} y
     * @param {number} x
     * @returns {number}
     */
    fastAtan2(y, x) {
        const ax = Math.abs(x), ay = Math.abs(y);
        if ((ax | ay) === 0) return 0;

        const a = Math.min(ax, ay) / Math.max(ax, ay);
        const s = a * a;

        let r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a +
            a;
        r = ay > ax ? MathsUtils.HALF_PI - r : r;
        r = x < 0 ? Math.PI - r : r;
        return y < 0 ? -r : r;
    },

    /**
     * @param {number} value
     * @returns {number}
     */
    fastTrunc(value) {
        return value | 0;
    },

    /**
     * @param {number} value
     * @returns {number}
     */
    fastFloor(value) {
        if (value >= 0) return value | 0;
        const truncated = value | 0;
        return value === truncated ? truncated : truncated - 1;
    },

    /**
     * @param {number} value
     * @returns {number}
     */
    fastCeil(value) {
        if (value <= 0) return value | 0;
        const truncated = value | 0;
        return value === truncated ? truncated : truncated + 1;
    },

    /**
     * @param {number} value
     * @returns {number}
     */
    fastRound(value) {
        return (value + 0.5) | 0;
    },

    /**
     * @param {number} value
     * @param {number} n
     * @returns {number}
     */
    ipow(value, n) {
        if (n === 0) return 1;
        if (n === 1) return value;
        if (n < 0) return 1 / MathsUtils.ipow(value, -n);

        let result = 1;
        let base = value;
        while (n > 0) {
            if (n & 1) result *= base;
            n >>>= 1;
            if (n > 0) base *= base;
        }
        return result;
    },

    /**
     * @param {number} angle - in radians
     * @returns {number}
     */
    qcos(angle) {
        return _Q_SIN_TABLE[
            (((angle * _TABLE_SCALE) | 0) + _QUARTER_TABLE_SIZE) & _TABLE_MASK
        ];
    },

    /**
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    qdiv(a, b) {
        return b === 0
            ? (a >= 0 ? 0x7FFFFFFF : -0x7FFFFFFF)
            : ((a * Q_ONE) / b) | 0;
    },

    /**
     * @param {number} value
     * @returns {number}
     */
    qfloor(value) {
        return value & ~(Q_ONE - 1);
    },

    /**
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    qmul(a, b) {
        return ((a * b) / Q_ONE) | 0;
    },

    /**
     * @param {number} angle - in radians
     * @returns {number}
     */
    qsin(angle) {
        return _Q_SIN_TABLE[((angle * _TABLE_SCALE) | 0) & _TABLE_MASK];
    },

    /**
     * @param {number} value
     * @returns {number}
     */
    qtrunc(value) {
        return value >= 0 ? value & ~(Q_ONE - 1) : -((-value) & ~(Q_ONE - 1));
    },

    /**
     * @param {number} value
     * @param {number} [amount=1]
     * @returns {number}
     */
    shrdiv(value, amount = 1) {
        return value >> amount;
    },

    /**
     * @param {number} value
     * @param {number} [amount=1]
     * @returns {number}
     */
    shlmul(value, amount = 1) {
        return value << amount;
    },

    /**
     * @param {number} value
     * @returns {number}
     */
    smoothstep(value) {
        const t = MathsUtils.clamp(value, 0, 1);
        return t * t * (3 - 2 * t);
    },

    /**
     * @param {number} value
     * @returns {number}
     */
    smootherstep(value) {
        const t = MathsUtils.clamp(value, 0, 1);
        return t * t * t * (t * (t * 6 - 15) + 10);
    },

    /**
     * @param {number} radians
     * @returns {number}
     */
    toDegrees(radians) {
        return radians * MathsUtils.RADIANS_TO_DEGREES;
    },

    /**
     * @param {number} float
     * @returns {number}
     */
    toFixed(float) {
        return (float * Q_ONE) | 0;
    },

    /**
     * @param {number} fixed
     * @returns {number}
     */
    toFloat(fixed) {
        return fixed / Q_ONE;
    },

    /**
     * @param {number} degrees
     * @returns {number}
     */
    toRadians(degrees) {
        return degrees * MathsUtils.DEGREES_TO_RADIANS;
    },
};
