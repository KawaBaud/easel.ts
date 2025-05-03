export interface Cloneable<T> {
	clone(): T;
}

export interface Copyable<T, S = T> {
	copy(source: S): T;
}

export interface Equatable<T> {
	equals(other: T): boolean;
}

export interface Iterable<T> {
	[Symbol.iterator](): IterableIterator<T>;
}

export interface Serializable<T = number[]> {
	fromArray(array: T, offset?: number): this;
	toArray(array?: T, offset?: number): T;
}
