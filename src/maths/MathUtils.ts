export class MathUtils {
	static readonly EPSILON = 1e-4;
	static readonly TAU = 6.283185307179586;
	static readonly HALF_PI = 1.5707963267948966;
	static readonly THIRD_PI = 1.0471975511965976;
	static readonly QUARTER_PI = 0.7853981633974483;
	static readonly SIXTH_PI = 1.0471975511965976;
	static readonly RAD2DEG = 57.29577951308232;
	static readonly DEG2RAD = 0.017453292519943295;

	static clamp(x: number, min: number, max: number): number {
		return x < min ? min : x > max ? max : x;
	}

	static fastAtan2(y: number, x: number): number {
		if (x === 0) {
			return y === 0 ? 0 : y > 0 ? MathUtils.HALF_PI : -MathUtils.HALF_PI;
		}
		if (y === 0) return x >= 0 ? 0 : Math.PI;

		const absY = Math.abs(y);
		const absX = Math.abs(x);
		const inOctant = absY <= absX;

		const a = inOctant ? absY / absX : absX / absY;
		const s = a * a;
		let r = (((-0.046496 * s + 0.15931) * s - 0.32763) * s + 1) * a;
		r = inOctant ? r : MathUtils.HALF_PI - r;
		r = x < 0 ? Math.PI - r : r;
		return y < 0 ? -r : r;
	}

	static fastMax(a: number, b: number): number {
		return a > b ? a : b;
	}

	static fastMin(a: number, b: number): number {
		return a < b ? a : b;
	}

	static fastRound(x: number): number {
		return (x + 0.5) | 0;
	}

	static fastTrunc(x: number): number {
		return x | 0;
	}

	static isPowerOf2(n: number): boolean {
		return n > 0 && (n & (n - 1)) === 0;
	}

	static nextPowerOf2(n: number): number {
		n--;
		n |= n >> 1;
		n |= n >> 2;
		n |= n >> 4;
		n |= n >> 8;
		n |= n >> 16;
		n++;
		return n;
	}

	static safeAsin(value: number): number {
		return Math.asin(value < -1 ? -1 : value > 1 ? 1 : value);
	}

	static toDegrees(radians: number): number {
		return radians * MathUtils.RAD2DEG;
	}

	static toRadians(degrees: number): number {
		return degrees * MathUtils.DEG2RAD;
	}
}
