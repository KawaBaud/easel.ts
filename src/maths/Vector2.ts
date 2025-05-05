import "../types.ts";

export class Vector2 {
	constructor(public x = 0, public y = 0) {}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	copy(v: Vector2): this {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	fromArray(array: number[]): this {
		this.x = array.safeAt(0);
		this.y = array.safeAt(1);
		return this;
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
