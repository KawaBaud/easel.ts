import type { Euler } from "./Euler";
import { EPSILON } from "./MathUtils";
import { Quaternion } from "./Quaternion";
import { Vector3 } from "./Vector3";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _q = new Quaternion();

export class Matrix4 {
	#elements = new Float32Array(16);

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

	clone(): Matrix4 {
		return new Matrix4().copy(this);
	}

	compose(position: Vector3, q: Quaternion, scale: Vector3): this {
		const te = this.elements;

		const { x: qx, y: qy, z: qz, w: qw } = q;
		const qx2 = qx + qx;
		const qy2 = qy + qy;
		const qz2 = qz + qz;

		const xx = qx * qx2;
		const xy = qx * qy2;
		const xz = qx * qz2;
		const yy = qy * qy2;
		const yz = qy * qz2;
		const zz = qz * qz2;
		const wx = qw * qx2;
		const wy = qw * qy2;
		const wz = qw * qz2;

		const { x: sx, y: sy, z: sz } = scale;

		te[0] = (1 - (yy + zz)) * sx;
		te[1] = (xy + wz) * sx;
		te[2] = (xz - wy) * sx;
		te[3] = 0;

		te[4] = (xy - wz) * sy;
		te[5] = (1 - (xx + zz)) * sy;
		te[6] = (yz + wx) * sy;
		te[7] = 0;

		te[8] = (xz + wy) * sz;
		te[9] = (yz - wx) * sz;
		te[10] = (1 - (xx + yy)) * sz;
		te[11] = 0;

		te[12] = position.x;
		te[13] = position.y;
		te[14] = position.z;
		te[15] = 1;
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

	decompose(position: Vector3, q: Quaternion, scale: Vector3): this {
		this.extractPosition(position);
		this.extractScale(scale);

		const rotationMatrix = new Matrix4().extractRotation(this);
		q.setFromRotationMatrix(rotationMatrix);

		return this;
	}

	determinant(): number {
		const te = this.elements;

		const [n11, n21, n31, n41] = te.subarray(0, 4) as unknown as [
			number,
			number,
			number,
			number,
		];
		const [n12, n22, n32, n42] = te.subarray(4, 8) as unknown as [
			number,
			number,
			number,
			number,
		];
		const [n13, n23, n33, n43] = te.subarray(8, 12) as unknown as [
			number,
			number,
			number,
			number,
		];
		const [n14, n24, n34, n44] = te.subarray(12, 16) as unknown as [
			number,
			number,
			number,
			number,
		];

		const t1 = n33 * n44 - n34 * n43;
		const t2 = n32 * n44 - n34 * n42;
		const t3 = n32 * n43 - n33 * n42;
		const t4 = n31 * n44 - n34 * n41;
		const t5 = n31 * n43 - n33 * n41;
		const t6 = n31 * n42 - n32 * n41;

		const det11 = n22 * t1 - n23 * t2 + n24 * t3;
		const det12 = n21 * t1 - n23 * t4 + n24 * t5;
		const det13 = n21 * t2 - n22 * t4 + n24 * t6;
		const det14 = n21 * t3 - n22 * t5 + n23 * t6;

		return n11 * det11 - n12 * det12 + n13 * det13 - n14 * det14;
	}

	extractPosition(position: Vector3): this {
		const te = this.elements;
		position.x = te[12] as number;
		position.y = te[13] as number;
		position.z = te[14] as number;
		return this;
	}

	extractRotation(m: this): this {
		const me = m.elements;

		const scale = new Vector3();
		m.extractScale(scale);

		const invScaleX = 1 / scale.x;
		const invScaleY = 1 / scale.y;
		const invScaleZ = 1 / scale.z;

		const te = this.elements;
		te[0] = (me[0] as number) * invScaleX;
		te[1] = (me[1] as number) * invScaleX;
		te[2] = (me[2] as number) * invScaleX;
		te[3] = 0;

		te[4] = (me[4] as number) * invScaleY;
		te[5] = (me[5] as number) * invScaleY;
		te[6] = (me[6] as number) * invScaleY;
		te[7] = 0;

		te[8] = (me[8] as number) * invScaleZ;
		te[9] = (me[9] as number) * invScaleZ;
		te[10] = (me[10] as number) * invScaleZ;
		te[11] = 0;

		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;
		return this;
	}

	extractScale(scale: Vector3): this {
		const me = this.elements;

		let sx = Math.hypot(me[0] as number, me[1] as number, me[2] as number);
		const sy = Math.hypot(me[4] as number, me[5] as number, me[6] as number);
		const sz = Math.hypot(me[8] as number, me[9] as number, me[10] as number);

		const det = this.determinant();
		if (det < 0) {
			sx = -sx;
		}

		scale.x = sx;
		scale.y = sy;
		scale.z = sz;

		return this;
	}

	identity(): this {
		const te = this.elements;
		te[0] = 1;
		te[4] = 0;
		te[8] = 0;
		te[12] = 0;

		te[1] = 0;
		te[5] = 1;
		te[9] = 0;
		te[13] = 0;

		te[2] = 0;
		te[6] = 0;
		te[10] = 1;
		te[14] = 0;

		te[3] = 0;
		te[7] = 0;
		te[11] = 0;
		te[15] = 1;
		return this;
	}

	invert(): this {
		const te = this.elements;

		const n11 = te[0] as number;
		const n21 = te[1] as number;
		const n31 = te[2] as number;
		const n41 = te[3] as number;

		const n12 = te[4] as number;
		const n22 = te[5] as number;
		const n32 = te[6] as number;
		const n42 = te[7] as number;

		const n13 = te[8] as number;
		const n23 = te[9] as number;
		const n33 = te[10] as number;
		const n43 = te[11] as number;

		const n14 = te[12] as number;
		const n24 = te[13] as number;
		const n34 = te[14] as number;
		const n44 = te[15] as number;

		const t11 =
			n23 * n34 * n42 -
			n24 * n33 * n42 +
			n24 * n32 * n43 -
			n22 * n34 * n43 -
			n23 * n32 * n44 +
			n22 * n33 * n44;
		const t12 =
			n14 * n33 * n42 -
			n13 * n34 * n42 -
			n14 * n32 * n43 +
			n12 * n34 * n43 +
			n13 * n32 * n44 -
			n12 * n33 * n44;
		const t13 =
			n13 * n24 * n42 -
			n14 * n23 * n42 +
			n14 * n22 * n43 -
			n12 * n24 * n43 -
			n13 * n22 * n44 +
			n12 * n23 * n44;
		const t14 =
			n14 * n23 * n32 -
			n13 * n24 * n32 -
			n14 * n22 * n33 +
			n12 * n24 * n33 +
			n13 * n22 * n34 -
			n12 * n23 * n34;

		const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
		if (det === 0) {
			throw new Error("EASEL.Matrix4: non-invertible matrix (det === 0)");
		}
		const detInv = 1 / det;

		te[0] = t11 * detInv;
		te[1] =
			(n24 * n33 * n41 -
				n23 * n34 * n41 -
				n24 * n31 * n43 +
				n21 * n34 * n43 +
				n23 * n31 * n44 -
				n21 * n33 * n44) *
			detInv;
		te[2] =
			(n22 * n34 * n41 -
				n24 * n32 * n41 +
				n24 * n31 * n42 -
				n21 * n34 * n42 -
				n22 * n31 * n44 +
				n21 * n32 * n44) *
			detInv;
		te[3] =
			(n23 * n32 * n41 -
				n22 * n33 * n41 -
				n23 * n31 * n42 +
				n21 * n33 * n42 +
				n22 * n31 * n43 -
				n21 * n32 * n43) *
			detInv;
		te[4] = t12 * detInv;
		te[5] =
			(n13 * n34 * n41 -
				n14 * n33 * n41 +
				n14 * n31 * n43 -
				n11 * n34 * n43 -
				n13 * n31 * n44 +
				n11 * n33 * n44) *
			detInv;
		te[6] =
			(n14 * n32 * n41 -
				n12 * n34 * n41 -
				n14 * n31 * n42 +
				n11 * n34 * n42 +
				n12 * n31 * n44 -
				n11 * n32 * n44) *
			detInv;
		te[7] =
			(n12 * n33 * n41 -
				n13 * n32 * n41 +
				n13 * n31 * n42 -
				n11 * n33 * n42 -
				n12 * n31 * n43 +
				n11 * n32 * n43) *
			detInv;
		te[8] = t13 * detInv;
		te[9] =
			(n14 * n23 * n41 -
				n13 * n24 * n41 -
				n14 * n21 * n43 +
				n11 * n24 * n43 +
				n13 * n21 * n44 -
				n11 * n23 * n44) *
			detInv;
		te[10] =
			(n12 * n24 * n41 -
				n14 * n22 * n41 +
				n14 * n21 * n42 -
				n11 * n24 * n42 -
				n12 * n21 * n44 +
				n11 * n22 * n44) *
			detInv;
		te[11] =
			(n13 * n22 * n41 -
				n12 * n23 * n41 -
				n13 * n21 * n42 +
				n11 * n23 * n42 +
				n12 * n21 * n43 -
				n11 * n22 * n43) *
			detInv;
		te[12] = t14 * detInv;
		te[13] =
			(n13 * n24 * n31 -
				n14 * n23 * n31 +
				n14 * n21 * n33 -
				n11 * n24 * n33 -
				n13 * n21 * n34 +
				n11 * n23 * n34) *
			detInv;
		te[14] =
			(n14 * n22 * n31 -
				n12 * n24 * n31 -
				n14 * n21 * n32 +
				n11 * n24 * n32 +
				n12 * n21 * n34 -
				n11 * n22 * n34) *
			detInv;
		te[15] =
			(n12 * n23 * n31 -
				n13 * n22 * n31 +
				n13 * n21 * n32 -
				n11 * n23 * n32 -
				n12 * n21 * n33 +
				n11 * n22 * n33) *
			detInv;
		return this;
	}

	lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
		_v1.copy(eye).sub(target);
		if (_v1.lengthSq === 0) {
			_v1.z = 1;
		}
		_v1.unitize();

		_v2.copy(up).cross(_v1);
		if (_v2.lengthSq === 0) {
			if (Math.abs(up.z) === 1) {
				_v1.x += EPSILON;
			} else {
				_v1.z += EPSILON;
			}
			_v1.unitize();

			_v2.copy(up).cross(_v1);
		}
		_v2.unitize();

		_v3.copy(_v1).cross(_v2);

		const te = this.elements;
		te[0] = _v2.x;
		te[4] = _v3.x;
		te[8] = _v1.x;

		te[1] = _v2.y;
		te[5] = _v3.y;
		te[9] = _v1.y;

		te[2] = _v2.z;
		te[6] = _v3.z;
		te[10] = _v1.z;
		return this;
	}

