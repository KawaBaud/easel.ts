import type { Euler } from "./Euler.ts";

export class Quaternion {
	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0,
		public w: number = 1,
	) {}

	clone(): Quaternion {
		return new Quaternion().copy(this);
	}

	copy(q: Quaternion): this {
		return this.set(q.x, q.y, q.z, q.w);
	}

	set(x: number, y: number, z: number, w: number): this {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	setFromEuler(euler: Euler): this {
		const { x, y, z, order } = euler;

		const c1 = Math.cos(x / 2);
		const c2 = Math.cos(y / 2);
		const c3 = Math.cos(z / 2);
		const s1 = Math.sin(x / 2);
		const s2 = Math.sin(y / 2);
		const s3 = Math.sin(z / 2);

		switch (order) {
			case "XYZ":
				return this.set(
					(s1 * c2 * c3) + (c1 * s2 * s3),
					(c1 * s2 * c3) - (s1 * c2 * s3),
					(c1 * c2 * s3) + (s1 * s2 * c3),
					(c1 * c2 * c3) - (s1 * s2 * s3),
				);
			case "YXZ":
				return this.set(
					(s1 * c2 * c3) + (c1 * s2 * s3),
					(c1 * s2 * c3) - (s1 * c2 * s3),
					(c1 * c2 * s3) - (s1 * s2 * c3),
					(c1 * c2 * c3) + (s1 * s2 * s3),
				);
			case "ZXY":
				return this.set(
					(s1 * c2 * c3) - (c1 * s2 * s3),
					(c1 * s2 * c3) + (s1 * c2 * s3),
					(c1 * c2 * s3) + (s1 * s2 * c3),
					(c1 * c2 * c3) - (s1 * s2 * s3),
				);
			case "ZYX":
				return this.set(
					(s1 * c2 * c3) - (c1 * s2 * s3),
					(c1 * s2 * c3) + (s1 * c2 * s3),
					(c1 * c2 * s3) - (s1 * s2 * c3),
					(c1 * c2 * c3) + (s1 * s2 * s3),
				);
			case "YZX":
				return this.set(
					(s1 * c2 * c3) + (c1 * s2 * s3),
					(c1 * s2 * c3) + (s1 * c2 * s3),
					(c1 * c2 * s3) - (s1 * s2 * c3),
					(c1 * c2 * c3) - (s1 * s2 * s3),
				);
			case "XZY":
				return this.set(
					(s1 * c2 * c3) - (c1 * s2 * s3),
					(c1 * s2 * c3) - (s1 * c2 * s3),
					(c1 * c2 * s3) + (s1 * s2 * c3),
					(c1 * c2 * c3) + (s1 * s2 * s3),
				);
		}
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
		yield this.z;
		yield this.w;
	}
}
