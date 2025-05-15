export {};

declare global {
	export interface Array<T> {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): T;
	}

	export interface ReadonlyArray<T> {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): T;
	}

	export interface BigInt64Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): bigint;
	}

	export interface BigUint64Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): bigint;
	}

	export interface Float32Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): number;
	}

	export interface Float64Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): number;
	}

	export interface Int8Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): number;
	}

	export interface Int16Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): number;
	}

	export interface Int32Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): number;
	}

	export interface Uint8Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): number;
	}

	export interface Uint16Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): number;
	}

	export interface Uint32Array {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): number;
	}

	export interface Uint8ClampedArray {
		/**
		 * Returns the item at the given index.
		 * If the index is out of bounds, it wraps around (modulo behavior).
		 * Throws an error if the array is empty.
		 * @param index The index of the element to return.
		 */
		safeAt(index: number): number;
	}
}
