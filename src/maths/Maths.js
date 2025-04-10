export const Q_ONE = 1 << 12;

const _TAU = 6.283185307179586;

const _TABLE_SIZE = 1024;
const _TABLE_MASK = _TABLE_SIZE - 1;
const _TABLE_SCALE = 162.97466172610083; // 1024 / (PI * 2)

const _Q_SIN_TABLE = new Int32Array(_TABLE_SIZE);
const _Q_COS_TABLE = new Int32Array(_TABLE_SIZE);

for (let i = 0; i < _TABLE_SIZE; i++) {
    const angle = i * _TAU / _TABLE_SIZE;
    _Q_SIN_TABLE[i] = (Math.sin(angle) * Q_ONE) | 0;
    _Q_COS_TABLE[i] = (Math.cos(angle) * Q_ONE) | 0;
}

export const Maths = {
    EPSILON: 1e-4, // 0.0001

    TAU: _TAU, // 2 * PI
    PISQ: 9.869604401089358, // PI * PI
    HALF_PI: 1.5707963267948966, // PI / 2
    QUARTER_PI: 0.7853981633974483, // PI / 4

    RAD_TO_DEG: 57.29577951308232, // 180 / PI
    DEG_TO_RAD: 0.017453292519943295, // PI / 180

    clamp(x, min, max) {
        return Math.max(min, Math.min(x, max));
    },

    fastAtan2(y, x) {
        const ax = Math.abs(x), ay = Math.abs(y);
        if ((ax | ay) === 0) return 0;

        const a = Math.min(ax, ay) / Math.max(ax, ay);
        const s = a * a;

        let r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a +
            a;
        r = ay > ax ? Maths.HALF_PI - r : r;
        r = x < 0 ? Math.PI - r : r;
        return y < 0 ? -r : r;
    },
    fastCeil(x) {
        return x > 0 && x !== (x | 0) ? (x | 0) + 1 : x | 0;
    },
    fastRound(x) {
        return (x + 0.5) | 0;
    },
    fastTrunc(x) {
        return x | 0;
    },

    ipow(x, n) {
        if (n === 0) return 1;
        if (n === 1) return x;
        if (n < 0) return 1 / Maths.ipow(x, -n);

        let result = 1;
        let base = x;
        while (n > 0) {
            if (n & 1) result *= base;
            n >>>= 1;
            if (n > 0) base *= base;
        }
        return result;
    },

    qcos(angle) {
        return _Q_COS_TABLE[(angle * _TABLE_SCALE) | 0 & _TABLE_MASK];
    },
    qdiv(a, b) {
        return b === 0
            ? (a >= 0 ? 0x7FFFFFFF : -0x7FFFFFFF)
            : ((a * Q_ONE) / b) | 0;
    },
    qmul(a, b) {
        return ((a * b) / Q_ONE) | 0;
    },
    qsin(angle) {
        return _Q_SIN_TABLE[(angle * _TABLE_SCALE) | 0 & _TABLE_MASK];
    },

    shrdiv(x, amount = 1) {
        return x >> amount;
    },
    shlmul(x, amount = 1) {
        return x << amount;
    },
    smoothstep(x) {
        const t = Maths.clamp(x, 0, 1);
        return t * t * (3 - 2 * t);
    },
    smootherstep(x) {
        const t = Maths.clamp(x, 0, 1);
        return t * t * t * (t * (t * 6 - 15) + 10);
    },

    toDegrees(radians) {
        return radians * Maths.RAD_TO_DEG;
    },
    toFixed(x) {
        return (x * Q_ONE) | 0;
    },
    toFloat(x) {
        return x / Q_ONE;
    },
    toRadians(degrees) {
        return degrees * Maths.DEG_TO_RAD;
    },
};
