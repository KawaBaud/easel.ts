import { fromArray } from "../utils.ts";
import { MathUtils } from "./MathUtils.ts";
import type { Quaternion } from "./Quaternion.ts";
import type { Vector3 } from "./Vector3.ts";

export class Matrix4 {
	constructor(public elements = new Float32Array(16)) {
		this.identity();
	}

	clone(): Matrix4 {
		return new Matrix4().copy(this);
	}

	compose(position: Vector3, q: Quaternion, scale: Vector3): this {
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

		const sx = scale.x;
		const sy = scale.y;
		const sz = scale.z;

		return this.set(
			(1 - (yy + zz)) * sx,
			(xy + wz) * sx,
			(xz - wy) * sx,
			position.x,
			(xy - wz) * sy,
			(1 - (xx + zz)) * sy,
			(yz + wx) * sy,
			position.y,
			(xz + wy) * sz,
			(yz - wx) * sz,
			(1 - (xx + yy)) * sz,
			position.z,
			0,
			0,
			0,
			1,
		);
	}

	copy(m: Matrix4): this {
		const me = m.elements;
		if (me === this.elements) return this;

		this.elements.set(me);
		return this;
	}

	decompose(position: Vector3, q: Quaternion, scale: Vector3): this {
		const te = this.elements;

		let sx = Math.hypot(
			fromArray(te, 0),
			fromArray(te, 1),
			fromArray(te, 2),
		);
		const sy = Math.hypot(
			fromArray(te, 4),
			fromArray(te, 5),
			fromArray(te, 6),
		);
		const sz = Math.hypot(
			fromArray(te, 8),
			fromArray(te, 9),
			fromArray(te, 10),
		);

		const det = this.determinant();
		if (det < 0) sx = -sx;

		position.x = fromArray(te, 12);
		position.y = fromArray(te, 13);
		position.z = fromArray(te, 14);
		const sxInv = 1 / sx;
		const syInv = 1 / sy;
		const szInv = 1 / sz;

		const r11 = fromArray(te, 0) * sxInv;
		const r12 = fromArray(te, 4) * syInv;
		const r13 = fromArray(te, 8) * szInv;
		const r21 = fromArray(te, 1) * sxInv;
		const r22 = fromArray(te, 5) * syInv;
		const r23 = fromArray(te, 9) * szInv;
		const r31 = fromArray(te, 2) * sxInv;
		const r32 = fromArray(te, 6) * syInv;
		const r33 = fromArray(te, 10) * szInv;
		const trace = r11 + r22 + r33;
		let s;
		if (trace > 0) {
			s = 0.5 / Math.sqrt(trace + 1.0);
			q.w = 0.25 / s;
			q.x = (r32 - r23) * s;
			q.y = (r13 - r31) * s;
			q.z = (r21 - r12) * s;
		} else if (r11 > r22 && r11 > r33) {
			s = 2.0 * Math.sqrt(1.0 + r11 - r22 - r33);
			q.w = (r32 - r23) / s;
			q.x = 0.25 * s;
			q.y = (r12 + r21) / s;
			q.z = (r13 + r31) / s;
		} else if (r22 > r33) {
			s = 2.0 * Math.sqrt(1.0 + r22 - r11 - r33);
			q.w = (r13 - r31) / s;
			q.x = (r12 + r21) / s;
			q.y = 0.25 * s;
			q.z = (r23 + r32) / s;
		} else {
			s = 2.0 * Math.sqrt(1.0 + r33 - r11 - r22);
			q.w = (r21 - r12) / s;
			q.x = (r13 + r31) / s;
			q.y = (r23 + r32) / s;
			q.z = 0.25 * s;
		}

		scale.x = sx;
		scale.y = sy;
		scale.z = sz;

		return this;
	}