	makeOrthographic(
		left: number,
		right: number,
		top: number,
		bottom: number,
		near: number,
		far: number,
	): this {
		const w = 1.0 / (right - left);
		const h = 1.0 / (top - bottom);
		const p = 1.0 / (far - near);

		const te = this.elements;
		te[0] = 2 * w;
		te[1] = 0;
		te[2] = 0;
		te[3] = 0;

		te[4] = 0;
		te[5] = 2 * h;
		te[6] = 0;
		te[7] = 0;

		te[8] = 0;
		te[9] = 0;
		te[10] = -2 * p;
		te[11] = 0;

		te[12] = -((right + left) * w);
		te[13] = -((top + bottom) * h);
		te[14] = -((far + near) * p);
		te[15] = 1;
		return this;
	}

	makePerspective(
		fov: number,
		aspect: number,
		near: number,
		far: number,
	): this {
		const tHalfFov = Math.tan(fov / 2);

		const left = -aspect * tHalfFov * near;
		const right = aspect * tHalfFov * near;
		const top = tHalfFov * near;
		const bottom = -tHalfFov * near;

		const te = this.elements;
		te[0] = (2 * near) / (right - left);
		te[1] = 0;
		te[2] = 0;
		te[3] = 0;

		te[4] = 0;
		te[5] = (2 * near) / (top - bottom);
		te[6] = 0;
		te[7] = 0;

		te[8] = (right + left) / (right - left);
		te[9] = (top + bottom) / (top - bottom);
		te[10] = -(far + near) / (far - near);
		te[11] = -1;

		te[12] = 0;
		te[13] = 0;
		te[14] = -(2 * far * near) / (far - near);
		te[15] = 0;
		return this;
	}

