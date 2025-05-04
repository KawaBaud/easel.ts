import { get } from "../utils.ts";

export class MathUtils {
	static readonly EPSILON: number = 1e-4;

	static readonly TAU: number = 6.283185307179586;
	static readonly PISQ: number = 9.869604401089358;
	static readonly HALF_PI: number = 1.5707963267948966;
	static readonly THIRD_PI: number = 1.0471975511965976;
	static readonly QUARTER_PI: number = 0.7853981633974483;
	static readonly SIXTH_PI: number = 0.5235987755982988;

	static readonly RAD2DEG: number = 57.29577951308232;
	static readonly DEG2RAD: number = 0.017453292519943295;

	static readonly Q_ONE = 1 << 12;

	static #TABLE_SIZE = 1024;
	static #QUARTER_TABLE_SIZE = MathUtils.#TABLE_SIZE >> 2;
	static #TABLE_MASK = MathUtils.#TABLE_SIZE - 1;
	static #TABLE_SCALE = 162.97466172610083; // 1024 / (PI * 2)

	static #Q_SIN_TABLE = MathUtils.#initSinTable();

	static clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(value, max));
	}

	static fastAtan2(y: number, x: number): number {
		const ax = Math.abs(x);
		const ay = Math.abs(y);
		if ((ax | ay) === 0) return 0;

		const a = Math.min(ax, ay) / Math.max(ax, ay);
		const s = a * a;

		let r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a + a;
		r = ay > ax ? MathUtils.HALF_PI - r : r;
		r = x < 0 ? Math.PI - r : r;
		return y < 0 ? -r : r;
	}

	static fastTrunc(value: number): number {
		return value | 0;
	}

	static fastFloor(value: number): number {
		if (value >= 0) return value | 0;
		const truncated = value | 0;
		return value === truncated ? truncated : truncated - 1;
	}

	static fastCeil(value: number): number {
		if (value <= 0) return value | 0;
		const truncated = value | 0;
		return value === truncated ? truncated : truncated + 1;
	}

	static fastRound(value: number): number {
		return (value + 0.5) | 0;
	}

	static ipow(value: number, n: number): number {
		if (n === 0) return 1;
		if (n === 1) return value;
		if (n < 0) return 1 / MathUtils.ipow(value, -n);

		let result = 1;
		let base = value;
		while (n > 0) {
			if (n & 1) result *= base;
			n >>>= 1;
			if (n > 0) base *= base;
		}
		return result;
	}

	/**
	 * @param angle - in radians
	 */
	static qcos(angle: number): number {
		const index = (((angle * MathUtils.#TABLE_SCALE) | 0) +
			MathUtils.#QUARTER_TABLE_SIZE) & MathUtils.#TABLE_MASK;
		return get(MathUtils.#Q_SIN_TABLE, index);
	}

	static qdiv(a: number, b: number): number {
		return b === 0
			? (a >= 0 ? 0x7FFFFFFF : -0x7FFFFFFF)
			: ((a * MathUtils.Q_ONE) / b) | 0;
	}

	static qfloor(value: number): number {
		return value & ~(MathUtils.Q_ONE - 1);
	}

	static qmul(a: number, b: number): number {
		return ((a * b) / MathUtils.Q_ONE) | 0;
	}

	/**
	 * @param angle - in radians
	 */
	static qsin(angle: number): number {
		const index = ((angle * MathUtils.#TABLE_SCALE) | 0) &
			MathUtils.#TABLE_MASK;
		return get(MathUtils.#Q_SIN_TABLE, index);
	}

	static qtrunc(value: number): number {
		return value >= 0
			? value & ~(MathUtils.Q_ONE - 1)
			: -((-value) & ~(MathUtils.Q_ONE - 1));
	}

	static safeAsin(value: number): number {
		return Math.asin(MathUtils.clamp(value, -1, 1));
	}

	static smoothstep(value: number): number {
		const t = MathUtils.clamp(value, 0, 1);
		return t * t * (3 - 2 * t);
	}

	static smootherstep(value: number): number {
		const t = MathUtils.clamp(value, 0, 1);
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	static toDegrees(radians: number): number {
		return radians * MathUtils.RAD2DEG;
	}

	static toFixed(float: number): number {
		return (float * MathUtils.Q_ONE) | 0;
	}

	static toFloat(fixed: number): number {
		return fixed / MathUtils.Q_ONE;
	}

	static toRadians(degrees: number): number {
		return degrees * MathUtils.DEG2RAD;
	}

	static #initSinTable(): Int32Array {
		const table = new Int32Array(MathUtils.#TABLE_SIZE);
		for (let i = 0; i < MathUtils.#TABLE_SIZE; i++) {
			const angle = i * MathUtils.TAU / MathUtils.#TABLE_SIZE;
			table[i] = (Math.sin(angle) * MathUtils.Q_ONE) | 0;
		}
		return table;
	}
}
