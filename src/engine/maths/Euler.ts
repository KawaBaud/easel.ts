import type {
	Cloneable,
	Copyable,
	Equatable,
	Serializable,
} from "../types/interfaces.ts";
import { get } from "../utils.ts";
import { MathUtils } from "./MathUtils.ts";
import { Matrix4 } from "./Matrix4.ts";
import { Quaternion } from "./Quaternion.ts";
import type { Vector3 } from "./Vector3.ts";

export type EulerOrder = "XYZ" | "YXZ" | "ZXY" | "ZYX" | "YZX" | "XZY";

function getEulerOrderValue(order: EulerOrder): number {
	return ["XYZ", "YXZ", "ZXY", "ZYX", "YZX", "XZY"].indexOf(order);
}

export class Euler
	implements Cloneable<Euler>, Copyable<Euler>, Equatable<Euler>, Serializable {
	static readonly GIMBAL_LOCK_THRESHOLD = 0.9999999;

	readonly isEuler = true;

	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
		public order: EulerOrder = "XYZ",
	) {}

	clone(): Euler {
		return new Euler(this.x, this.y, this.z, this.order);
	}

	copy(euler: Euler): this {
		return this.set(euler.x, euler.y, euler.z, euler.order);
	}

	equals(euler: Euler): boolean {
		return (
			(euler.x === this.x) &&
			(euler.y === this.y) &&
			(euler.z === this.z) &&
			(euler.order === this.order)
		);
	}

	fromArray(array: number[], offset = 0): this {
		this.x = get(array, offset);
		this.y = get(array, offset + 1);
		this.z = get(array, offset + 2);
		if (array[offset + 3] !== undefined) {
			const orderValue = get(array, offset + 3);
			this.order = [
				"XYZ",
				"YXZ",
				"ZXY",
				"ZYX",
				"YZX",
				"XZY",
			][orderValue] as EulerOrder;
		}
		return this;
	}

	reorder(newOrder: EulerOrder): this {
		const q = new Quaternion().setFromEuler(this);
		return this.setFromQuaternion(q, newOrder);
	}

	set(x: number, y: number, z: number, order?: EulerOrder): this {
		this.x = x;
		this.y = y;
		this.z = z;
		if (order !== undefined) this.order = order;
		return this;
	}

	setFromQuaternion(q: Quaternion, order?: EulerOrder): this {
		const m = new Matrix4().makeRotationFromQuaternion(q);
		return this.setFromRotationMatrix(m, order);
	}

	setFromRotationMatrix(m: Matrix4, order?: EulerOrder): this {
		const te = m.elements;

		const m11 = get(te, 0);
		const m12 = get(te, 4);
		const m13 = get(te, 8);
		const m21 = get(te, 1);
		const m22 = get(te, 5);
		const m23 = get(te, 9);
		const m31 = get(te, 2);
		const m32 = get(te, 6);
		const m33 = get(te, 10);

		const currentOrder = order || this.order;
		switch (currentOrder) {
			case "XYZ":
				this.y = MathUtils.safeAsin(m13);
				this.#isGimbalLock(m13)
					? (this.x = Math.atan2(-m23, m33), this.z = Math.atan2(-m12, m11))
					: (this.x = Math.atan2(m32, m22), this.z = 0);
				break;
			case "YXZ":
				this.x = MathUtils.safeAsin(-m23);
				this.#isGimbalLock(m23)
					? (this.y = Math.atan2(m13, m33), this.z = Math.atan2(m21, m22))
					: (this.y = Math.atan2(-m31, m11), this.z = 0);
				break;
			case "ZXY":
				this.x = MathUtils.safeAsin(m32);
				this.#isGimbalLock(m32)
					? (this.y = Math.atan2(-m31, m33), this.z = Math.atan2(-m12, m22))
					: (this.y = 0, this.z = Math.atan2(m21, m11));
				break;
			case "ZYX":
				this.y = MathUtils.safeAsin(-m31);
				this.#isGimbalLock(m31)
					? (this.x = Math.atan2(m32, m33), this.z = Math.atan2(m21, m11))
					: (this.x = 0, this.z = Math.atan2(-m12, m22));
				break;
			case "YZX":
				this.z = MathUtils.safeAsin(m21);
				this.#isGimbalLock(m21)
					? (this.x = Math.atan2(-m23, m22), this.y = Math.atan2(-m31, m11))
					: (this.x = 0, this.y = Math.atan2(m13, m33));
				break;
			case "XZY":
				this.z = MathUtils.safeAsin(-m12);
				this.#isGimbalLock(m12)
					? (this.x = Math.atan2(m32, m22), this.y = Math.atan2(m13, m11))
					: (this.x = Math.atan2(-m23, m33), this.y = 0);
				break;
		}
		this.order = currentOrder;
		return this;
	}

	setFromVector3(v: Vector3, order?: EulerOrder): this {
		return this.set(v.x, v.y, v.z, order);
	}

	toArray(array: number[] = [], offset = 0): number[] {
		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;
		array[offset + 3] = getEulerOrderValue(this.order);
		return array;
	}

	toVector3(v: Vector3): Vector3 {
		return v.set(this.x, this.y, this.z);
	}

	#isGimbalLock(value: number): boolean {
		return Math.abs(value) < Euler.GIMBAL_LOCK_THRESHOLD;
	}
}
