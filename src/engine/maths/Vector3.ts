import type {
	Cloneable,
	Copyable,
	Equatable,
	Serializable,
} from "../types/interfaces.ts";
import { MathUtils } from "./MathUtils.ts";

// Forward declarations - will be implemented later
type Euler = object;
type Matrix4 = object;
type Quaternion = object;
type Camera = object;

export class Vector3
	implements
		Cloneable<Vector3>,
		Copyable<Vector3>,
		Equatable<Vector3>,
		Serializable {
	readonly isVector3 = true;

	get length(): number {
		return Math.sqrt(this.lengthSq);
	}

	get lengthSq(): number {
		const { x, y, z } = this;
		return (x * x) + (y * y) + (z * z);
	}

	get unitized(): Vector3 {
		return this.length === 0 ? this : this.divScalar(this.length);
	}

	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0,
	) {}

	add(v: Vector3): this {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	addScalar(scalar: number): this {
		this.x += scalar;
		this.y += scalar;
		this.z += scalar;
		return this;
	}

	addVectors(a: Vector3, b: Vector3): this {
		return this.set(a.x + b.x, a.y + b.y, a.z + b.z);
	}

	angle(a: Vector3, b: Vector3): number {
		return Math.acos(a.dot(b) / (a.length * b.length));
	}

	angleTo(v: Vector3): number {
		const denom = Math.sqrt(this.lengthSq * v.lengthSq);
		if (denom === 0) return MathUtils.TAU;

		const theta = this.dot(v) / denom;
		return Math.acos(MathUtils.clamp(theta, -1, 1));
	}

	applyEuler(_euler: Euler): this {
		// This will be implemented when Quaternion is available
		// const q = new Quaternion().setFromEuler(euler);
		// return this.applyQuaternion(q);
		return this;
	}

	applyMatrix4(_m: Matrix4): this {
		// This will be implemented when Matrix4 is available
		// const me = m.elements;
		// const w = (me[3] * this.x) + (me[7] * this.y) + (me[11] * this.z) + me[15];
		// const iw = w !== 0 ? 1 / w : 1;
		// return this.set(
		//     ((me[0] * this.x) + (me[4] * this.y) + (me[8] * this.z) + me[12]) * iw,
		//     ((me[1] * this.x) + (me[5] * this.y) + (me[9] * this.z) + me[13]) * iw,
		//     ((me[2] * this.x) + (me[6] * this.y) + (me[10] * this.z) + me[14]) * iw
		// );
		return this;
	}

	applyQuaternion(_q: Quaternion): this {
		// This will be implemented when Quaternion is available
		// const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
		// const ix = (qw * this.x) + (qy * this.z) - (qz * this.y);
		// const iy = (qw * this.y) + (qz * this.x) - (qx * this.z);
		// const iz = (qw * this.z) + (qx * this.y) - (qy * this.x);
		// const iw = (-qx * this.x) - (qy * this.y) - (qz * this.z);
		// return this.set(
		//     (ix * qw) + (iw * -qx) + (iy * -qz) - (iz * -qy),
		//     (iy * qw) + (iw * -qy) + (iz * -qx) - (ix * -qz),
		//     (iz * qw) + (iw * -qz) + (ix * -qy) - (iy * -qx)
		// );
		return this;
	}

	ceil(): this {
		return this.set(
			Math.ceil(this.x),
			Math.ceil(this.y),
			Math.ceil(this.z),
		);
	}

	clamp(min: Vector3, max: Vector3): this {
		return this.max(min).min(max);
	}

	clampScalar(min: number, max: number): this {
		return this.set(
			MathUtils.clamp(this.x, min, max),
			MathUtils.clamp(this.y, min, max),
			MathUtils.clamp(this.z, min, max),
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

	distanceTo(v: Vector3): number {
		return Math.sqrt(this.distanceSqTo(v));
	}

	distanceSqTo(v: Vector3): number {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		const dz = this.z - v.z;
		return (dx * dx) + (dy * dy) + (dz * dz);
	}

	div(v: Vector3): this {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		return this;
	}

	divScalar(scalar: number): this {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
		return this;
	}

	divVectors(a: Vector3, b: Vector3): this {
		return this.set(a.x / b.x, a.y / b.y, a.z / b.z);
	}

	dot(v: Vector3): number {
		return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
	}

	equals(v: Vector3): boolean {
		return (
			(this.x === v.x) &&
			(this.y === v.y) &&
			(this.z === v.z)
		);
	}

	floor(): this {
		return this.set(
			Math.floor(this.x),
			Math.floor(this.y),
			Math.floor(this.z),
		);
	}

	fromArray(array: number[], offset = 0): this {
		return this.set(
			array[offset] ?? 0,
			array[offset + 1] ?? 0,
			array[offset + 2] ?? 0,
		);
	}

	lerp(v: Vector3, alpha: number): this {
		const { x, y, z } = this;
		this.x += (v.x - x) * alpha;
		this.y += (v.y - y) * alpha;
		this.z += (v.z - z) * alpha;
		return this;
	}

	lerpVectors(a: Vector3, b: Vector3, alpha: number): this {
		const { x: ax, y: ay, z: az } = a;
		return this.set(
			ax + (b.x - ax) * alpha,
			ay + (b.y - ay) * alpha,
			az + (b.z - az) * alpha,
		);
	}

	max(v: Vector3): this {
		return this.set(
			Math.max(this.x, v.x),
			Math.max(this.y, v.y),
			Math.max(this.z, v.z),
		);
	}

	min(v: Vector3): this {
		return this.set(
			Math.min(this.x, v.x),
			Math.min(this.y, v.y),
			Math.min(this.z, v.z),
		);
	}

	mul(v: Vector3): this {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	}

	mulScalar(scalar: number): this {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}

	mulVectors(a: Vector3, b: Vector3): this {
		return this.set(
			a.x * b.x,
			a.y * b.y,
			a.z * b.z,
		);
	}

	negate(): this {
		return this.set(-this.x, -this.y, -this.z);
	}

	project(_camera: Camera): this {
		// This will be implemented when Camera is available
		// return this
		//     .applyMatrix4(camera.matrixWorldInverse)
		//     .applyMatrix4(camera.projectionMatrix);
		return this;
	}

	projectOnto(v: Vector3): this {
		const denom = v.lengthSq;
		if (denom === 0) return this.set(0, 0, 0);

		const scalar = v.dot(this) / denom;
		return this.copy(v).mulScalar(scalar);
	}

	reflect(normal: Vector3): this {
		return this.sub(normal.clone().mulScalar(2 * this.dot(normal)));
	}

	set(x: number, y: number, z?: number): this {
		const _z = this.z;
		this.x = x;
		this.y = y;
		this.z = z !== undefined ? z : _z;
		return this;
	}

	setFromArray(array: number[], offset = 0): this {
		return this.fromArray(array, offset);
	}

	setScalar(scalar: number): this {
		return this.set(scalar, scalar, scalar);
	}

	sub(v: Vector3): this {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	subScalar(scalar: number): this {
		this.x -= scalar;
		this.y -= scalar;
		this.z -= scalar;
		return this;
	}

	subVectors(a: Vector3, b: Vector3): this {
		return this.set(a.x - b.x, a.y - b.y, a.z - b.z);
	}

	toArray(array: number[] = [], offset = 0): number[] {
		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;
		return array;
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
		yield this.z;
	}
}
