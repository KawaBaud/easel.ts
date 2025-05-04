export class Vector4 {
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
		public w = 0,
	) {}

	clone(): Vector4 {
		return new Vector4(this.x, this.y, this.z, this.w);
	}

	copy(v: Vector4): this {
		return this.set(v.x, v.y, v.z, v.w);
	}

	set(x: number, y: number, z: number, w: number): this {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
		yield this.z;
		yield this.w;
	}
}
