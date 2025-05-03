export const Q_ONE = 1 << 12;

const _TAU = 6.283185307179586;

const _TABLE_SIZE = 1024;
const _QUARTER_TABLE_SIZE = _TABLE_SIZE >> 2;
const _TABLE_MASK = _TABLE_SIZE - 1;
const _TABLE_SCALE = 162.97466172610083; // 1024 / (PI * 2)

const _Q_SIN_TABLE = new Int32Array(_TABLE_SIZE);

for (let i = 0; i < _TABLE_SIZE; i++) {
	const angle = i * _TAU / _TABLE_SIZE;
	_Q_SIN_TABLE[i] = (Math.sin(angle) * Q_ONE) | 0;
}

export class MathsUtils {
	static readonly EPSILON: number = 1e-4;

	static readonly TAU: number = _TAU;
	static readonly PISQ: number = 9.869604401089358;
	static readonly HALF_PI: number = 1.5707963267948966;
	static readonly THIRD_PI: number = 1.0471975511965976;
	static readonly QUARTER_PI: number = 0.7853981633974483;
	static readonly SIXTH_PI: number = 0.5235987755982988;

	static readonly RAD2DEG: number = 57.29577951308232;
	static readonly DEG2RAD: number = 0.017453292519943295;

	static clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(value, max));
	}

	static fastAtan2(y: number, x: number): number {
		const { ax, ay } = { ax: Math.abs(x), ay: Math.abs(y) };
		if ((ax | ay) === 0) return 0;

		const a = Math.min(ax, ay) / Math.max(ax, ay);
		const s = a * a;

		let r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a + a;
		r = ay > ax ? MathsUtils.HALF_PI - r : r;
		r = x < 0 ? Math.PI - r : r;
		return y < 0 ? -r : r;
	}

	static fastTrunc(value: number): number {
		return value | 0;
	}

	static fastFloor(value: number): number {
		const truncated = value | 0;
		return value >= 0 || value === truncated ? truncated : truncated - 1;
	}

	static fastCeil(value: number): number {
		const truncated = value | 0;
		return value <= 0 || value === truncated ? truncated : truncated + 1;
	}

	static fastRound(value: number): number {
		return (value + 0.5) | 0;
	}

	static ipow(value: number, n: number): number {
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
	}

	static qcos(angle: number): number {
		return _Q_SIN_TABLE[
			(((angle * _TABLE_SCALE) | 0) + _QUARTER_TABLE_SIZE) & _TABLE_MASK
		] || 0;
	}

	static qdiv(a: number, b: number): number {
		return b === 0
			? (a >= 0 ? 0x7FFFFFFF : -0x7FFFFFFF)
			: ((a * Q_ONE) / b) | 0;
	}

	static qfloor(value: number): number {
		return value & ~(Q_ONE - 1);
	}

	static qmul(a: number, b: number): number {
		return ((a * b) / Q_ONE) | 0;
	}

	static qsin(angle: number): number {
		return _Q_SIN_TABLE[((angle * _TABLE_SCALE) | 0) & _TABLE_MASK] || 0;
	}

	static qtrunc(value: number): number {
		return value >= 0 ? value & ~(Q_ONE - 1) : -((-value) & ~(Q_ONE - 1));
	}

	static smoothstep(value: number): number {
		const t = MathsUtils.clamp(value, 0, 1);
		return t * t * (3 - 2 * t);
	}

	static smootherstep(value: number): number {
		const t = MathsUtils.clamp(value, 0, 1);
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	static toDegrees(radians: number): number {
		return radians * MathsUtils.RAD2DEG;
	}

	static toFixed(float: number): number {
		return (float * Q_ONE) | 0;
	}

	static toFloat(fixed: number): number {
		return fixed / Q_ONE;
	}

	static toRadians(degrees: number): number {
		return degrees * MathsUtils.DEG2RAD;
	}
}