	makeRotationFromEuler(euler: Euler): this {
		_q.setFromEuler(euler);
		return this.makeRotationFromQuaternion(_q);
	}

	makeRotationFromQuaternion(q: Quaternion): this {
		_v1.set(0, 0, 0);
		_v2.set(1, 1, 1);
		return this.compose(_v1, q, _v2);
	}

	makeRotationX(radians: number): this {
		const c = Math.cos(radians);
		const s = Math.sin(radians);

		const te = this.elements;
		te[0] = 1;
		te[1] = 0;
		te[2] = 0;
		te[3] = 0;

		te[4] = 0;
		te[5] = c;
		te[6] = s;
		te[7] = 0;

		te[8] = 0;
		te[9] = -s;
		te[10] = c;
		te[11] = 0;

		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;
		return this;
	}

	makeRotationY(radians: number): this {
		const c = Math.cos(radians);
		const s = Math.sin(radians);

		const te = this.elements;
		te[0] = c;
		te[1] = 0;
		te[2] = -s;
		te[3] = 0;

		te[4] = 0;
		te[5] = 1;
		te[6] = 0;
		te[7] = 0;

		te[8] = s;
		te[9] = 0;
		te[10] = c;
		te[11] = 0;

		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;
		return this;
	}

	makeRotationZ(radians: number): this {
		const c = Math.cos(radians);
		const s = Math.sin(radians);

		const te = this.elements;
		te[0] = c;
		te[1] = s;
		te[2] = 0;
		te[3] = 0;

		te[4] = -s;
		te[5] = c;
		te[6] = 0;
		te[7] = 0;

		te[8] = 0;
		te[9] = 0;
		te[10] = 1;
		te[11] = 0;

		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;
		return this;
	}

