function safeAtImpl<T>(this: ArrayLike<T>, index: number): T {
	const { length } = this;
	if (length === 0) {
		throw new Error("EASEL: safeAt() called on empty array");
	}

	const N = length;
	const unitIndex = ((index % N) + N) % N;
	return this[unitIndex] as T;
}

if (!Array.prototype.safeAt) {
	Object.defineProperty(Array.prototype, "safeAt", {
		value: safeAtImpl,
		writable: true,
		configurable: true,
		enumerable: false,
	});
}

type TypedArrayConstructor =
	| BigInt64ArrayConstructor
	| BigUint64ArrayConstructor
	| Float32ArrayConstructor
	| Float64ArrayConstructor
	| Int8ArrayConstructor
	| Int16ArrayConstructor
	| Int32ArrayConstructor
	| Uint8ArrayConstructor
	| Uint16ArrayConstructor
	| Uint32ArrayConstructor
	| Uint8ClampedArrayConstructor;

const typedArrayConstructors: TypedArrayConstructor[] = [
	BigInt64Array,
	BigUint64Array,
	Float32Array,
	Float64Array,
	Int8Array,
	Int16Array,
	Int32Array,
	Uint8Array,
	Uint16Array,
	Uint32Array,
	Uint8ClampedArray,
];

for (const constructor of typedArrayConstructors) {
	if (constructor && (constructor.prototype && !constructor.prototype.safeAt)) {
		Object.defineProperty(constructor.prototype, "safeAt", {
			value: safeAtImpl,
			writable: true,
			configurable: true,
			enumerable: false,
		});
	}
}
