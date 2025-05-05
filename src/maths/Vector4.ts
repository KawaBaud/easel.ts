import { fromArray } from "../utils.ts";

export class Vector4 {
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
		public w = 1,
	) {}

	clone(): Vector4 {
		return new Vector4(this.x, this.y, this.z, this.w);
	}

	copy(v: Vector4): this {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
		return this;
	}

	fromArray(array: number[]): this {
		const slice = array.slice(0, 4);

		this.x = fromArray(slice, 0);
		this.y = fromArray(slice, 1);
		this.z = fromArray(slice, 2);
		this.w = fromArray(slice, 3);
		return this;
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
