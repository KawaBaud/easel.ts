import { MathUtils } from "./MathUtils";
import { Matrix4 } from "./Matrix4";
import { Quaternion } from "./Quaternion";

const _m = new Matrix4();

export type EulerOrder = "XYZ" | "YXZ" | "ZXY" | "ZYX" | "YZX" | "XZY";

export class Euler {
	static readonly #GIMBAL_LOCK_THRESHOLD: number = 0.9999999;

	#x = 0;
	#y = 0;
	#z = 0;
	#order: EulerOrder = "XYZ";
	#onChangeCallback: (() => void) | undefined = undefined;

	constructor(x = 0, y = 0, z = 0, order: EulerOrder = "XYZ") {
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
		if (this.#onChangeCallback) {
			this.#onChangeCallback();
		}
	}

	clone(): Euler {
		return new Euler(this.x, this.y, this.z, this.order);
	}

	copy(euler: this): this {
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
		if (order !== undefined) {
			this.order = order;
		}
		this.#onChange();
		return this;
	}

	setFromQuaternion(q: Quaternion, order?: EulerOrder): this {
		_m.makeRotationFromQuaternion(q);
		return this.setFromRotationMatrix(_m, order);
	}

	setFromRotationMatrix(m: Matrix4, order?: EulerOrder): this {
		const te = m.elements;
		const currentOrder = order || this.order;

		const [m11, m12, m13] = [te[0] as number, te[4] as number, te[8] as number];
		const [m21, m22, m23] = [te[1] as number, te[5] as number, te[9] as number];
		const [m31, m32, m33] = [
			te[2] as number,
			te[6] as number,
			te[10] as number,
		];

		this.#setFromRotationMatrixByOrder(
			currentOrder,
			m11,
			m12,
			m13,
			m21,
			m22,
			m23,
			m31,
			m32,
			m33,
		);

		this.order = currentOrder;
		this.#onChange();
		return this;
	}

	setOnChangeCallback(callback: () => void): this {
		this.#onChangeCallback = callback;
		return this;
	}

	#handleXyzOrder(
		m11: number,
		m12: number,
		m13: number,
		m22: number,
		m23: number,
		m32: number,
		m33: number,
		isGimbalLock: (v: number) => boolean,
	): void {
		this.y = MathUtils.safeAsin(m13);
		if (isGimbalLock(m13)) {
			this.x = MathUtils.fastAtan2(m32, m22);
			this.z = this.z === 0 ? MathUtils.fastAtan2(-m12, m11) : this.z;
		} else {
			this.x = MathUtils.fastAtan2(-m23, m33);
			this.z = MathUtils.fastAtan2(-m12, m11);
		}
	}

	#handleYxzOrder(
		m11: number,
		m13: number,
		m21: number,
		m22: number,
		m23: number,
		m31: number,
		m33: number,
		isGimbalLock: (v: number) => boolean,
	): void {
		this.x = MathUtils.safeAsin(-m23);
		if (isGimbalLock(m23)) {
			this.y = MathUtils.fastAtan2(-m31, m11);
			this.z = this.z === 0 ? MathUtils.fastAtan2(m21, m22) : this.z;
		} else {
			this.y = MathUtils.fastAtan2(m13, m33);
			this.z = MathUtils.fastAtan2(m21, m22);
		}
	}

	#handleZxyOrder(
		m11: number,
		m12: number,
		m21: number,
		m22: number,
		m31: number,
		m32: number,
		m33: number,
		isGimbalLock: (v: number) => boolean,
	): void {
		this.x = MathUtils.safeAsin(m32);
		if (isGimbalLock(m32)) {
			this.z = MathUtils.fastAtan2(m21, m11);
			this.y = this.y === 0 ? MathUtils.fastAtan2(-m31, m33) : this.y;
		} else {
			this.y = MathUtils.fastAtan2(-m31, m33);
			this.z = MathUtils.fastAtan2(-m12, m22);
		}
	}

	#handleZyxOrder(
		m11: number,
		m12: number,
		m21: number,
		m22: number,
		m31: number,
		m32: number,
		m33: number,
		isGimbalLock: (v: number) => boolean,
	): void {
		this.y = MathUtils.safeAsin(-m31);
		if (isGimbalLock(m31)) {
			this.z = MathUtils.fastAtan2(-m12, m22);
			this.x = this.x === 0 ? MathUtils.fastAtan2(m32, m33) : this.x;
		} else {
			this.x = MathUtils.fastAtan2(m32, m33);
			this.z = MathUtils.fastAtan2(m21, m11);
		}
	}

	#handleYzxOrder(
		m11: number,
		m13: number,
		m21: number,
		m22: number,
		m23: number,
		m31: number,
		m33: number,
		isGimbalLock: (v: number) => boolean,
	): void {
		this.z = MathUtils.safeAsin(m21);
		if (isGimbalLock(m21)) {
			this.y = MathUtils.fastAtan2(m13, m33);
			this.x = this.x === 0 ? MathUtils.fastAtan2(-m23, m22) : this.x;
		} else {
			this.x = MathUtils.fastAtan2(-m23, m22);
			this.y = MathUtils.fastAtan2(-m31, m11);
		}
	}

	#handleXzyOrder(
		m11: number,
		m12: number,
		m13: number,
		m22: number,
		m32: number,
		isGimbalLock: (v: number) => boolean,
	): void {
		this.z = MathUtils.safeAsin(-m12);
		if (isGimbalLock(m12)) {
			this.x = MathUtils.fastAtan2(m32, m22);
			this.y = this.y === 0 ? MathUtils.fastAtan2(m13, m11) : this.y;
		} else {
			this.x = MathUtils.fastAtan2(m32, m22);
			this.y = MathUtils.fastAtan2(m13, m11);
		}
	}

	#setFromRotationMatrixByOrder(
		order: EulerOrder,
		m11: number,
		m12: number,
		m13: number,
		m21: number,
		m22: number,
		m23: number,
		m31: number,
		m32: number,
		m33: number,
	): void {
		const isGimbalLock = (value: number) =>
			Math.abs(value) >= Euler.#GIMBAL_LOCK_THRESHOLD;

		switch (order) {
			case "XYZ":
				this.#handleXyzOrder(m11, m12, m13, m22, m23, m32, m33, isGimbalLock);
				break;
			case "YXZ":
				this.#handleYxzOrder(m11, m13, m21, m22, m23, m31, m33, isGimbalLock);
				break;
			case "ZXY":
				this.#handleZxyOrder(m11, m12, m21, m22, m31, m32, m33, isGimbalLock);
				break;
			case "ZYX":
				this.#handleZyxOrder(m11, m12, m21, m22, m31, m32, m33, isGimbalLock);
				break;
			case "YZX":
				this.#handleYzxOrder(m11, m13, m21, m22, m23, m31, m33, isGimbalLock);
				break;
			case "XZY":
				this.#handleXzyOrder(m11, m12, m13, m22, m32, isGimbalLock);
				break;
			default:
				throw new Error(`EASEL.Euler: unknown Euler order: ${order}`);
		}
	}
}
