import { fromArray } from "../utils.ts";
import { MathUtils } from "./MathUtils.ts";
import { Matrix4 } from "./Matrix4.ts";
import { Quaternion } from "./Quaternion.ts";

export type EulerOrder = "XYZ" | "YXZ" | "ZXY" | "ZYX" | "YZX" | "XZY";

export class Euler {
	static readonly #GIMBAL_LOCK_THRESHOLD: number = 0.9999999;

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

		const m11 = fromArray(te, 0);
		const m12 = fromArray(te, 4);
		const m13 = fromArray(te, 8);
		const m21 = fromArray(te, 1);
		const m22 = fromArray(te, 5);
		const m23 = fromArray(te, 9);
		const m31 = fromArray(te, 2);
		const m32 = fromArray(te, 6);
		const m33 = fromArray(te, 10);

		const currentOrder = order || this.order;
		const isGimbalLock = (value: number) =>
			Math.abs(value) >= Euler.#GIMBAL_LOCK_THRESHOLD;

		switch (currentOrder) {
			case "XYZ":
				this.y = MathUtils.safeAsin(m13);
				if (isGimbalLock(m13)) {
					this.x = Math.atan2(m32, m22);
					this.z = this.z === 0 ? Math.atan2(-m12, m11) : this.z;
				} else {
					this.x = Math.atan2(-m23, m33);
					this.z = Math.atan2(-m12, m11);
				}
				break;
			case "YXZ":
				this.x = MathUtils.safeAsin(-m23);
				if (isGimbalLock(m23)) {
					this.y = Math.atan2(-m31, m11);
					this.z = this.z === 0 ? Math.atan2(m21, m22) : this.z;
				} else {
					this.y = Math.atan2(m13, m33);
					this.z = Math.atan2(m21, m22);
				}
				break;
			case "ZXY":
				this.x = MathUtils.safeAsin(m32);
				if (isGimbalLock(m32)) {
					this.z = Math.atan2(m21, m11);
					this.y = this.y === 0 ? Math.atan2(-m31, m33) : this.y;
				} else {
					this.y = Math.atan2(-m31, m33);
					this.z = Math.atan2(-m12, m22);
				}
				break;
			case "ZYX":
				this.y = MathUtils.safeAsin(-m31);
				if (isGimbalLock(m31)) {
					this.z = Math.atan2(-m12, m22);
					this.x = this.x === 0 ? Math.atan2(m32, m33) : this.x;
				} else {
					this.x = Math.atan2(m32, m33);
					this.z = Math.atan2(m21, m11);
				}
				break;
			case "YZX":
				this.z = MathUtils.safeAsin(m21);
				if (isGimbalLock(m21)) {
					this.y = Math.atan2(m13, m33);
					this.x = this.x === 0 ? Math.atan2(-m23, m22) : this.x;
				} else {
					this.x = Math.atan2(-m23, m22);
					this.y = Math.atan2(-m31, m11);
				}
				break;
			case "XZY":
				this.z = MathUtils.safeAsin(-m12);
				if (isGimbalLock(m12)) {
					this.x = Math.atan2(m32, m22);
					this.y = this.y === 0 ? Math.atan2(m13, m11) : this.y;
				} else {
					this.x = Math.atan2(m32, m22);
					this.y = Math.atan2(m13, m11);
				}
				break;
		}
		this.order = currentOrder;
		return this;
	}
}