	determinant(): number {
		const te = this.elements;

		const n11 = fromArray(te, 0);
		const n12 = fromArray(te, 4);
		const n13 = fromArray(te, 8);
		const n14 = fromArray(te, 12);
		const n21 = fromArray(te, 1);
		const n22 = fromArray(te, 5);
		const n23 = fromArray(te, 9);
		const n24 = fromArray(te, 13);
		const n31 = fromArray(te, 2);
		const n32 = fromArray(te, 6);
		const n33 = fromArray(te, 10);
		const n34 = fromArray(te, 14);
		const n41 = fromArray(te, 3);
		const n42 = fromArray(te, 7);
		const n43 = fromArray(te, 11);
		const n44 = fromArray(te, 15);

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

	identity(): this {
		return this.set(
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
		);
	}

	invert(): this {
		const te = this.elements;

		const n11 = fromArray(te, 0);
		const n12 = fromArray(te, 4);
		const n13 = fromArray(te, 8);
		const n14 = fromArray(te, 12);
		const n21 = fromArray(te, 1);
		const n22 = fromArray(te, 5);
		const n23 = fromArray(te, 9);
		const n24 = fromArray(te, 13);
		const n31 = fromArray(te, 2);
		const n32 = fromArray(te, 6);
		const n33 = fromArray(te, 10);
		const n34 = fromArray(te, 14);
		const n41 = fromArray(te, 3);
		const n42 = fromArray(te, 7);
		const n43 = fromArray(te, 11);
		const n44 = fromArray(te, 15);

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

		const det = (n11 * det11) - (n12 * det12) + (n13 * det13) -
			(n14 * det14);
		if (det === 0) {
			return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		}

		const invDet = 1 / det;

		const t7 = (n13 * n24) - (n14 * n23);
		const t8 = (n12 * n24) - (n14 * n22);
		const t9 = (n12 * n23) - (n13 * n22);
		const t10 = (n11 * n24) - (n14 * n21);
		const t11 = (n11 * n23) - (n13 * n21);
		const t12 = (n11 * n22) - (n12 * n21);

		const t19 = (n23 * n34) - (n24 * n33);
		const t20 = (n22 * n34) - (n24 * n32);
		const t21 = (n22 * n33) - (n23 * n32);
		const t22 = (n21 * n34) - (n24 * n31);
		const t23 = (n21 * n33) - (n23 * n31);
		const t24 = (n21 * n32) - (n22 * n31);

		return this.set(
			det11 * invDet,
			-((n12 * t1) - (n13 * t2) + (n14 * t3)) * invDet,
			((n12 * t4) - (n13 * t5) + (n14 * t6)) * invDet,
			-((n12 * t19) - (n13 * t20) + (n14 * t21)) * invDet,
			-det12 * invDet,
			((n11 * t1) - (n13 * t7) + (n14 * t9)) * invDet,
			-((n11 * t4) - (n13 * t10) + (n14 * t11)) * invDet,
			((n11 * t19) - (n13 * t22) + (n14 * t23)) * invDet,
			det13 * invDet,
			-((n11 * t2) - (n12 * t7) + (n14 * t8)) * invDet,
			((n11 * t5) - (n12 * t10) + (n14 * t12)) * invDet,
			-((n11 * t20) - (n12 * t22) + (n14 * t24)) * invDet,
			-det14 * invDet,
			((n11 * t3) - (n12 * t9) + (n13 * t8)) * invDet,
			-((n11 * t6) - (n12 * t11) + (n13 * t12)) * invDet,
			((n11 * t21) - (n12 * t23) + (n13 * t24)) * invDet,
		);
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

		return this.set(
			x.x,
			y.x,
			z.x,
			0,
			x.y,
			y.y,
			z.y,
			0,
			x.z,
			y.z,
			z.z,
			0,
			0,
			0,
			0,
			1,
		);
	}

	makeOrthographic(
		left: number,
		right: number,
		top: number,
		bottom: number,
		near: number,
		far: number,
	): this {
		const lr = 1 / (left - right);
		const tb = 1 / (top - bottom);
		const nf = 1 / (near - far);

		return this.set(
			-2 * lr,
			0,
			0,
			(left + right) * lr,
			0,
			-2 * tb,
			0,
			(top + bottom) * tb,
			0,
			0,
			2 * nf,
			(far + near) * nf,
			0,
			0,
			0,
			1,
		);
	}

	makePerspective(
		fov: number,
		aspect: number,
		near: number,
		far: number,
	): this {
		const tHalfFov = Math.tan(fov * 0.5);

		const x = 1 / (aspect * tHalfFov);
		const y = 1 / tHalfFov;

		const c = far === Infinity ? -1 : -(far + near) / (far - near);
		const d = far === Infinity ? -2 * near : (-2 * far * near) / (far - near);

		return this.set(
			x,
			0,
			0,
			0,
			0,
			y,
			0,
			0,
			0,
			0,
			c,
			-1,
			0,
			0,
			d,
			0,
		);
	}

	makeRotationFromQuaternion(q: Quaternion): this {
		const { x: qx, y: qy, z: qz, w: qw } = q;
		const qx2 = qx + qx;
		const y2 = qy + qy;
		const z2 = qz + qz;

		const xx = qx * qx2;
		const xy = qx * y2;
		const xz = qx * z2;
		const yy = qy * y2;
		const yz = qy * z2;
		const zz = qz * z2;
		const wx = qw * qx2;
		const wy = qw * y2;
		const wz = qw * z2;

		return this.set(
			1 - (yy + zz),
			xy + wz,
			xz - wy,
			0,
			xy - wz,
			1 - (xx + zz),
			yz + wx,
			0,
			xz + wy,
			yz - wx,
			1 - (xx + yy),
			0,
			0,
			0,
			0,
			1,
		);
	}

	mulMatrices(a: Matrix4, b: Matrix4): this {
		const ae = a.elements;
		const be = b.elements;

		const a11 = fromArray(ae, 0);
		const a12 = fromArray(ae, 4);
		const a13 = fromArray(ae, 8);
		const a14 = fromArray(ae, 12);
		const a21 = fromArray(ae, 1);
		const a22 = fromArray(ae, 5);
		const a23 = fromArray(ae, 9);
		const a24 = fromArray(ae, 13);
		const a31 = fromArray(ae, 2);
		const a32 = fromArray(ae, 6);
		const a33 = fromArray(ae, 10);
		const a34 = fromArray(ae, 14);
		const a41 = fromArray(ae, 3);
		const a42 = fromArray(ae, 7);
		const a43 = fromArray(ae, 11);
		const a44 = fromArray(ae, 15);

		const b11 = fromArray(be, 0);
		const b12 = fromArray(be, 4);
		const b13 = fromArray(be, 8);
		const b14 = fromArray(be, 12);
		const b21 = fromArray(be, 1);
		const b22 = fromArray(be, 5);
		const b23 = fromArray(be, 9);
		const b24 = fromArray(be, 13);
		const b31 = fromArray(be, 2);
		const b32 = fromArray(be, 6);
		const b33 = fromArray(be, 10);
		const b34 = fromArray(be, 14);
		const b41 = fromArray(be, 3);
		const b42 = fromArray(be, 7);
		const b43 = fromArray(be, 11);
		const b44 = fromArray(be, 15);

		return this.set(
			(a11 * b11) + (a12 * b21) + (a13 * b31) + (a14 * b41),
			(a11 * b12) + (a12 * b22) + (a13 * b32) + (a14 * b42),
			(a11 * b13) + (a12 * b23) + (a13 * b33) + (a14 * b43),
			(a11 * b14) + (a12 * b24) + (a13 * b34) + (a14 * b44),
			(a21 * b11) + (a22 * b21) + (a23 * b31) + (a24 * b41),
			(a21 * b12) + (a22 * b22) + (a23 * b32) + (a24 * b42),
			(a21 * b13) + (a22 * b23) + (a23 * b33) + (a24 * b43),
			(a21 * b14) + (a22 * b24) + (a23 * b34) + (a24 * b44),
			(a31 * b11) + (a32 * b21) + (a33 * b31) + (a34 * b41),
			(a31 * b12) + (a32 * b22) + (a33 * b32) + (a34 * b42),
			(a31 * b13) + (a32 * b23) + (a33 * b33) + (a34 * b43),
			(a31 * b14) + (a32 * b24) + (a33 * b34) + (a34 * b44),
			(a41 * b11) + (a42 * b21) + (a43 * b31) + (a44 * b41),
			(a41 * b12) + (a42 * b22) + (a43 * b32) + (a44 * b42),
			(a41 * b13) + (a42 * b23) + (a43 * b33) + (a44 * b43),
			(a41 * b14) + (a42 * b24) + (a43 * b34) + (a44 * b44),
		);
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
		te[4] = n12;
		te[8] = n13;
		te[12] = n14;
		te[1] = n21;
		te[5] = n22;
		te[9] = n23;
		te[13] = n24;
		te[2] = n31;
		te[6] = n32;
		te[10] = n33;
		te[14] = n34;
		te[3] = n41;
		te[7] = n42;
		te[11] = n43;
		te[15] = n44;
		return this;
	}

	transpose(): this {
		const te = this.elements;

		let temp;
		temp = fromArray(te, 1);
		te[1] = fromArray(te, 4);
		te[4] = temp;
		temp = fromArray(te, 2);
		te[2] = fromArray(te, 8);
		te[8] = temp;
		temp = fromArray(te, 3);
		te[3] = fromArray(te, 12);
		te[12] = temp;
		temp = fromArray(te, 6);
		te[6] = fromArray(te, 9);
		te[9] = temp;
		temp = fromArray(te, 7);
		te[7] = fromArray(te, 13);
		te[13] = temp;
		temp = fromArray(te, 11);
		te[11] = fromArray(te, 14);
		te[14] = temp;
		return this;
	}

	*[Symbol.iterator](): IterableIterator<number> {
		const te = this.elements;

		yield fromArray(te, 0);
		yield fromArray(te, 1);
		yield fromArray(te, 2);
		yield fromArray(te, 3);
		yield fromArray(te, 4);
		yield fromArray(te, 5);
		yield fromArray(te, 6);
		yield fromArray(te, 7);
		yield fromArray(te, 8);
		yield fromArray(te, 9);
		yield fromArray(te, 10);
		yield fromArray(te, 11);
		yield fromArray(te, 12);
		yield fromArray(te, 13);
		yield fromArray(te, 14);
		yield fromArray(te, 15);
	}
}
