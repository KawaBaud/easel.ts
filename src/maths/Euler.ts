import { fromArray } from "../utils.ts";
import { MathUtils } from "./MathUtils.ts";
import { Matrix4 } from "./Matrix4.ts";
import type { Quaternion } from "./Quaternion.ts";

export type EulerOrder = "XYZ" | "YXZ" | "ZXY" | "ZYX" | "YZX" | "XZY";

export class Euler {
	static readonly GIMBAL_LOCK_THRESHOLD: number = 0.9999999;

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

	#isGimbalLock(value: number): boolean {
		return Math.abs(value) < Euler.GIMBAL_LOCK_THRESHOLD;
	}
}
