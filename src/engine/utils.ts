export function createElement(tagName: string): HTMLElement {
	return globalThis.document.createElement(tagName);
}

export function get<T extends ArrayLike<unknown>>(
	array: T,
	i: number,
): T[number] | 0 {
	return array[i] ?? 0;
}

export function set<T extends Array<unknown>>(
	array: T,
	i: number,
	value: T[number],
): void {
	array[i] = value;
}
