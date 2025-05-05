import { fromArray } from "../utils.ts";
import type { Euler } from "./Euler.ts";
import type { Matrix4 } from "./Matrix4.ts";
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

	invert(): this {
		return this.set(-this.x, -this.y, -this.z, this.w);
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

	setFromRotationMatrix(m: Matrix4): this {
		const te = m.elements;

		const m11 = fromArray(te, 0);
		const m12 = fromArray(te, 4);
		const m13 = fromArray(te, 8);
		const m21 = fromArray(te, 1);
		const m22 = fromArray(te, 5);
		const m23 = fromArray(te, 9);
		const m31 = fromArray(te, 2);
		const m32 = fromArray(te, 6);
		const m33 = fromArray(te, 10);

		const trace = m11 + m22 + m33;
		if (trace > 0) {
			const s = 0.5 / Math.sqrt(trace + 1.0);

			this.w = 0.25 / s;
			this.x = (m32 - m23) * s;
			this.y = (m13 - m31) * s;
			this.z = (m21 - m12) * s;
		} else if (m11 > m22 && m11 > m33) {
			const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

			this.w = (m32 - m23) / s;
			this.x = 0.25 * s;
			this.y = (m12 + m21) / s;
			this.z = (m13 + m31) / s;
		} else if (m22 > m33) {
			const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

			this.w = (m13 - m31) / s;
			this.x = (m12 + m21) / s;
			this.y = 0.25 * s;
			this.z = (m23 + m32) / s;
		} else {
			const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

			this.w = (m21 - m12) / s;
			this.x = (m13 + m31) / s;
			this.y = (m23 + m32) / s;
			this.z = 0.25 * s;
		}
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
