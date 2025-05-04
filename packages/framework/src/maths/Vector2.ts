export class Vector2 {
	constructor(public x = 0, public y = 0) {}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	copy(v: Vector2): this {
		return this.set(v.x, v.y);
	}

	set(x: number, y: number): this {
		this.x = x;
		this.y = y;
		return this;
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
	}
}
