import { getArray } from "../utils.ts";
import type { Euler } from "./Euler.ts";
import type { Matrix4 } from "./Matrix4.ts";
import { Quaternion } from "./Quaternion.ts";

export class Vector3 {
	constructor(public x = 0, public y = 0, public z = 0) {}

	get length(): number {
		return Math.sqrt(this.lengthSq);
	}

	get lengthSq(): number {
		const { x, y, z } = this;
		return (x * x) + (y * y) + (z * z);
	}

	add(v: Vector3): this {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	applyEuler(euler: Euler): this {
		const q = new Quaternion().setFromEuler(euler);
		return this.applyQuaternion(q);
	}

	applyMatrix4(m: Matrix4): this {
		const { x, y, z } = this;
		const me = m.elements;

		const w = (getArray(me, 3) * x) + (getArray(me, 7) * y) +
			(getArray(me, 11) * z) + getArray(me, 15);
		const iw = w !== 0 ? 1 / w : 1;

		return this.set(
			((getArray(me, 0) * x) + (getArray(me, 4) * y) +
				(getArray(me, 8) * z) +
				getArray(me, 12)) * iw,
			((getArray(me, 1) * x) + (getArray(me, 5) * y) +
				(getArray(me, 9) * z) +
				getArray(me, 13)) * iw,
			((getArray(me, 2) * x) + (getArray(me, 6) * y) +
				(getArray(me, 10) * z) +
				getArray(me, 14)) * iw,
		);
	}

	applyQuaternion(q: Quaternion): this {
		const { x, y, z } = this;
		const { x: qx, y: qy, z: qz, w: qw } = q;

		const ix = (q.w * x) + (q.y * z) - (q.z * y);
		const iy = (qw * y) + (qz * x) - (qx * z);
		const iz = (qw * z) + (qx * y) - (qy * x);
		const iw = (-qx * x) - (qy * y) - (qz * z);

		return this.set(
			(ix * qw) + (iw * -qx) + (iy * -qz) - (iz * -qy),
			(iy * qw) + (iw * -qy) + (iz * -qx) - (ix * -qz),
			(iz * qw) + (iw * -qz) + (ix * -qy) - (iy * -qx),
		);
	}

	clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	copy(v: Vector3): this {
		return this.set(v.x, v.y, v.z);
	}

	cross(v: Vector3): this {
		return this.crossVectors(this, v);
	}

	crossVectors(a: Vector3, b: Vector3): this {
		const { x: ax, y: ay, z: az } = a;
		const { x: bx, y: by, z: bz } = b;

		return this.set(
			(ay * bz) - (az * by),
			(az * bx) - (ax * bz),
			(ax * by) - (ay * bx),
		);
	}

	divScalar(scalar: number): this {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
		return this;
	}

	mulScalar(scalar: number): this {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}

	set(x: number, y: number, z?: number): this {
		const _z = this.z;
		this.x = x;
		this.y = y;
		this.z = z !== undefined ? z : _z;
		return this;
	}

	sub(v: Vector3): this {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	subVectors(a: Vector3, b: Vector3): this {
		return this.set(a.x - b.x, a.y - b.y, a.z - b.z);
	}

	unitize(): this {
		return this.divScalar(this.length || 1);
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
		yield this.z;
	}
}
