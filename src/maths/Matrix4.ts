import "../types.ts";
import type { Euler } from "./Euler.ts";
import { MathUtils } from "./MathUtils.ts";
import { Quaternion } from "./Quaternion.ts";
import { Vector3 } from "./Vector3.ts";

export class Matrix4 {
	#elements = new Float32Array(16);

	constructor(elements?: Float32Array<ArrayBuffer>) {
		elements ? (this.#elements = elements) : this.identity();
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

	copy(m: Matrix4): this {
		const me = m.elements;
		if (me === this.elements) return this;

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

		const n11 = te.safeAt(0),
			n12 = te.safeAt(4),
			n13 = te.safeAt(8),
			n14 = te.safeAt(12);
		const n21 = te.safeAt(1),
			n22 = te.safeAt(5),
			n23 = te.safeAt(9),
			n24 = te.safeAt(13);
		const n31 = te.safeAt(2),
			n32 = te.safeAt(6),
			n33 = te.safeAt(10),
			n34 = te.safeAt(14);
		const n41 = te.safeAt(3),
			n42 = te.safeAt(7),
			n43 = te.safeAt(11),
			n44 = te.safeAt(15);

		const t1 = (n33 * n44) - (n34 * n43);
		const t2 = (n32 * n44) - (n34 * n42);
		const t3 = (n32 * n43) - (n33 * n42);
		const t4 = (n31 * n44) - (n34 * n41);
		const t5 = (n31 * n43) - (n33 * n41);
		const t6 = (n31 * n42) - (n32 * n41);

		const det11 = (n22 * t1) - (n23 * t2) + (n24 * t3);
		const det12 = (n21 * t1) - (n23 * t4) + (n24 * t5);
		const det13 = (n21 * t2) - (n22 * t4) + (n24 * t6);
		const det14 = (n21 * t3) - (n22 * t5) + (n23 * t6);

		return (n11 * det11) - (n12 * det12) + (n13 * det13) - (n14 * det14);
	}

	extractPosition(position: Vector3): this {
		const te = this.elements;
		position.x = te.safeAt(12);
		position.y = te.safeAt(13);
		position.z = te.safeAt(14);
		return this;
	}

	extractRotation(m: Matrix4): this {
		const me = m.elements;

		const scale = new Vector3();
		m.extractScale(scale);

		const invScaleX = 1 / scale.x;
		const invScaleY = 1 / scale.y;
		const invScaleZ = 1 / scale.z;

		const m11 = me.safeAt(0) * invScaleX,
			m12 = me.safeAt(1) * invScaleX,
			m13 = me.safeAt(2) * invScaleX;
		const m21 = me.safeAt(4) * invScaleY,
			m22 = me.safeAt(5) * invScaleY,
			m23 = me.safeAt(6) * invScaleY;
		const m31 = me.safeAt(8) * invScaleZ,
			m32 = me.safeAt(9) * invScaleZ,
			m33 = me.safeAt(10) * invScaleZ;

		const te = this.elements;
		te[0] = m11, te[1] = m12, te[2] = m13, te[3] = 0;
		te[4] = m21, te[5] = m22, te[6] = m23, te[7] = 0;
		te[8] = m31, te[9] = m32, te[10] = m33, te[11] = 0;
		te[12] = 0, te[13] = 0, te[14] = 0, te[15] = 1;
		return this;
	}

	extractScale(scale: Vector3): this {
		const me = this.elements;

		let sx = Math.hypot(me.safeAt(0), me.safeAt(1), me.safeAt(2));
		const sy = Math.hypot(me.safeAt(4), me.safeAt(5), me.safeAt(6));
		const sz = Math.hypot(me.safeAt(8), me.safeAt(9), me.safeAt(10));

		const det = this.determinant();
		if (det < 0) sx = -sx;

		scale.x = sx;
		scale.y = sy;
		scale.z = sz;

		return this;
	}

	identity(): this {
		const te = this.elements;
		te[0] = 1, te[4] = 0, te[8] = 0, te[12] = 0;
		te[1] = 0, te[5] = 1, te[9] = 0, te[13] = 0;
		te[2] = 0, te[6] = 0, te[10] = 1, te[14] = 0;
		te[3] = 0, te[7] = 0, te[11] = 0, te[15] = 1;
		return this;
	}

	invert(): this {
		const te = this.elements;

		const n11 = te.safeAt(0),
			n21 = te.safeAt(1),
			n31 = te.safeAt(2),
			n41 = te.safeAt(3);
		const n12 = te.safeAt(4),
			n22 = te.safeAt(5),
			n32 = te.safeAt(6),
			n42 = te.safeAt(7);
		const n13 = te.safeAt(8),
			n23 = te.safeAt(9),
			n33 = te.safeAt(10),
			n43 = te.safeAt(11);
		const n14 = te.safeAt(12),
			n24 = te.safeAt(13),
			n34 = te.safeAt(14),
			n44 = te.safeAt(15);

		const t11 = (n23 * n34 * n42) - (n24 * n33 * n42) +
			(n24 * n32 * n43) - (n22 * n34 * n43) -
			(n23 * n32 * n44) + (n22 * n33 * n44);
		const t12 = (n14 * n33 * n42) - (n13 * n34 * n42) -
			(n14 * n32 * n43) + (n12 * n34 * n43) +
			(n13 * n32 * n44) - (n12 * n33 * n44);
		const t13 = (n13 * n24 * n42) - (n14 * n23 * n42) +
			(n14 * n22 * n43) - (n12 * n24 * n43) -
			(n13 * n22 * n44) + (n12 * n23 * n44);
		const t14 = (n14 * n23 * n32) - (n13 * n24 * n32) -
			(n14 * n22 * n33) + (n12 * n24 * n33) +
			(n13 * n22 * n34) - (n12 * n23 * n34);

		const det = (n11 * t11) + (n21 * t12) + (n31 * t13) + (n41 * t14);
		if (det === 0) {
			throw new Error(
				"EASEL.Matrix4.invert(): non-invertible matrix (det === 0)",
			);
		}
		const detInv = 1 / det;

		te[0] = t11 * detInv;
		te[1] = ((n24 * n33 * n41) - (n23 * n34 * n41) -
			(n24 * n31 * n43) + (n21 * n34 * n43) +
			(n23 * n31 * n44) - (n21 * n33 * n44)) * detInv;
		te[2] = ((n22 * n34 * n41) - (n24 * n32 * n41) +
			(n24 * n31 * n42) - (n21 * n34 * n42) -
			(n22 * n31 * n44) + (n21 * n32 * n44)) * detInv;
		te[3] = ((n23 * n32 * n41) - (n22 * n33 * n41) -
			(n23 * n31 * n42) + (n21 * n33 * n42) +
			(n22 * n31 * n43) - (n21 * n32 * n43)) * detInv;
		te[4] = t12 * detInv;
		te[5] = ((n13 * n34 * n41) - (n14 * n33 * n41) +
			(n14 * n31 * n43) - (n11 * n34 * n43) -
			(n13 * n31 * n44) + (n11 * n33 * n44)) * detInv;
		te[6] = ((n14 * n32 * n41) - (n12 * n34 * n41) -
			(n14 * n31 * n42) + (n11 * n34 * n42) +
			(n12 * n31 * n44) - (n11 * n32 * n44)) * detInv;
		te[7] = ((n12 * n33 * n41) - (n13 * n32 * n41) +
			(n13 * n31 * n42) - (n11 * n33 * n42) -
			(n12 * n31 * n43) + (n11 * n32 * n43)) * detInv;
		te[8] = t13 * detInv;
		te[9] = ((n14 * n23 * n41) - (n13 * n24 * n41) -
			(n14 * n21 * n43) + (n11 * n24 * n43) +
			(n13 * n21 * n44) - (n11 * n23 * n44)) * detInv;
		te[10] = ((n12 * n24 * n41) - (n14 * n22 * n41) +
			(n14 * n21 * n42) - (n11 * n24 * n42) -
			(n12 * n21 * n44) + (n11 * n22 * n44)) * detInv;
		te[11] = ((n13 * n22 * n41) - (n12 * n23 * n41) -
			(n13 * n21 * n42) + (n11 * n23 * n42) +
			(n12 * n21 * n43) - (n11 * n22 * n43)) * detInv;
		te[12] = t14 * detInv;
		te[13] = ((n13 * n24 * n31) - (n14 * n23 * n31) +
			(n14 * n21 * n33) - (n11 * n24 * n33) -
			(n13 * n21 * n34) + (n11 * n23 * n34)) * detInv;
		te[14] = ((n14 * n22 * n31) - (n12 * n24 * n31) -
			(n14 * n21 * n32) + (n11 * n24 * n32) +
			(n12 * n21 * n34) - (n11 * n22 * n34)) * detInv;
		te[15] = ((n12 * n23 * n31) - (n13 * n22 * n31) +
			(n13 * n21 * n32) - (n11 * n23 * n32) -
			(n12 * n21 * n33) + (n11 * n22 * n33)) * detInv;
		return this;
	}

	lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
		const z = eye.clone().sub(target);
		if (z.lengthSq === 0) z.z = 1;
		z.unitize();

		const x = up.clone().cross(z);
		if (x.lengthSq === 0) {
			Math.abs(up.z) === 1
				? z.x += MathUtils.EPSILON
				: z.z += MathUtils.EPSILON;
			z.unitize();

			x.copy(up).cross(z);
		}
		x.unitize();

		const y = z.clone().cross(x);

		const te = this.elements;
		te[0] = x.x, te[4] = y.x, te[8] = z.x;
		te[1] = x.y, te[5] = y.y, te[9] = z.y;
		te[2] = x.z, te[6] = y.z, te[10] = z.z;
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

		const x = 2 * w;
		const y = 2 * h;
		const z = -2 * p;
		const tx = -((right + left) * w);
		const ty = -((top + bottom) * h);
		const tz = -((far + near) * p);

		const te = this.elements;
		te[0] = x, te[1] = 0, te[2] = 0, te[3] = 0;
		te[4] = 0, te[5] = y, te[6] = 0, te[7] = 0;
		te[8] = 0, te[9] = 0, te[10] = z, te[11] = 0;
		te[12] = tx, te[13] = ty, te[14] = tz, te[15] = 1;
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

		const x = (2 * near) / (right - left);
		const y = (2 * near) / (top - bottom);

		const a = (right + left) / (right - left);
		const b = (top + bottom) / (top - bottom);
		const c = -(far + near) / (far - near);
		const d = -(2 * far * near) / (far - near);

		const te = this.elements;
		te[0] = x, te[1] = 0, te[2] = 0, te[3] = 0;
		te[4] = 0, te[5] = y, te[6] = 0, te[7] = 0;
		te[8] = a, te[9] = b, te[10] = c, te[11] = -1;
		te[12] = 0, te[13] = 0, te[14] = d, te[15] = 0;
		return this;
	}

	makeRotationFromEuler(euler: Euler): this {
		return this.makeRotationFromQuaternion(
			new Quaternion().setFromEuler(euler),
		);
	}

	makeRotationFromQuaternion(q: Quaternion): this {
		return this.compose(new Vector3(0, 0, 0), q, new Vector3(1, 1, 1));
	}

	makeRotationX(radians: number): this {
		const c = Math.cos(radians);
		const s = Math.sin(radians);

		const te = this.elements;
		te[0] = 1, te[1] = 0, te[2] = 0, te[3] = 0;
		te[4] = 0, te[5] = c, te[6] = s, te[7] = 0;
		te[8] = 0, te[9] = -s, te[10] = c, te[11] = 0;
		te[12] = 0, te[13] = 0, te[14] = 0, te[15] = 1;
		return this;
	}

	makeRotationY(radians: number): this {
		const c = Math.cos(radians);
		const s = Math.sin(radians);

		const te = this.elements;
		te[0] = c, te[1] = 0, te[2] = -s, te[3] = 0;
		te[4] = 0, te[5] = 1, te[6] = 0, te[7] = 0;
		te[8] = s, te[9] = 0, te[10] = c, te[11] = 0;
		te[12] = 0, te[13] = 0, te[14] = 0, te[15] = 1;
		return this;
	}

	makeRotationZ(radians: number): this {
		const c = Math.cos(radians);
		const s = Math.sin(radians);

		const te = this.elements;
		te[0] = c, te[1] = s, te[2] = 0, te[3] = 0;
		te[4] = -s, te[5] = c, te[6] = 0, te[7] = 0;
		te[8] = 0, te[9] = 0, te[10] = 1, te[11] = 0;
		te[12] = 0, te[13] = 0, te[14] = 0, te[15] = 1;
		return this;
	}

	makeScale(x: number, y: number, z: number): this {
		const te = this.elements;
		te[0] = x, te[1] = 0, te[2] = 0, te[3] = 0;
		te[4] = 0, te[5] = y, te[6] = 0, te[7] = 0;
		te[8] = 0, te[9] = 0, te[10] = z, te[11] = 0;
		te[12] = 0, te[13] = 0, te[14] = 0, te[15] = 1;
		return this;
	}

	makeTranslation(x: number, y: number, z: number): this {
		const te = this.elements;
		te[0] = 1, te[1] = 0, te[2] = 0, te[3] = 0;
		te[4] = 0, te[5] = 1, te[6] = 0, te[7] = 0;
		te[8] = 0, te[9] = 0, te[10] = 1, te[11] = 0;
		te[12] = x, te[13] = y, te[14] = z, te[15] = 1;
		return this;
	}

	mul(m: Matrix4): this {
		return this.mulMatrices(this, m);
	}

	mulMatrices(a: Matrix4, b: Matrix4): this {
		const ae = a.elements;
		const be = b.elements;

		const a11 = ae.safeAt(0),
			a21 = ae.safeAt(1),
			a31 = ae.safeAt(2),
			a41 = ae.safeAt(3);
		const a12 = ae.safeAt(4),
			a22 = ae.safeAt(5),
			a32 = ae.safeAt(6),
			a42 = ae.safeAt(7);
		const a13 = ae.safeAt(8),
			a23 = ae.safeAt(9),
			a33 = ae.safeAt(10),
			a43 = ae.safeAt(11);
		const a14 = ae.safeAt(12),
			a24 = ae.safeAt(13),
			a34 = ae.safeAt(14),
			a44 = ae.safeAt(15);

		const b11 = be.safeAt(0),
			b21 = be.safeAt(1),
			b31 = be.safeAt(2),
			b41 = be.safeAt(3);
		const b12 = be.safeAt(4),
			b22 = be.safeAt(5),
			b32 = be.safeAt(6),
			b42 = be.safeAt(7);
		const b13 = be.safeAt(8),
			b23 = be.safeAt(9),
			b33 = be.safeAt(10),
			b43 = be.safeAt(11);
		const b14 = be.safeAt(12),
			b24 = be.safeAt(13),
			b34 = be.safeAt(14),
			b44 = be.safeAt(15);

		const n11 = (a11 * b11) + (a12 * b21) + (a13 * b31) + (a14 * b41),
			n21 = (a21 * b11) + (a22 * b21) + (a23 * b31) + (a24 * b41),
			n31 = (a31 * b11) + (a32 * b21) + (a33 * b31) + (a34 * b41),
			n41 = (a41 * b11) + (a42 * b21) + (a43 * b31) + (a44 * b41);
		const n12 = (a11 * b12) + (a12 * b22) + (a13 * b32) + (a14 * b42),
			n22 = (a21 * b12) + (a22 * b22) + (a23 * b32) + (a24 * b42),
			n32 = (a31 * b12) + (a32 * b22) + (a33 * b32) + (a34 * b42),
			n42 = (a41 * b12) + (a42 * b22) + (a43 * b32) + (a44 * b42);
		const n13 = (a11 * b13) + (a12 * b23) + (a13 * b33) + (a14 * b43),
			n23 = (a21 * b13) + (a22 * b23) + (a23 * b33) + (a24 * b43),
			n33 = (a31 * b13) + (a32 * b23) + (a33 * b33) + (a34 * b43),
			n43 = (a41 * b13) + (a42 * b23) + (a43 * b33) + (a44 * b43);
		const n14 = (a11 * b14) + (a12 * b24) + (a13 * b34) + (a14 * b44),
			n24 = (a21 * b14) + (a22 * b24) + (a23 * b34) + (a24 * b44),
			n34 = (a31 * b14) + (a32 * b24) + (a33 * b34) + (a34 * b44),
			n44 = (a41 * b14) + (a42 * b24) + (a43 * b34) + (a44 * b44);

		const te = this.elements;
		te[0] = n11, te[1] = n21, te[2] = n31, te[3] = n41;
		te[4] = n12, te[5] = n22, te[6] = n32, te[7] = n42;
		te[8] = n13, te[9] = n23, te[10] = n33, te[11] = n43;
		te[12] = n14, te[13] = n24, te[14] = n34, te[15] = n44;
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
		te[0] = n11, te[1] = n21, te[2] = n31, te[3] = n41;
		te[4] = n12, te[5] = n22, te[6] = n32, te[7] = n42;
		te[8] = n13, te[9] = n23, te[10] = n33, te[11] = n43;
		te[12] = n14, te[13] = n24, te[14] = n34, te[15] = n44;
		return this;
	}

	transpose(): this {
		const te = this.elements;

		let temp;
		temp = te.safeAt(1), te[1] = te.safeAt(4), te[4] = temp;
		temp = te.safeAt(2), te[2] = te.safeAt(8), te[8] = temp;
		temp = te.safeAt(3), te[3] = te.safeAt(12), te[12] = temp;
		temp = te.safeAt(6), te[6] = te.safeAt(9), te[9] = temp;
		temp = te.safeAt(7), te[7] = te.safeAt(13), te[13] = temp;
		temp = te.safeAt(11), te[11] = te.safeAt(14), te[14] = temp;

		return this;
	}

	*[Symbol.iterator](): IterableIterator<number> {
		const te = this.elements;

		yield te.safeAt(0),
			yield te.safeAt(1),
			yield te.safeAt(2),
			yield te.safeAt(3);
		yield te.safeAt(4),
			yield te.safeAt(5),
			yield te.safeAt(6),
			yield te.safeAt(7);
		yield te.safeAt(8),
			yield te.safeAt(9),
			yield te.safeAt(10),
			yield te.safeAt(11);
		yield te.safeAt(12),
			yield te.safeAt(13),
			yield te.safeAt(14),
			yield te.safeAt(15);
	}
}
