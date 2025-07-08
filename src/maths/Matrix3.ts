import { MathUtils } from "./MathUtils";
import type { Matrix4 } from "./Matrix4";
import { Vector2 } from "./Vector2";

export class Matrix3 {
	#elements = new Float32Array(9);

	constructor(elements?: Float32Array<ArrayBuffer>) {
		if (elements) {
			this.#elements = elements;
		} else {
			this.identity();
		}
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

		const te0 = te[0] ?? 1;
		const te1 = te[1] as number;
		const te3 = te[3] as number;
		const te4 = te[4] ?? 1;

		te[0] = te0 * scale.x;
		te[3] = te3 * scale.x;

		te[1] = te1 * scale.y;
		te[4] = te4 * scale.y;

		te[6] = position.x;
		te[7] = position.y;
		return this;
	}

	copy(m: this): this {
		const me = m.elements;
		if (me === this.elements) {
			return this;
		}
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
		rotation.angle = MathUtils.fastAtan2(
			rotationMatrix.elements[1] as number,
			rotationMatrix.elements[0] ?? 1,
		);

		return this;
	}

	determinant(): number {
		const te = this.elements;

		const a = te[0] as number;
		const b = te[1] as number;
		const c = te[2] as number;
		const d = te[3] as number;
		const e = te[4] as number;
		const f = te[5] as number;
		const g = te[6] as number;
		const h = te[7] as number;
		const i = te[8] ?? 1;
		return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
	}

	extractPosition(position: Vector2): this {
		const te = this.elements;

		position.x = te[6] as number;
		position.y = te[7] as number;
		return this;
	}

	extractRotation(m: this): this {
		const me = m.elements;

		const scale = new Vector2();
		m.extractScale(scale);

		const invScaleX = 1 / scale.x;
		const invScaleY = 1 / scale.y;

		const te = this.elements;
		te[0] = (me[0] as number) * invScaleX;
		te[1] = (me[1] as number) * invScaleX;
		te[2] = 0;

		te[3] = (me[3] as number) * invScaleY;
		te[4] = (me[4] as number) * invScaleY;
		te[5] = 0;

		te[6] = 0;
		te[7] = 0;
		te[8] = 1;
		return this;
	}

	extractScale(scale: Vector2): this {
		const me = this.elements;

		const sx = Math.hypot(me[0] as number, me[3] as number);
		const sy = Math.hypot(me[1] as number, me[4] as number);
		scale.x = sx;
		scale.y = sy;

		return this;
	}

	getNormalMatrix(m: Matrix4): this {
		return this.setFromMatrix4(m).invert().transpose();
	}

	identity(): this {
		const te = this.elements;
		te[0] = 1;
		te[1] = 0;
		te[2] = 0;

		te[3] = 0;
		te[4] = 1;
		te[5] = 0;

		te[6] = 0;
		te[7] = 0;
		te[8] = 1;

		te[3] = 0;
		te[4] = 1;
		te[5] = 0;

		te[6] = 0;
		te[7] = 0;
		te[8] = 1;
		return this;
	}

	invert(): this {
		const te = this.elements;

		const n11 = te[0] as number;
		const n12 = te[1] as number;
		const n13 = te[2] as number;
		const n21 = te[3] as number;
		const n22 = te[4] as number;
		const n23 = te[5] as number;
		const n31 = te[6] as number;
		const n32 = te[7] as number;
		const n33 = te[8] as number;
		const det = this.determinant();
		if (det === 0) {
			throw new Error("EASEL.Matrix3: non-invertible matrix (det === 0)");
		}
		const detInv = 1 / det;

		te[0] = (n22 * n33 - n23 * n32) * detInv;
		te[1] = (n13 * n32 - n12 * n33) * detInv;
		te[2] = (n12 * n23 - n13 * n22) * detInv;
		te[3] = (n23 * n31 - n21 * n33) * detInv;
		te[4] = (n11 * n33 - n13 * n31) * detInv;
		te[5] = (n13 * n21 - n11 * n23) * detInv;
		te[6] = (n21 * n32 - n22 * n31) * detInv;
		te[7] = (n12 * n31 - n11 * n32) * detInv;
		te[8] = (n11 * n22 - n12 * n21) * detInv;
		return this;
	}