	makeScale(x: number, y: number, z: number): this {
		const te = this.elements;
		te[0] = x;
		te[1] = 0;
		te[2] = 0;
		te[3] = 0;

		te[4] = 0;
		te[5] = y;
		te[6] = 0;
		te[7] = 0;

		te[8] = 0;
		te[9] = 0;
		te[10] = z;
		te[11] = 0;

		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;
		return this;
	}

	makeTranslation(x: number, y: number, z: number): this {
		const te = this.elements;
		te[0] = 1;
		te[1] = 0;
		te[2] = 0;
		te[3] = 0;

		te[4] = 0;
		te[5] = 1;
		te[6] = 0;
		te[7] = 0;

		te[8] = 0;
		te[9] = 0;
		te[10] = 1;
		te[11] = 0;

		te[12] = x;
		te[13] = y;
		te[14] = z;
		te[15] = 1;
		return this;
	}

	mul(m: this): this {
		return this.mulMatrices(this, m);
	}

	mulMatrices(a: this, b: this): this {
		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;

		const [
			a11,
			a21,
			a31,
			a41,
			a12,
			a22,
			a32,
			a42,
			a13,
			a23,
			a33,
			a43,
			a14,
			a24,
			a34,
			a44,
		] = ae.map((v) => v as number);

		const [
			b11,
			b21,
			b31,
			b41,
			b12,
			b22,
			b32,
			b42,
			b13,
			b23,
			b33,
			b43,
			b14,
			b24,
			b34,
			b44,
		] = be.map((v) => v as number);

		const mulRow = (
			r1: number | undefined,
			r2: number | undefined,
			r3: number | undefined,
			r4: number | undefined,
			c1: number | undefined,
			c2: number | undefined,
			c3: number | undefined,
			c4: number | undefined,
		) => {
			return (
				(r1 as number) * (c1 as number) +
				(r2 as number) * (c2 as number) +
				(r3 as number) * (c3 as number) +
				(r4 as number) * (c4 as number)
			);
		};

		te[0] = mulRow(a11, a12, a13, a14, b11, b21, b31, b41);
		te[1] = mulRow(a21, a22, a23, a24, b11, b21, b31, b41);
		te[2] = mulRow(a31, a32, a33, a34, b11, b21, b31, b41);
		te[3] = mulRow(a41, a42, a43, a44, b11, b21, b31, b41);

		te[4] = mulRow(a11, a12, a13, a14, b12, b22, b32, b42);
		te[5] = mulRow(a21, a22, a23, a24, b12, b22, b32, b42);
		te[6] = mulRow(a31, a32, a33, a34, b12, b22, b32, b42);
		te[7] = mulRow(a41, a42, a43, a44, b12, b22, b32, b42);

		te[8] = mulRow(a11, a12, a13, a14, b13, b23, b33, b43);
		te[9] = mulRow(a21, a22, a23, a24, b13, b23, b33, b43);
		te[10] = mulRow(a31, a32, a33, a34, b13, b23, b33, b43);
		te[11] = mulRow(a41, a42, a43, a44, b13, b23, b33, b43);

		te[12] = mulRow(a11, a12, a13, a14, b14, b24, b34, b44);
		te[13] = mulRow(a21, a22, a23, a24, b14, b24, b34, b44);
		te[14] = mulRow(a31, a32, a33, a34, b14, b24, b34, b44);
		te[15] = mulRow(a41, a42, a43, a44, b14, b24, b34, b44);
		return this;
	}

