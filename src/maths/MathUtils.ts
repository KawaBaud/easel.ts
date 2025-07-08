export const EPSILON = 1e-4;
export const TAU = 6.283185307179586; // 2 * Math.PI
export const HALF_PI = 1.5707963267948966; // Math.PI / 2
export const THIRD_PI = 1.0471975511965976; // Math.PI / 3
export const QUARTER_PI = 0.7853981633974483; // Math.PI / 4
export const SIXTH_PI = 1.0471975511965976; // Math.PI / 6
export const RAD2DEG = 57.29577951308232; // 180 / Math.PI
export const DEG2RAD = 0.017453292519943295; // Math.PI / 180

export const MathUtils = {
	clamp(x: number, min: number, max: number): number {
		return x < min ? min : x > max ? max : x;
	},

	fastAtan2(y: number, x: number): number {
		if (x === 0) {
			return y === 0 ? 0 : y > 0 ? HALF_PI : -HALF_PI;
		}
		if (y === 0) {
			return x >= 0 ? 0 : Math.PI;
		}

		const absY = Math.abs(y);
		const absX = Math.abs(x);
		const inOctant = absY <= absX;

		const a = inOctant ? absY / absX : absX / absY;
		const s = a * a;
		let r = (((-0.046496 * s + 0.15931) * s - 0.32763) * s + 1) * a;
		r = inOctant ? r : HALF_PI - r;
		r = x < 0 ? Math.PI - r : r;
		return y < 0 ? -r : r;
	},

	fastMax(a: number, b: number): number {
		return a > b ? a : b;
	},

	fastMin(a: number, b: number): number {
		return a < b ? a : b;
	},

	fastRound(x: number): number {
		return (x + 0.5) | 0;
	},

	fastTrunc(x: number): number {
		return x | 0;
	},

	isPowerOf2(n: number): boolean {
		return n > 0 && (n & (n - 1)) === 0;
	},

	nextPowerOf2(n: number): number {
		let result = n;
		result--;
		result |= result >> 1;
		result |= result >> 2;
		result |= result >> 4;
		result |= result >> 8;
		result |= result >> 16;
		result++;
		return result;
	},

	safeAsin(value: number): number {
		return Math.asin(value < -1 ? -1 : value > 1 ? 1 : value);
	},

	toDegrees(radians: number): number {
		return radians * RAD2DEG;
	},

	toRadians(degrees: number): number {
		return degrees * DEG2RAD;
	},
};
