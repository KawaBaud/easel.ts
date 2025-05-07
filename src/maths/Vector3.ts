import type { Camera } from "../cameras/Camera.ts";
import "../types.ts";
import type { Euler } from "./Euler.ts";
import type { Matrix4 } from "./Matrix4.ts";
import { Quaternion } from "./Quaternion.ts";

export class Vector3 {
	static UP = new Vector3(0, 1, 0);

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

		const denom = (me.safeAt(3) * x) + (me.safeAt(7) * y) +
			(me.safeAt(11) * z) + me.safeAt(15);
		const w = denom !== 0 ? 1 / denom : 1;

		const nx = ((me.safeAt(0) * x) + (me.safeAt(4) * y) + (me.safeAt(8) * z) +
			me.safeAt(12)) * w;
		const ny = ((me.safeAt(1) * x) + (me.safeAt(5) * y) + (me.safeAt(9) * z) +
			me.safeAt(13)) * w;
		const nz = ((me.safeAt(2) * x) + (me.safeAt(6) * y) + (me.safeAt(10) * z) +
			me.safeAt(14)) * w;

		this.x = nx;
		this.y = ny;
		this.z = nz;
		return this;
	}

	applyQuaternion(q: Quaternion): this {
		const { x, y, z } = this;
		const { x: qx, y: qy, z: qz, w: qw } = q;

		const ix = (q.w * x) + (q.y * z) - (q.z * y);
		const iy = (qw * y) + (qz * x) - (qx * z);
		const iz = (qw * z) + (qx * y) - (qy * x);
		const iw = (-qx * x) - (qy * y) - (qz * z);

		this.x = (ix * qw) + (iw * -qx) + (iy * -qz) - (iz * -qy);
		this.y = (iy * qw) + (iw * -qy) + (iz * -qx) - (ix * -qz);
		this.z = (iz * qw) + (iw * -qz) + (ix * -qy) - (iy * -qx);
		return this;
	}

	clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	copy(v: Vector3): this {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}

	cross(v: Vector3): this {
		return this.crossVectors(this, v);
	}

	crossVectors(a: Vector3, b: Vector3): this {
		const { x: ax, y: ay, z: az } = a;
		const { x: bx, y: by, z: bz } = b;

		this.x = (ay * bz) - (az * by);
		this.y = (az * bx) - (ax * bz);
		this.z = (ax * by) - (ay * bx);
		return this;
	}

	divScalar(scalar: number): this {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
		return this;
	}

	fromArray(array: number[]): this {
		this.x = array.safeAt(0);
		this.y = array.safeAt(1);
		this.z = array.safeAt(2);
		return this;
	}

	mulScalar(scalar: number): this {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}

	project(
		camera: Camera,
	): this {
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

		this.x = me.safeAt(12);
		this.y = me.safeAt(13);
		this.z = me.safeAt(14);
		return this;
	}

	sub(v: Vector3): this {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	subVectors(a: Vector3, b: Vector3): this {
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
