import type {
	Cloneable,
	Copyable,
	Equatable,
	Serializable,
} from "../types/interfaces.ts";
import { get } from "../utils.ts";
import type { Euler } from "./Euler.ts";
import { MathUtils } from "./MathUtils.ts";
import type { Vector3 } from "./Vector3.ts";

export class Quaternion
	implements
		Cloneable<Quaternion>,
		Copyable<Quaternion>,
		Equatable<Quaternion>,
		Iterable<number>,
		Serializable {
	readonly isQuaternion = true;

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
		return (
			(this.x * this.x) +
			(this.y * this.y) +
			(this.z * this.z) +
			(this.w * this.w)
		);
	}

	get unitized(): this {
		const length = this.length;
		if (length === 0) return this.identity();

		const scale = 1 / length;
		return this.set(
			this.x * scale,
			this.y * scale,
			this.z * scale,
			this.w * scale,
		);
	}

	angleTo(q: Quaternion): number {
		return 2 * Math.acos(Math.abs(MathUtils.clamp(this.dot(q), -1, 1)));
	}

	clone(): Quaternion {
		return new Quaternion().copy(this);
	}

	conjugate(): this {
		return this.set(-this.x, -this.y, -this.z, this.w);
	}

	copy(q: Quaternion): this {
		return this.set(q.x, q.y, q.z, q.w);
	}

	dot(q: Quaternion): number {
		return (this.x * q.x) + (this.y * q.y) + (this.z * q.z) + (this.w * q.w);
	}

	equals(q: Quaternion): boolean {
		return (
			(q.x === this.x) &&
			(q.y === this.y) &&
			(q.z === this.z) &&
			(q.w === this.w)
		);
	}

	fromArray(array: number[], offset = 0): this {
		return this.set(
			get(array, offset),
			get(array, offset + 1),
			get(array, offset + 2),
			get(array, offset + 3),
		);
	}

	identity(): this {
		return this.set(0, 0, 0, 1);
	}

	div(q: Quaternion): this {
		return this.divQuaternions(this, q);
	}

	divScalar(scalar: number): this {
		return this.set(
			this.x / scalar,
			this.y / scalar,
			this.z / scalar,
			this.w / scalar,
		);
	}

	divQuaternions(a: Quaternion, b: Quaternion): this {
		return this.mulQuaternions(a, b.inverse());
	}

	inverse(): this {
		return this.conjugate().unitize();
	}

	mul(q: Quaternion): this {
		return this.mulQuaternions(this, q);
	}

	mulQuaternions(a: Quaternion, b: Quaternion): this {
		const { x: qax, y: qay, z: qaz, w: qaw } = a;
		const { x: qbx, y: qby, z: qbz, w: qbw } = b;

		return this.set(
			(qax * qbw) + (qaw * qbx) + (qay * qbz) - (qaz * qby),
			(qay * qbw) + (qaw * qby) + (qaz * qbx) - (qax * qbz),
			(qaz * qbw) + (qaw * qbz) + (qax * qby) - (qay * qbx),
			(qaw * qbw) - (qax * qbx) - (qay * qby) - (qaz * qbz),
		);
	}

	premul(q: Quaternion): this {
		return this.mulQuaternions(q, this);
	}

	random(): this {
		const u1 = Math.random();
		const u2 = Math.random();
		const u3 = Math.random();

		const sTheta = Math.sqrt(1 - u1);
		const cTheta = Math.sqrt(u1);

		return this.set(
			sTheta * Math.sin(MathUtils.TAU * u2),
			sTheta * Math.cos(MathUtils.TAU * u2),
			cTheta * Math.sin(MathUtils.TAU * u3),
			cTheta * Math.cos(MathUtils.TAU * u3),
		);
	}

	rotateTowards(q: Quaternion, step: number): this {
		const angle = this.angleTo(q);
		if (angle === 0) return this;

		const theta = Math.min(1, step / angle);
		return this.slerp(q, theta);
	}

	set(x: number, y: number, z: number, w: number): this {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	/**
	 * @param angle - in radians
	 */
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

	setFromUnitVectors(vFrom: Vector3, vTo: Vector3): this {
		let r = vFrom.dot(vTo) + 1;
		if (r < MathUtils.EPSILON) {
			r = 0;
			if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
				this.set(-vFrom.y, vFrom.x, 0, r);
			} else {
				this.set(0, -vFrom.z, vFrom.y, r);
			}
		} else {
			this.set(
				(vFrom.y * vTo.z) - (vFrom.z * vTo.y),
				(vFrom.z * vTo.x) - (vFrom.x * vTo.z),
				(vFrom.x * vTo.y) - (vFrom.y * vTo.x),
				r,
			);
		}
		return this.unitize();
	}

	slerp(qb: Quaternion, t: number): this {
		if (t === 0) return this;
		if (t === 1) return this.copy(qb);

		const { x, y, z, w } = this;
		const { x: qbx, y: qby, z: qbz, w: qbw } = qb;

		let cHalfTheta = (w * qbw) + (x * qbx) + (y * qby) + (z * qbz);

		let [bx, by, bz, bw] = [qbx, qby, qbz, qbw];

		if (cHalfTheta < 0) {
			cHalfTheta = -cHalfTheta;
			bx = -qbx;
			by = -qby;
			bz = -qbz;
			bw = -qbw;
		} else if (cHalfTheta >= 0.999) {
			return this.set(
				x + t * (bx - x),
				y + t * (by - y),
				z + t * (bz - z),
				w + t * (bw - w),
			).unitize();
		}

		const sHalfTheta = Math.sqrt(1.0 - cHalfTheta * cHalfTheta);
		const halfTheta = Math.atan2(sHalfTheta, cHalfTheta);

		const ratioA = Math.sin((1 - t) * halfTheta) / sHalfTheta;
		const ratioB = Math.sin(t * halfTheta) / sHalfTheta;

		return this.set(
			(x * ratioA) + (bx * ratioB),
			(y * ratioA) + (by * ratioB),
			(z * ratioA) + (bz * ratioB),
			(w * ratioA) + (bw * ratioB),
		);
	}

	toArray(array: number[] = [], offset = 0): number[] {
		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;
		array[offset + 3] = this.w;
		return array;
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
