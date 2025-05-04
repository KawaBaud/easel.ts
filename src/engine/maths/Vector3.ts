import type { Camera } from "../cameras/Camera.ts";
import type {
	Cloneable,
	Copyable,
	Equatable,
	Serializable,
} from "../types/interfaces.ts";
import { get } from "../utils.ts";
import type { Euler } from "./Euler.ts";
import { MathUtils } from "./MathUtils.ts";
import type { Matrix4 } from "./Matrix4.ts";
import { Quaternion } from "./Quaternion.ts";

export class Vector3
	implements
		Cloneable<Vector3>,
		Copyable<Vector3>,
		Equatable<Vector3>,
		Iterable<number>,
		Serializable {
	readonly isVector3: boolean = true;

	constructor(public x = 0, public y = 0, public z = 0) {}

	get length(): number {
		return Math.sqrt(this.lengthSq);
	}

	get lengthSq(): number {
		const { x, y, z } = this;
		return (x * x) + (y * y) + (z * z);
	}

	get unitized(): Vector3 {
		return this.clone().unitize();
	}

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

	applyEuler(euler: Euler): this {
		const q = new Quaternion().setFromEuler(euler);
		return this.applyQuaternion(q);
	}

	applyMatrix4(m: Matrix4): this {
		const { x, y, z } = this;
		const me = m.elements;

		const w = (get(me, 3) * x) + (get(me, 7) * y) +
			(get(me, 11) * z) + get(me, 15);
		const iw = w !== 0 ? 1 / w : 1;

		return this.set(
			((get(me, 0) * x) + (get(me, 4) * y) + (get(me, 8) * z) +
				get(me, 12)) * iw,
			((get(me, 1) * x) + (get(me, 5) * y) + (get(me, 9) * z) +
				get(me, 13)) * iw,
			((get(me, 2) * x) + (get(me, 6) * y) + (get(me, 10) * z) +
				get(me, 14)) * iw,
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

	clampLength(min: number, max: number): this {
		const length = this.length;
		if (length === 0) return this;

		return this.divScalar(length).mulScalar(
			MathUtils.clamp(length, min, max),
		);
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
			get(array, offset),
			get(array, offset + 1),
			get(array, offset + 2),
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

	project(camera: Camera): this {
		return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(
			camera.projectionMatrix,
		);
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

	round(): this {
		return this.set(
			Math.round(this.x),
			Math.round(this.y),
			Math.round(this.z),
		);
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

	unitize(): this {
		return this.divScalar(this.length || 1);
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
		yield this.z;
	}
}
