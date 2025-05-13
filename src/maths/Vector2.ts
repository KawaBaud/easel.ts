export class Vector2 {
	#x = 0;
	#y = 0;

	constructor(x = 0, y = 0) {
		this.#x = x;
		this.#y = y;
	}

	get x(): number {
		return this.#x;
	}

	set x(value: number) {
		this.#x = value;
	}

	get y(): number {
		return this.#y;
	}

	set y(value: number) {
		this.#y = value;
	}

	add(v: Vector2): this {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	copy(v: Vector2): this {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	equals(v: Vector2): boolean {
		return (this.x === v.x) && (this.y === v.y);
	}

	fromArray(array: number[]): this {
		this.x = array.safeAt(0);
		this.y = array.safeAt(1);
		return this;
	}

	mulScalar(scalar: number): this {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	set(x: number, y: number): this {
		this.x = x;
		this.y = y;
		return this;
	}

	sub(v: Vector2): this {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
	}
}
