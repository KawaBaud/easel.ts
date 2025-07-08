export class Vector4 {
	#x = 0;
	#y = 0;
	#z = 0;
	#w = 1;

	constructor(x = 0, y = 0, z = 0, w = 1) {
		this.#x = x;
		this.#y = y;
		this.#z = z;
		this.#w = w;
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

	get z(): number {
		return this.#z;
	}

	set z(value: number) {
		this.#z = value;
	}

	get w(): number {
		return this.#w;
	}

	set w(value: number) {
		this.#w = value;
	}

	get length(): number {
		return Math.sqrt(this.lengthSq);
	}

	get lengthSq(): number {
		const { x, y, z, w } = this;
		return x * x + y * y + z * z + w * w;
	}

	clone(): Vector4 {
		return new Vector4(this.x, this.y, this.z, this.w);
	}

	copy(v: this): this {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
		return this;
	}

	divScalar(scalar: number): this {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
		this.w /= scalar;
		return this;
	}

	fromArray(array: number[]): this {
		this.x = array[0] as number;
		this.y = array[1] as number;
		this.z = array[2] as number;
		this.w = array[3] as number;
		return this;
	}

	set(x: number, y: number, z: number, w: number): this {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	unitize(): this {
		return this.divScalar(this.length || 1);
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
		yield this.z;
		yield this.w;
	}
}
