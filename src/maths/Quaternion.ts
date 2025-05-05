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
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;
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
		const slice = array.slice(0, 4);

		this.x = fromArray(slice, 0);
		this.y = fromArray(slice, 1);
		this.z = fromArray(slice, 2);
		this.w = fromArray(slice, 3);
		return this;
	}

	invert(): this {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		return this;
	}

	premul(q: Quaternion): this {
		const { x, y, z, w } = this;
		const { x: qx, y: qy, z: qz, w: qw } = q;

		this.x = (qx * w) + (qw * x) + (qy * z) - (qz * y);
		this.y = (qy * w) + (qw * y) + (qz * x) - (qx * z);
		this.z = (qz * w) + (qw * z) + (qx * y) - (qy * x);
		this.w = (qw * w) - (qx * x) - (qy * y) - (qz * z);
		return this;
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

		this.x = axis.x * s;
		this.y = axis.y * s;
		this.z = axis.z * s;
		this.w = Math.cos(halfAngle);
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
				this.x = (s1 * c2 * c3) + (c1 * s2 * s3);
				this.y = (c1 * s2 * c3) - (s1 * c2 * s3);
				this.z = (c1 * c2 * s3) + (s1 * s2 * c3);
				this.w = (c1 * c2 * c3) - (s1 * s2 * s3);
				return this;
			case "YXZ":
				this.x = (s1 * c2 * c3) + (c1 * s2 * s3);
				this.y = (c1 * s2 * c3) - (s1 * c2 * s3);
				this.z = (c1 * c2 * s3) - (s1 * s2 * c3);
				this.w = (c1 * c2 * c3) + (s1 * s2 * s3);
				return this;
			case "ZXY":
				this.x = (s1 * c2 * c3) - (c1 * s2 * s3);
				this.y = (c1 * s2 * c3) + (s1 * c2 * s3);
				this.z = (c1 * c2 * s3) + (s1 * s2 * c3);
				this.w = (c1 * c2 * c3) - (s1 * s2 * s3);
				return this;
			case "ZYX":
				this.x = (s1 * c2 * c3) - (c1 * s2 * s3);
				this.y = (c1 * s2 * c3) + (s1 * c2 * s3);
				this.z = (c1 * c2 * s3) - (s1 * s2 * c3);
				this.w = (c1 * c2 * c3) + (s1 * s2 * s3);
				return this;
			case "YZX":
				this.x = (s1 * c2 * c3) + (c1 * s2 * s3);
				this.y = (c1 * s2 * c3) + (s1 * c2 * s3);
				this.z = (c1 * c2 * s3) - (s1 * s2 * c3);
				this.w = (c1 * c2 * c3) - (s1 * s2 * s3);
				return this;
			case "XZY":
				this.x = (s1 * c2 * c3) - (c1 * s2 * s3);
				this.y = (c1 * s2 * c3) - (s1 * c2 * s3);
				this.z = (c1 * c2 * s3) + (s1 * s2 * c3);
				this.w = (c1 * c2 * c3) + (s1 * s2 * s3);
				return this;
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
