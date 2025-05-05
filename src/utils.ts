export function fromArray<T>(array: ArrayLike<T>, i: number): T {
	return array[i] as T;
}
