import "../types.ts";
import type { Matrix4 } from "./Matrix4.ts";
import { Vector2 } from "./Vector2.ts";

export class Matrix3 {
	#elements = new Float32Array(9);

	constructor(elements?: Float32Array<ArrayBuffer>) {
		elements ? (this.#elements = elements) : this.identity();
	}

	get elements(): Float32Array {
		return this.#elements;
	}

	clone(): Matrix3 {
		return new Matrix3().copy(this);
	}

	compose(position: Vector2, rotation: number, scale: Vector2): this {
		this.makeRotation(rotation);

		const te = this.elements;
		const e0 = te.safeAt(0);
		const e1 = te.safeAt(1);
		const e3 = te.safeAt(3);
		const e4 = te.safeAt(4);

		te[0] = e0 * scale.x, te[3] = e3 * scale.x;
		te[1] = e1 * scale.y, te[4] = e4 * scale.y;
		te[6] = position.x, te[7] = position.y;
		return this;
	}

	copy(m: Matrix3): this {
		const me = m.elements;
		if (me === this.elements) return this;
		this.elements.set(me);
		return this;
	}

	decompose(
		position: Vector2,
		rotation: { angle: number },
		scale: Vector2,
	): this {
		this.extractPosition(position);
		this.extractScale(scale);

		const rotationMatrix = new Matrix3().extractRotation(this);
		rotation.angle = Math.atan2(
			rotationMatrix.elements.safeAt(1),
			rotationMatrix.elements.safeAt(0),
		);

		return this;
	}

	determinant(): number {
		const te = this.elements;

		const a = te.safeAt(0), b = te.safeAt(1), c = te.safeAt(2);
		const d = te.safeAt(3), e = te.safeAt(4), f = te.safeAt(5);
		const g = te.safeAt(6), h = te.safeAt(7), i = te.safeAt(8);

		return (a * (e * i - f * h)) -
			(b * (d * i - f * g)) +
			(c * (d * h - e * g));
	}

	extractPosition(position: Vector2): this {
		const te = this.elements;
		position.x = te.safeAt(6);
		position.y = te.safeAt(7);
		return this;
	}

	extractRotation(m: Matrix3): this {
		const me = m.elements;

		const scale = new Vector2();
		m.extractScale(scale);

		const invScaleX = 1 / scale.x;
		const invScaleY = 1 / scale.y;

		const m11 = me.safeAt(0) * invScaleX,
			m12 = me.safeAt(1) * invScaleX;
		const m21 = me.safeAt(3) * invScaleY,
			m22 = me.safeAt(4) * invScaleY;

		const te = this.elements;
		te[0] = m11, te[1] = m12, te[2] = 0;
		te[3] = m21, te[4] = m22, te[5] = 0;
		te[6] = 0, te[7] = 0, te[8] = 1;
		return this;
	}

	extractScale(scale: Vector2): this {
		const me = this.elements;

		const sx = Math.hypot(me.safeAt(0), me.safeAt(3));
		const sy = Math.hypot(me.safeAt(1), me.safeAt(4));
		scale.x = sx;
		scale.y = sy;

		return this;
	}

	getNormalMatrix(m: Matrix4): this {
		return this.setFromMatrix4(m).invert().transpose();
	}

	identity(): this {
		const te = this.elements;
		te[0] = 1, te[1] = 0, te[2] = 0;
		te[3] = 0, te[4] = 1, te[5] = 0;
		te[6] = 0, te[7] = 0, te[8] = 1;
		return this;
	}

	invert(): this {
		const te = this.elements;

		const n11 = te.safeAt(0), n12 = te.safeAt(1), n13 = te.safeAt(2);
		const n21 = te.safeAt(3), n22 = te.safeAt(4), n23 = te.safeAt(5);
		const n31 = te.safeAt(6), n32 = te.safeAt(7), n33 = te.safeAt(8);

		const det = this.determinant();
		if (det === 0) {
			throw new Error(
				"EASEL.Matrix3.invert(): non-invertible matrix (det === 0)",
			);
		}
		const detInv = 1 / det;

		const t11 = ((n22 * n33) - (n23 * n32)) * detInv,
			t12 = ((n13 * n32) - (n12 * n33)) * detInv,
			t13 = ((n12 * n23) - (n13 * n22)) * detInv;
		const t21 = ((n23 * n31) - (n21 * n33)) * detInv,
			t22 = ((n11 * n33) - (n13 * n31)) * detInv,
			t23 = ((n13 * n21) - (n11 * n23)) * detInv;
		const t31 = ((n21 * n32) - (n22 * n31)) * detInv,
			t32 = ((n12 * n31) - (n11 * n32)) * detInv,
			t33 = ((n11 * n22) - (n12 * n21)) * detInv;

		te[0] = t11, te[1] = t12, te[2] = t13;
		te[3] = t21, te[4] = t22, te[5] = t23;
		te[6] = t31, te[7] = t32, te[8] = t33;
		return this;
	}

	makeRotation(radians: number): this {
		const c = Math.cos(radians);
		const s = Math.sin(radians);

		const te = this.elements;
		te[0] = c, te[1] = s, te[2] = 0;
		te[3] = -s, te[4] = c, te[5] = 0;
		te[6] = 0, te[7] = 0, te[8] = 1;
		return this;
	}

	makeScale(x: number, y: number): this {
		const te = this.elements;
		te[0] = x, te[1] = 0, te[2] = 0;
		te[3] = 0, te[4] = y, te[5] = 0;
		te[6] = 0, te[7] = 0, te[8] = 1;
		return this;
	}

	makeTranslation(x: number, y: number): this {
		const te = this.elements;
		te[0] = 1, te[1] = 0, te[2] = 0;
		te[3] = 0, te[4] = 1, te[5] = 0;
		te[6] = x, te[7] = y, te[8] = 1;
		return this;
	}

	mul(m: Matrix3): this {
		return this.mulMatrices(this, m);
	}

	mulMatrices(a: Matrix3, b: Matrix3): this {
		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;

		const a11 = ae.safeAt(0), a21 = ae.safeAt(1), a31 = ae.safeAt(2);
		const a12 = ae.safeAt(3), a22 = ae.safeAt(4), a32 = ae.safeAt(5);
		const a13 = ae.safeAt(6), a23 = ae.safeAt(7), a33 = ae.safeAt(8);

		const b11 = be.safeAt(0), b21 = be.safeAt(1), b31 = be.safeAt(2);
		const b12 = be.safeAt(3), b22 = be.safeAt(4), b32 = be.safeAt(5);
		const b13 = be.safeAt(6), b23 = be.safeAt(7), b33 = be.safeAt(8);

		te[0] = (a11 * b11) + (a12 * b21) + (a13 * b31);
		te[1] = (a21 * b11) + (a22 * b21) + (a23 * b31);
		te[2] = (a31 * b11) + (a32 * b21) + (a33 * b31);
		te[3] = (a11 * b12) + (a12 * b22) + (a13 * b32);
		te[4] = (a21 * b12) + (a22 * b22) + (a23 * b32);
		te[5] = (a31 * b12) + (a32 * b22) + (a33 * b32);
		te[6] = (a11 * b13) + (a12 * b23) + (a13 * b33);
		te[7] = (a21 * b13) + (a22 * b23) + (a23 * b33);
		te[8] = (a31 * b13) + (a32 * b23) + (a33 * b33);
		return this;
	}

	set(
		n11: number,
		n12: number,
		n13: number,
		n21: number,
		n22: number,
		n23: number,
		n31: number,
		n32: number,
		n33: number,
	): this {
		const te = this.elements;
		te[0] = n11, te[1] = n21, te[2] = n31;
		te[3] = n12, te[4] = n22, te[5] = n32;
		te[6] = n13, te[7] = n23, te[8] = n33;
		return this;
	}

	setFromMatrix4(m: Matrix4): this {
		const me = m.elements;
		const te = this.elements;

		const n11 = me.safeAt(0), n12 = me.safeAt(1), n13 = me.safeAt(2);
		const n21 = me.safeAt(4), n22 = me.safeAt(5), n23 = me.safeAt(6);
		const n31 = me.safeAt(8), n32 = me.safeAt(9), n33 = me.safeAt(10);

		te[0] = n11, te[1] = n12, te[2] = n13;
		te[3] = n21, te[4] = n22, te[5] = n23;
		te[6] = n31, te[7] = n32, te[8] = n33;
		return this;
	}

	transpose(): this {
		const te = this.elements;

		let temp;
		temp = te.safeAt(1), te[1] = te.safeAt(3), te[3] = temp;
		temp = te.safeAt(2), te[2] = te.safeAt(6), te[6] = temp;
		temp = te.safeAt(5), te[5] = te.safeAt(7), te[7] = temp;

		return this;
	}

	*[Symbol.iterator](): IterableIterator<number> {
		const te = this.elements;

		yield te.safeAt(0), yield te.safeAt(1), yield te.safeAt(2);
		yield te.safeAt(3), yield te.safeAt(4), yield te.safeAt(5);
		yield te.safeAt(6), yield te.safeAt(7), yield te.safeAt(8);
	}
}
