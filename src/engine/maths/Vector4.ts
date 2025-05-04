import type {
	Cloneable,
	Copyable,
	Equatable,
	Serializable,
} from "../types/interfaces.ts";
import { get } from "../utils.ts";
import { MathUtils } from "./MathUtils.ts";

export class Vector4
	implements
		Cloneable<Vector4>,
		Copyable<Vector4>,
		Equatable<Vector4>,
		Iterable<number>,
		Serializable {
	readonly isVector4: boolean = true;

	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
		public w = 0,
	) {}

	get length(): number {
		return Math.sqrt(this.lengthSq);
	}

	get lengthSq(): number {
		const { x, y, z, w } = this;
		return (x * x) + (y * y) + (z * z) + (w * w);
	}

	get unitized(): Vector4 {
		return this.clone().unitize();
	}

	add(v: Vector4): this {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;
		return this;
	}

	addScalar(scalar: number): this {
		this.x += scalar;
		this.y += scalar;
		this.z += scalar;
		this.w += scalar;
		return this;
	}

	addVectors(a: Vector4, b: Vector4): this {
		return this.set(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
	}

	angle(a: Vector4, b: Vector4): number {
		return Math.acos(a.dot(b) / (a.length * b.length));
	}

	angleTo(v: Vector4): number {
		const denom = Math.sqrt(this.lengthSq * v.lengthSq);
		if (denom === 0) return Math.PI;

		const theta = this.dot(v) / denom;
		return Math.acos(MathUtils.clamp(theta, -1, 1));
	}

	ceil(): this {
		return this.set(
			Math.ceil(this.x),
			Math.ceil(this.y),
			Math.ceil(this.z),
			Math.ceil(this.w),
		);
	}

	clamp(min: Vector4, max: Vector4): this {
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
			MathUtils.clamp(this.w, min, max),
		);
	}

	clone(): Vector4 {
		return new Vector4(this.x, this.y, this.z, this.w);
	}

	copy(v: Vector4): this {
		return this.set(v.x, v.y, v.z, v.w);
	}

	cross(v: Vector4): this {
		return this.crossVectors(this, v);
	}

	crossVectors(a: Vector4, b: Vector4): this {
		const { x: ax, y: ay, z: az, w: aw } = a;
		const { x: bx, y: by, z: bz, w: bw } = b;

		return this.set(
			(ay * bz) - (az * by),
			(az * bx) - (ax * bz),
			(ax * by) - (ay * bx),
			(ax * bw) - (aw * bx),
		);
	}

	distanceTo(v: Vector4): number {
		return Math.sqrt(this.distanceSqTo(v));
	}

	distanceSqTo(v: Vector4): number {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		const dz = this.z - v.z;
		const dw = this.w - v.w;
		return (dx * dx) + (dy * dy) + (dz * dz) + (dw * dw);
	}

	div(v: Vector4): this {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		this.w /= v.w;
		return this;
	}

	divScalar(scalar: number): this {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
		this.w /= scalar;
		return this;
	}

	divVectors(a: Vector4, b: Vector4): this {
		return this.set(a.x / b.x, a.y / b.y, a.z / b.z, a.w / b.w);
	}

	dot(v: Vector4): number {
		return (this.x * v.x) + (this.y * v.y) + (this.z * v.z) + (this.w * v.w);
	}

	equals(v: Vector4): boolean {
		return (
			(this.x === v.x) &&
			(this.y === v.y) &&
			(this.z === v.z) &&
			(this.w === v.w)
		);
	}

	floor(): this {
		return this.set(
			Math.floor(this.x),
			Math.floor(this.y),
			Math.floor(this.z),
			Math.floor(this.w),
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

	lerp(v: Vector4, alpha: number): this {
		const { x, y, z, w } = this;
		this.x += (v.x - x) * alpha;
		this.y += (v.y - y) * alpha;
		this.z += (v.z - z) * alpha;
		this.w += (v.w - w) * alpha;
		return this;
	}

	lerpVectors(a: Vector4, b: Vector4, alpha: number): this {
		const { x: ax, y: ay, z: az, w: aw } = a;
		return this.set(
			ax + (b.x - ax) * alpha,
			ay + (b.y - ay) * alpha,
			az + (b.z - az) * alpha,
			aw + (b.w - aw) * alpha,
		);
	}

	max(v: Vector4): this {
		return this.set(
			Math.max(this.x, v.x),
			Math.max(this.y, v.y),
			Math.max(this.z, v.z),
			Math.max(this.w, v.w),
		);
	}

	min(v: Vector4): this {
		return this.set(
			Math.min(this.x, v.x),
			Math.min(this.y, v.y),
			Math.min(this.z, v.z),
			Math.min(this.w, v.w),
		);
	}

	mul(v: Vector4): this {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		this.w *= v.w;
		return this;
	}

	mulScalar(scalar: number): this {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		this.w *= scalar;
		return this;
	}

	mulVectors(a: Vector4, b: Vector4): this {
		return this.set(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
	}

	negate(): this {
		return this.set(-this.x, -this.y, -this.z, -this.w);
	}

	round(): this {
		return this.set(
			Math.round(this.x),
			Math.round(this.y),
			Math.round(this.z),
			Math.round(this.w),
		);
	}

	set(x: number, y: number, z: number, w: number): this {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	setFromArray(array: number[], offset = 0): this {
		return this.fromArray(array, offset);
	}

	setScalar(scalar: number): this {
		return this.set(scalar, scalar, scalar, scalar);
	}

	sub(v: Vector4): this {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;
		return this;
	}

	subScalar(scalar: number): this {
		return this.addScalar(-scalar);
	}

	subVectors(a: Vector4, b: Vector4): this {
		return this.set(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
	}

	toArray(array: number[] = [], offset = 0): number[] {
		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;
		array[offset + 3] = this.w;
		return array;
	}

	unitize(): this {
		return this.divScalar(this.length);
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
		yield this.z;
		yield this.w;
	}
}