	set(
		n11: number,
		n12: number,
		n13: number,
		n14: number,
		n21: number,
		n22: number,
		n23: number,
		n24: number,
		n31: number,
		n32: number,
		n33: number,
		n34: number,
		n41: number,
		n42: number,
		n43: number,
		n44: number,
	): this {
		const te = this.elements;
		te[0] = n11;
		te[1] = n21;
		te[2] = n31;
		te[3] = n41;

		te[4] = n12;
		te[5] = n22;
		te[6] = n32;
		te[7] = n42;

		te[8] = n13;
		te[9] = n23;
		te[10] = n33;
		te[11] = n43;

		te[12] = n14;
		te[13] = n24;
		te[14] = n34;
		te[15] = n44;
		return this;
	}

	transpose(): this {
		const te = this.elements;

		let temp: number;
		temp = te[1] as number;
		te[1] = te[4] as number;
		te[4] = temp;

		temp = te[2] as number;
		te[2] = te[8] as number;
		te[8] = temp;

		temp = te[3] as number;
		te[3] = te[12] as number;
		te[12] = temp;

		temp = te[6] as number;
		te[6] = te[9] as number;
		te[9] = temp;

		temp = te[7] as number;
		te[7] = te[13] as number;
		te[13] = temp;

		temp = te[11] as number;
		te[11] = te[14] as number;
		te[14] = temp;
		return this;
	}

	*[Symbol.iterator](): IterableIterator<number> {
		const te = this.elements;
		for (let i = 0; i < 16; i++) {
			yield te[i] as number;
		}
	}
}