	makeRotation(radians: number): this {
		const c = Math.cos(radians);
		const s = Math.sin(radians);

		const te = this.elements;
		te[0] = c;
		te[1] = s;
		te[2] = 0;

		te[3] = -s;
		te[4] = c;
		te[5] = 0;

		te[6] = 0;
		te[7] = 0;
		te[8] = 1;
		return this;
	}

	makeScale(x: number, y: number): this {
		const te = this.elements;
		te[0] = x;
		te[1] = 0;
		te[2] = 0;

		te[3] = 0;
		te[4] = y;
		te[5] = 0;

		te[6] = 0;
		te[7] = 0;
		te[8] = 1;
		return this;
	}

	makeTranslation(x: number, y: number): this {
		const te = this.elements;
		te[0] = 1;
		te[1] = 0;
		te[2] = 0;

		te[3] = 0;
		te[4] = 1;
		te[5] = 0;

		te[6] = x;
		te[7] = y;
		te[8] = 1;
		return this;
	}

	mul(m: this): this {
		return this.mulMatrices(this, m);
	}

	mulMatrices(a: this, b: this): this {
		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;

		const [a11, a21, a31, a12, a22, a32, a13, a23, a33] = ae.map(
			(v) => v as number,
		);
		const [b11, b21, b31, b12, b22, b32, b13, b23, b33] = be.map(
			(v) => v as number,
		);

		const mulRow = (
			r1: number | undefined,
			r2: number | undefined,
			r3: number | undefined,
			c1: number | undefined,
			c2: number | undefined,
			c3: number | undefined,
		) => {
			return (
				(r1 as number) * (c1 as number) +
				(r2 as number) * (c2 as number) +
				(r3 as number) * (c3 as number)
			);
		};

		te[0] = mulRow(a11, a12, a13, b11, b21, b31);
		te[1] = mulRow(a21, a22, a23, b11, b21, b31);
		te[2] = mulRow(a31, a32, a33, b11, b21, b31);
		te[3] = mulRow(a11, a12, a13, b12, b22, b32);
		te[4] = mulRow(a21, a22, a23, b12, b22, b32);
		te[5] = mulRow(a31, a32, a33, b12, b22, b32);
		te[6] = mulRow(a11, a12, a13, b13, b23, b33);
		te[7] = mulRow(a21, a22, a23, b13, b23, b33);
		te[8] = mulRow(a31, a32, a33, b13, b23, b33);
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
		te[0] = n11;
		te[1] = n21;
		te[2] = n31;

		te[3] = n12;
		te[4] = n22;
		te[5] = n32;

		te[6] = n13;
		te[7] = n23;
		te[8] = n33;
		return this;
	}

	setFromMatrix4(m: Matrix4): this {
		const me = m.elements;
		const te = this.elements;
		te[0] = me[0] as number;
		te[1] = me[1] as number;
		te[2] = me[2] as number;

		te[3] = me[4] as number;
		te[4] = me[5] as number;
		te[5] = me[6] as number;

		te[6] = me[8] as number;
		te[7] = me[9] as number;
		te[8] = me[10] as number;
		return this;
	}

	transpose(): this {
		const te = this.elements;

		let temp: number;
		temp = te[1] as number;
		te[1] = te[3] as number;
		te[3] = temp;

		temp = te[2] as number;
		te[2] = te[6] as number;
		te[6] = temp;

		temp = te[5] as number;
		te[5] = te[7] as number;
		te[7] = temp;
		return this;
	}

	*[Symbol.iterator](): IterableIterator<number> {
		const te = this.elements;
		yield te[0] as number;
		yield te[1] as number;
		yield te[2] as number;

		yield te[3] as number;
		yield te[4] as number;
		yield te[5] as number;

		yield te[6] as number;
		yield te[7] as number;
		yield te[8] as number;
	}
}
