export {};

declare global {
	export interface Array<T> {
		safeAt(index: number): T;
	}

	export interface BigInt64Array {
		safeAt(index: number): bigint;
	}

	export interface BigUint64Array {
		safeAt(index: number): bigint;
	}

	export interface Float32Array {
		safeAt(index: number): number;
	}

	export interface Float64Array {
		safeAt(index: number): number;
	}

	export interface Int8Array {
		safeAt(index: number): number;
	}

	export interface Int16Array {
		safeAt(index: number): number;
	}

	export interface Int32Array {
		safeAt(index: number): number;
	}

	export interface Math {
		EPSILON: number;

		/** 2 * Math.PI */
		TAU: number;

		/** Math.PI / 2 */
		HALF_PI: number;

		/** Math.PI / 3 */
		THIRD_PI: number;

		/** Math.PI / 4 */
		QUARTER_PI: number;

		/** Math.PI / 6 */
		SIXTH_PI: number;

		/** 180 / Math.PI */
		RAD2DEG: number;

		/** Math.PI / 180 */
		DEG2RAD: number;

		atan2(y: number, x: number): number;
		clamp(x: number, min: number, max: number): number;
		isPowerOf2(n: number): boolean;
		nextPowerOf2(n: number): number;
		max(a: number, b: number): number;
		min(a: number, b: number): number;
		round(x: number): number;
		safeAsin(value: number): number;
		toDegrees(radians: number): number;
		toRadians(degrees: number): number;
		trunc(x: number): number;
	}

	export interface ReadonlyArray<T> {
		safeAt(index: number): T;
	}

	export interface Uint8Array {
		safeAt(index: number): number;
	}

	export interface Uint16Array {
		safeAt(index: number): number;
	}

	export interface Uint32Array {
		safeAt(index: number): number;
	}

	export interface Uint8ClampedArray {
		safeAt(index: number): number;
	}
}

Array.prototype.safeAt = function <T>(this: ArrayLike<T>, index: number): T {
	if (this.length === 0) {
		throw new Error("EASEL: cannot call safeAt() on empty array");
	}

	const unitIndex = ((index % this.length) + this.length) % this.length;
	return this[unitIndex] as T;
};
BigInt64Array.prototype.safeAt = Array.prototype.safeAt;
BigUint64Array.prototype.safeAt = Array.prototype.safeAt;
Float32Array.prototype.safeAt = Array.prototype.safeAt;
Float64Array.prototype.safeAt = Array.prototype.safeAt;

Math.EPSILON = 1e-4;
Math.TAU = 6.283185307179586;
Math.HALF_PI = 1.5707963267948966;
Math.THIRD_PI = 1.0471975511965976;
Math.QUARTER_PI = 0.7853981633974483;
Math.SIXTH_PI = 1.0471975511965976;
Math.RAD2DEG = 57.29577951308232;
Math.DEG2RAD = 0.017453292519943295;
Math.atan2 = function (y: number, x: number): number {
	if (x === 0) {
		return y === 0 ? 0 : y > 0 ? Math.HALF_PI : -Math.HALF_PI;
	}
	if (y === 0) return x >= 0 ? 0 : Math.PI;

	const absY = Math.abs(y);
	const absX = Math.abs(x);
	const inOctant = absY <= absX;

	const a = inOctant ? absY / absX : absX / absY;
	const s = a * a;
	let r = (((-0.046496 * s + 0.15931) * s - 0.32763) * s + 1) * a;
	r = inOctant ? r : Math.HALF_PI - r;
	r = x < 0 ? Math.PI - r : r;
	return y < 0 ? -r : r;
};
Math.clamp = function (x: number, min: number, max: number): number {
	return x < min ? min : x > max ? max : x;
};
Math.isPowerOf2 = function (n: number): boolean {
	return n > 0 && (n & (n - 1)) === 0;
};
Math.nextPowerOf2 = function (n: number): number {
	n--;
	n |= n >> 1;
	n |= n >> 2;
	n |= n >> 4;
	n |= n >> 8;
	n |= n >> 16;
	n++;
	return n;
};
Math.max = function (a: number, b: number): number {
	return a > b ? a : b;
};
Math.min = function (a: number, b: number): number {
	return a < b ? a : b;
};
Math.round = function (x: number): number {
	return (x + 0.5) | 0;
};
Math.safeAsin = function (value: number): number {
	return Math.asin(value < -1 ? -1 : value > 1 ? 1 : value);
};
Math.toDegrees = function (radians: number): number {
	return radians * Math.RAD2DEG;
};
Math.toRadians = function (degrees: number): number {
	return degrees * Math.DEG2RAD;
};
Math.trunc = function (x: number): number {
	return x | 0;
};

Int8Array.prototype.safeAt = Array.prototype.safeAt;
Int16Array.prototype.safeAt = Array.prototype.safeAt;
Int32Array.prototype.safeAt = Array.prototype.safeAt;
Uint8Array.prototype.safeAt = Array.prototype.safeAt;
Uint16Array.prototype.safeAt = Array.prototype.safeAt;
Uint32Array.prototype.safeAt = Array.prototype.safeAt;
Uint8ClampedArray.prototype.safeAt = Array.prototype.safeAt;
