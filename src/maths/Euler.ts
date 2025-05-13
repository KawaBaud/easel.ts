import { Matrix4 } from "./Matrix4.ts";
import { Quaternion } from "./Quaternion.ts";

const _m = new Matrix4();

export type EulerOrder = "XYZ" | "YXZ" | "ZXY" | "ZYX" | "YZX" | "XZY";

export class Euler {
	static readonly #GIMBAL_LOCK_THRESHOLD: number = 0.9999999;

	#x = 0;
	#y = 0;
	#z = 0;
	#order: EulerOrder = "XYZ";
	#onChangeCallback: (() => void) | null = null;

	constructor(
		x = 0,
		y = 0,
		z = 0,
		order: EulerOrder = "XYZ",
	) {
		this.#x = x;
		this.#y = y;
		this.#z = z;
		this.#order = order;
	}

	get x(): number {
		return this.#x;
	}

	set x(value: number) {
		this.#x = value;
		this.#onChange();
	}

	get y(): number {
		return this.#y;
	}

	set y(value: number) {
		this.#y = value;
		this.#onChange();
	}

	get z(): number {
		return this.#z;
	}

	set z(value: number) {
		this.#z = value;
		this.#onChange();
	}

	get order(): EulerOrder {
		return this.#order;
	}

	set order(value: EulerOrder) {
		this.#order = value;
		this.#onChange();
	}

	#onChange(): void {
		if (this.#onChangeCallback) this.#onChangeCallback();
	}

	clone(): Euler {
		return new Euler(this.x, this.y, this.z, this.order);
	}

	copy(euler: Euler): this {
		this.x = euler.x;
		this.y = euler.y;
		this.z = euler.z;
		this.order = euler.order;
		this.#onChange();
		return this;
	}

	fromArray(array: [number, number, number, EulerOrder?]): this {
		this.x = array[0];
		this.y = array[1];
		this.z = array[2];
		this.order = array[3] ?? this.order;
		this.#onChange();
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
		this.#onChange();
		return this;
	}

	setFromQuaternion(q: Quaternion, order?: EulerOrder): this {
		_m.makeRotationFromQuaternion(q);
		return this.setFromRotationMatrix(_m, order);
	}

	setFromRotationMatrix(m: Matrix4, order?: EulerOrder): this {
		const te = m.elements;

		const m11 = te.safeAt(0), m12 = te.safeAt(4), m13 = te.safeAt(8);
		const m21 = te.safeAt(1), m22 = te.safeAt(5), m23 = te.safeAt(9);
		const m31 = te.safeAt(2), m32 = te.safeAt(6), m33 = te.safeAt(10);

		const currentOrder = order || this.order;

		const isGimbalLock = (value: number) =>
			Math.abs(value) >= Euler.#GIMBAL_LOCK_THRESHOLD;

		switch (currentOrder) {
			case "XYZ":
				this.y = Math.safeAsin(m13);
				if (isGimbalLock(m13)) {
					this.x = Math.atan2(m32, m22);
					this.z = this.z === 0 ? Math.atan2(-m12, m11) : this.z;
				} else {
					this.x = Math.atan2(-m23, m33);
					this.z = Math.atan2(-m12, m11);
				}
				break;
			case "YXZ":
				this.x = Math.safeAsin(-m23);
				if (isGimbalLock(m23)) {
					this.y = Math.atan2(-m31, m11);
					this.z = this.z === 0 ? Math.atan2(m21, m22) : this.z;
				} else {
					this.y = Math.atan2(m13, m33);
					this.z = Math.atan2(m21, m22);
				}
				break;
			case "ZXY":
				this.x = Math.safeAsin(m32);
				if (isGimbalLock(m32)) {
					this.z = Math.atan2(m21, m11);
					this.y = this.y === 0 ? Math.atan2(-m31, m33) : this.y;
				} else {
					this.y = Math.atan2(-m31, m33);
					this.z = Math.atan2(-m12, m22);
				}
				break;
			case "ZYX":
				this.y = Math.safeAsin(-m31);
				if (isGimbalLock(m31)) {
					this.z = Math.atan2(-m12, m22);
					this.x = this.x === 0 ? Math.atan2(m32, m33) : this.x;
				} else {
					this.x = Math.atan2(m32, m33);
					this.z = Math.atan2(m21, m11);
				}
				break;
			case "YZX":
				this.z = Math.safeAsin(m21);
				if (isGimbalLock(m21)) {
					this.y = Math.atan2(m13, m33);
					this.x = this.x === 0 ? Math.atan2(-m23, m22) : this.x;
				} else {
					this.x = Math.atan2(-m23, m22);
					this.y = Math.atan2(-m31, m11);
				}
				break;
			case "XZY":
				this.z = Math.safeAsin(-m12);
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
		this.#onChange();
		return this;
	}

	setOnChangeCallback(callback: () => void): this {
		this.#onChangeCallback = callback;
		return this;
	}
}
