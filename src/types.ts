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
Int8Array.prototype.safeAt = Array.prototype.safeAt;
Int16Array.prototype.safeAt = Array.prototype.safeAt;
Int32Array.prototype.safeAt = Array.prototype.safeAt;
Uint8Array.prototype.safeAt = Array.prototype.safeAt;
Uint16Array.prototype.safeAt = Array.prototype.safeAt;
Uint32Array.prototype.safeAt = Array.prototype.safeAt;
Uint8ClampedArray.prototype.safeAt = Array.prototype.safeAt;
