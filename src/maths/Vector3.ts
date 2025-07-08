import type { Camera } from "../cameras/Camera";

import type { Euler } from "./Euler";
import type { Matrix3 } from "./Matrix3";
import type { Matrix4 } from "./Matrix4";
import { Quaternion } from "./Quaternion";

const _q = new Quaternion();

export class Vector3 {
	#x = 0;
	#y = 0;
	#z = 0;

	constructor(x = 0, y = 0, z = 0) {
		this.#x = x;
		this.#y = y;
		this.#z = z;
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

	get length(): number {
		return Math.sqrt(this.lengthSq);
	}

	get lengthSq(): number {
		const { x, y, z } = this;
		return x * x + y * y + z * z;
	}

	add(v: this): this {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	applyEuler(euler: Euler): this {
		_q.setFromEuler(euler);
		return this.applyQuaternion(_q);
	}

	applyMatrix3(m: Matrix3): this {
		const { x, y, z } = this;
		const me = m.elements;

		this.x =
			(me[0] as number) * x + (me[3] as number) * y + (me[6] as number) * z;
		this.y =
			(me[1] as number) * x + (me[4] as number) * y + (me[7] as number) * z;
		this.z =
			(me[2] as number) * x + (me[5] as number) * y + (me[8] as number) * z;
		return this;
	}

	applyMatrix4(m: Matrix4): this {
		const { x, y, z } = this;
		const me = m.elements;

		const denom =
			(me[3] as number) * x +
			(me[7] as number) * y +
			(me[11] as number) * z +
			(me[15] as number);
		const w = denom !== 0 ? 1 / denom : 1;

		this.x =
			(me[0] as number) * x +
			(me[4] as number) * y +
			(me[8] as number) * z +
			(me[12] as number) * w;
		this.y =
			(me[1] as number) * x +
			(me[5] as number) * y +
			(me[9] as number) * z +
			(me[13] as number) * w;
		this.z =
			(me[2] as number) * x +
			(me[6] as number) * y +
			(me[10] as number) * z +
			(me[14] as number) * w;
		return this;
	}

	applyQuaternion(q: Quaternion): this {
		const { x, y, z } = this;
		const { x: qx, y: qy, z: qz, w: qw } = q;

		const ix = q.w * x + q.y * z - q.z * y;
		const iy = qw * y + qz * x - qx * z;
		const iz = qw * z + qx * y - qy * x;
		const iw = -qx * x - qy * y - qz * z;

		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
		return this;
	}

	clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	copy(v: this): this {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}

	cross(v: this): this {
		return this.crossVectors(this, v);
	}

	crossVectors(a: this, b: this): this {
		const { x: ax, y: ay, z: az } = a;
		const { x: bx, y: by, z: bz } = b;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;
		return this;
	}

	distanceTo(v: this): number {
		return Math.sqrt(this.distanceSqTo(v));
	}

	distanceSqTo(v: this): number {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		const dz = this.z - v.z;
		return dx * dx + dy * dy + dz * dz;
	}

	divScalar(scalar: number): this {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
		return this;
	}

	dot(v: this): number {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	equals(v: this): boolean {
		return this.x === v.x && this.y === v.y && this.z === v.z;
	}

	fromArray(array: number[]): this {
		this.x = array[0] as number;
		this.y = array[1] as number;
		this.z = array[2] as number;
		return this;
	}

	lerp(v: this, t: number): this {
		const { x, y, z } = this;

		this.x = x + (v.x - x) * t;
		this.y = y + (v.y - y) * t;
		this.z = z + (v.z - z) * t;
		return this;
	}

	mulScalar(scalar: number): this {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}

	negate(): this {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		return this;
	}

	project(camera: Camera): this {
		return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(
			camera.projectionMatrix,
		);
	}

	set(x: number, y: number, z: number): this {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	setFromMatrixPosition(m: Matrix4): this {
		const me = m.elements;

		this.x = me[12] as number;
		this.y = me[13] as number;
		this.z = me[14] as number;
		return this;
	}

	setScalar(scalar: number): this {
		this.x = scalar;
		this.y = scalar;
		this.z = scalar;
		return this;
	}

	sub(v: this): this {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	subVectors(a: this, b: this): this {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		return this;
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
