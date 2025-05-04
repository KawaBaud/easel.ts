export function getArray<T extends ArrayLike<unknown>>(
	array: T,
	i: number,
): T[number] | 0 {
	return array[i] ?? 0;
}

export function setArray<T extends Array<unknown>>(
	array: T,
	i: number,
	value: T[number],
): void {
	if (i >= array.length) return;
	array[i] = value;
}
