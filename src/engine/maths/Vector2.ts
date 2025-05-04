import type {
	Cloneable,
	Copyable,
	Equatable,
	Serializable,
} from "../types/interfaces.ts";
import { MathUtils } from "./MathUtils.ts";

export class Vector2
	implements
		Cloneable<Vector2>,
		Copyable<Vector2>,
		Equatable<Vector2>,
		Iterable<number>,
		Serializable {
	readonly isVector2 = true;

	constructor(public x = 0, public y = 0) {}

	get length(): number {
		return Math.sqrt(this.lengthSq);
	}

	get lengthSq(): number {
		const { x, y } = this;
		return (x * x) + (y * y);
	}

	get unitized(): Vector2 {
		return this.clone().unitize();
	}

	add(v: Vector2): this {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	addScalar(scalar: number): this {
		this.x += scalar;
		this.y += scalar;
		return this;
	}

	addVectors(a: Vector2, b: Vector2): this {
		return this.set(a.x + b.x, a.y + b.y);
	}

	angle(): number {
		return Math.atan2(-this.y, -this.x) + Math.PI;
	}

	angleTo(v: Vector2): number {
		const denom = Math.sqrt(this.lengthSq * v.lengthSq);
		if (denom === 0) return MathUtils.TAU;

		const theta = this.dot(v) / denom;
		return Math.acos(MathUtils.clamp(theta, -1, 1));
	}

	ceil(): this {
		return this.set(
			Math.ceil(this.x),
			Math.ceil(this.y),
		);
	}

	clamp(min: Vector2, max: Vector2): this {
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
		);
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	copy(v: Vector2): this {
		return this.set(v.x, v.y);
	}

	cross(v: Vector2): number {
		return (this.x * v.y) - (this.y * v.x);
	}

	distanceTo(v: Vector2): number {
		return Math.sqrt(this.distanceSqTo(v));
	}

	distanceSqTo(v: Vector2): number {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		return (dx * dx) + (dy * dy);
	}

	div(v: Vector2): this {
		this.x /= v.x;
		this.y /= v.y;
		return this;
	}

	divScalar(scalar: number): this {
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}

	divVectors(a: Vector2, b: Vector2): this {
		return this.set(a.x / b.x, a.y / b.y);
	}

	dot(v: Vector2): number {
		return (this.x * v.x) + (this.y * v.y);
	}

	equals(v: Vector2): boolean {
		return (this.x === v.x) && (this.y === v.y);
	}

	floor(): this {
		return this.set(
			Math.floor(this.x),
			Math.floor(this.y),
		);
	}

	fromArray(array: number[], offset = 0): this {
		return this.set(
			array[offset] ?? 0,
			array[offset + 1] ?? 0,
		);
	}

	lerp(v: Vector2, alpha: number): this {
		const { x, y } = this;
		this.x += (v.x - x) * alpha;
		this.y += (v.y - y) * alpha;
		return this;
	}

	lerpVectors(a: Vector2, b: Vector2, alpha: number): this {
		const { x: ax, y: ay } = a;
		return this.set(
			ax + (b.x - ax) * alpha,
			ay + (b.y - ay) * alpha,
		);
	}

	max(v: Vector2): this {
		return this.set(
			Math.max(this.x, v.x),
			Math.max(this.y, v.y),
		);
	}

	min(v: Vector2): this {
		return this.set(
			Math.min(this.x, v.x),
			Math.min(this.y, v.y),
		);
	}

	mul(v: Vector2): this {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}

	mulScalar(scalar: number): this {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	mulVectors(a: Vector2, b: Vector2): this {
		return this.set(a.x * b.x, a.y * b.y);
	}

	negate(): this {
		return this.set(-this.x, -this.y);
	}

	/**
	 * @param angle - in radians
	 */
	rotate(angle: number): this {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const { x, y } = this;

		return this.set(
			(x * cos) - (y * sin),
			(x * sin) + (y * cos),
		);
	}

	round(): this {
		return this.set(
			Math.round(this.x),
			Math.round(this.y),
		);
	}

	set(x: number, y: number): this {
		this.x = x;
		this.y = y;
		return this;
	}

	/**
	 * @param angle - in radians
	 */
	setFromPolar(radius: number, angle: number): this {
		return this.set(
			radius * Math.cos(angle),
			radius * Math.sin(angle),
		);
	}

	setScalar(scalar: number): this {
		return this.set(scalar, scalar);
	}

	sub(v: Vector2): this {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	subScalar(scalar: number): this {
		this.x -= scalar;
		this.y -= scalar;
		return this;
	}

	subVectors(a: Vector2, b: Vector2): this {
		return this.set(a.x - b.x, a.y - b.y);
	}

	toArray(array: number[] = [], offset = 0): number[] {
		array[offset] = this.x;
		array[offset + 1] = this.y;
		return array;
	}

	unitize(): this {
		return this.divScalar(this.length || 1);
	}

	*[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
	}
}
