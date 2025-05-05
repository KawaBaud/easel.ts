import { fromArray } from "../utils.ts";
import type { Euler } from "./Euler.ts";
import type { Vector3 } from "./Vector3.ts";

export class Quaternion {
	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0,
		public w: number = 1,
	) {}

	get length(): number {
		return Math.sqrt(this.lengthSq);
	}

	get lengthSq(): number {
		const { x, y, z, w } = this;
		return (x * x) + (y * y) + (z * z) + (w * w);
	}

	clone(): Quaternion {
		return new Quaternion().copy(this);
	}

	copy(q: Quaternion): this {
		return this.set(q.x, q.y, q.z, q.w);
	}

	div(q: Quaternion): this {
		return this.set(
			this.x / q.x,
			this.y / q.y,
			this.z / q.z,
			this.w / q.w,
		);
	}

	divScalar(scalar: number): this {
		return this.set(
			this.x / scalar,
			this.y / scalar,
			this.z / scalar,
			this.w / scalar,
		);
	}

	fromArray(array: number[]): this {
		const slice = array.slice(0, 4);
		return this.set(
			fromArray(slice, 0),
			fromArray(slice, 1),
			fromArray(slice, 2),
			fromArray(slice, 3),
		);
	}

	set(x: number, y: number, z: number, w: number): this {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	setFromAxisAngle(axis: Vector3, angle: number): this {
		const halfAngle = angle / 2;
		const s = Math.sin(halfAngle);

		return this.set(
			axis.x * s,
			axis.y * s,
			axis.z * s,
			Math.cos(halfAngle),
		);
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
