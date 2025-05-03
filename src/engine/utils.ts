export function get<T>(array: T[], i: number): T | 0 {
	return array[i] ?? 0;
}

export function set<T>(array: T[], i: number, value: T): void {
	array[i] = value;
}
