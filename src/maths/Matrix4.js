import { Maths } from "./Maths.js";

/**
 * @typedef {Object} Matrix4
 * @property {Float32Array} elements
 */

/**
 * @param {Float32Array} elements
 * @returns {Matrix4}
 */
export function createMatrix4(elements = new Float32Array(16)) {
    const _m = {
        /**
         * @type {Float32Array}
         */
        elements,

        /**
         * @returns {boolean}
         */
        get isMatrix4() {
            return true;
        },

        /**
         * @returns {number}
         */
        get determinant() {
            const te = _m.elements;

            const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
            const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
            const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
            const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];

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

            return (n11 * det11) - (n12 * det12) + (n13 * det13) -
                (n14 * det14);
        },

        /**
         * @returns {Matrix4}
         */
        clone() {
            return createMatrix4().copy(_m);
        },

        /**
         * @param {Vector3} position
         * @param {Quaternion} q
         * @param {Vector3} scale
         * @returns {Matrix4}
         */
        compose(position, q, scale) {
            const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
            const qx2 = qx + qx, qy2 = qy + qy, qz2 = qz + qz;

            const xx = qx * qx2, xy = qx * qy2, xz = qx * qz2;
            const yy = qy * qy2, yz = qy * qz2, zz = qz * qz2;
            const wx = qw * qx2, wy = qw * qy2, wz = qw * qz2;

            const sx = scale.x, sy = scale.y, sz = scale.z;

            return _m.set(
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
        },

        /**
         * @param {Matrix4} m
         * @returns {Matrix4}
         */
        copy(m) {
            const me = m.elements;
            return me === _m.elements ? _m : (_m.elements.set(me), _m);
        },

        /**
         * @param {Matrix4} m
         * @returns {Matrix4}
         */
        copyPosition(m) {
            const te = _m.elements, me = m.elements;

            te[12] = me[12];
            te[13] = me[13];
            te[14] = me[14];

            return _m;
        },

        /**
         * @param {Array<number>} array
         * @param {number} offset
         * @returns {Matrix4}
         */
        fromArray(array, offset = 0) {
            const te = _m.elements;
            te[0] = array[0 + offset], te[1] = array[1 + offset];
            te[2] = array[2 + offset], te[3] = array[3 + offset];
            te[4] = array[4 + offset], te[5] = array[5 + offset];
            te[6] = array[6 + offset], te[7] = array[7 + offset];
            te[8] = array[8 + offset], te[9] = array[9 + offset];
            te[10] = array[10 + offset], te[11] = array[11 + offset];
            te[12] = array[12 + offset], te[13] = array[13 + offset];
            te[14] = array[14 + offset], te[15] = array[15 + offset];

            return _m;
        },

        /**
         * @returns {Matrix4}
         */
        identity() {
            return _m.set(
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
        },

        /**
         * @returns {Matrix4}
         */
        invert() {
            const te = _m.elements;

            const n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3];
            const n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7];
            const n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11];
            const n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15];

            const t11 = (n23 * n34 * n42) - (n24 * n33 * n42) +
                (n24 * n32 * n43) - (n22 * n34 * n43) -
                (n23 * n32 * n44) + (n22 * n33 * n44);
            const t12 = (n14 * n33 * n42) - (n13 * n34 * n42) -
                (n14 * n32 * n43) +
                (n12 * n34 * n43) + (n13 * n32 * n44) - (n12 * n33 * n44);
            const t13 = (n13 * n24 * n42) - (n14 * n23 * n42) +
                (n14 * n22 * n43) -
                (n12 * n24 * n43) - (n13 * n22 * n44) + (n12 * n23 * n44);
            const t14 = (n14 * n23 * n32) - (n13 * n24 * n32) -
                (n14 * n22 * n33) +
                (n12 * n24 * n33) + (n13 * n22 * n34) - (n12 * n23 * n34);

            const det = (n11 * t11) + (n21 * t12) + (n31 * t13) + (n41 * t14);
            if (det === 0) {
                return _m.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            }
            const detInv = 1 / det;

            const m21 = ((n24 * n33 * n41) - (n23 * n34 * n41) -
                (n24 * n31 * n43) +
                (n21 * n34 * n43) + (n23 * n31 * n44) - (n21 * n33 * n44)) *
                detInv;
            const m31 = ((n22 * n34 * n41) - (n24 * n32 * n41) +
                (n24 * n31 * n42) - (n21 * n34 * n42) -
                (n22 * n31 * n44) + (n21 * n32 * n44)) *
                detInv;
            const m41 = ((n23 * n32 * n41) - (n22 * n33 * n41) -
                (n23 * n31 * n42) +
                (n21 * n33 * n42) + (n22 * n31 * n43) - (n21 * n32 * n43)) *
                detInv;

            const m12 = ((n13 * n34 * n41) - (n14 * n33 * n41) +
                (n14 * n31 * n43) - (n11 * n34 * n43) -
                (n13 * n31 * n44) + (n11 * n33 * n44)) *
                detInv;
            const m22 = ((n14 * n32 * n41) - (n12 * n34 * n41) -
                (n14 * n31 * n42) +
                (n11 * n34 * n42) + (n12 * n31 * n44) - (n11 * n32 * n44)) *
                detInv;
            const m32 = ((n12 * n33 * n41) - (n13 * n32 * n41) +
                (n13 * n31 * n42) - (n11 * n33 * n42) -
                (n12 * n31 * n43) + (n11 * n32 * n43)) *
                detInv;

            const m13 = ((n13 * n24 * n41) - (n14 * n23 * n41) -
                (n13 * n21 * n44) +
                (n11 * n24 * n43) + (n14 * n21 * n43) - (n11 * n23 * n44)) *
                detInv;
            const m23 = ((n12 * n24 * n41) - (n14 * n22 * n41) +
                (n14 * n21 * n42) - (n11 * n24 * n42) -
                (n12 * n21 * n44) + (n11 * n22 * n44)) *
                detInv;
            const m33 = ((n13 * n22 * n41) - (n12 * n23 * n41) -
                (n13 * n21 * n42) +
                (n11 * n23 * n42) + (n12 * n21 * n43) - (n11 * n22 * n43)) *
                detInv;

            const m14 = ((n13 * n24 * n31) - (n14 * n23 * n31) +
                (n14 * n21 * n33) - (n11 * n24 * n33) -
                (n13 * n21 * n34) + (n11 * n23 * n34)) *
                detInv;
            const m24 = ((n14 * n22 * n31) - (n12 * n24 * n31) -
                (n14 * n21 * n32) +
                (n11 * n24 * n32) + (n12 * n21 * n34) - (n11 * n22 * n34)) *
                detInv;
            const m34 = ((n12 * n23 * n31) - (n13 * n22 * n31) +
                (n13 * n21 * n32) - (n11 * n23 * n32) -
                (n12 * n21 * n33) + (n11 * n22 * n33)) *
                detInv;

            return _m.set(
                t11 * detInv,
                m21,
                m31,
                m41,
                t12 * detInv,
                m12,
                m22,
                m32,
                t13 * detInv,
                m13,
                m23,
                m33,
                t14 * detInv,
                m14,
                m24,
                m34,
            ).transpose();
        },

        /**
         * @param {Vector3} eye
         * @param {Vector3} target
         * @param {Vector3} up
         * @returns {Matrix4}
         */
        lookAt(eye, target, up) {
            const z = eye.clone().sub(target);
            if (z.lengthSq === 0) z.z = 1;
            z.unit();

            const x = up.clone().cross(z);
            if (x.lengthSq === 0) {
                Math.abs(up.z) === 1
                    ? z.x += Maths.EPSILON
                    : z.z += Maths.EPSILON;
                z.unit();

                x.copy(up).cross(z);
            }
            x.unit();

            const y = z.clone().cross(x);

            return _m.set(
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
        },

        /**
         * @param {number} size
         * @param {number} aspect
         * @param {number} near
         * @param {number} far
         * @returns {Matrix4}
         */
        makeOrthographic(size, aspect, near, far) {
            const left = -size * aspect, right = size * aspect;
            const top = size, bottom = -size;

            const lr = 1 / (left - right);
            const tb = 1 / (top - bottom);
            const nf = 1 / (near - far);

            return _m.set(
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
        },

        /**
         * @param {number} fov
         * @param {number} aspect
         * @param {number} near
         * @param {number} far
         * @returns {Matrix4}
         */
        makePerspective(fov, aspect, near, far) {
            const tHalfFov = Math.tan(fov * 0.5);

            const x = 1 / (aspect * tHalfFov);
            const y = 1 / tHalfFov;

            const c = -(far + near) / (far - near);
            const d = (-2 * far * near) / (far - near);

            return _m.set(
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
                d,
                0,
                0,
                -1,
                0,
            );
        },

        /**
         * @param {Quaternion} q
         * @returns {Matrix4}
         */
        makeRotationFromQuaternion(q) {
            const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
            const qx2 = qx + qx, y2 = qy + qy, z2 = qz + qz;

            const xx = qx * qx2, xy = qx * y2, xz = qx * z2;
            const yy = qy * y2, yz = qy * z2, zz = qz * z2;
            const wx = qw * qx2, wy = qw * y2, wz = qw * z2;

            return _m.set(
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
        },

        /**
         * @param {number} theta
         * @returns {Matrix4}
         */
        makeRotationX(theta) {
            const c = Math.cos(theta), s = Math.sin(theta);

            return _m.set(
                1,
                0,
                0,
                0,
                0,
                c,
                -s,
                0,
                0,
                s,
                c,
                0,
                0,
                0,
                0,
                1,
            );
        },

        /**
         * @param {number} theta
         * @returns {Matrix4}
         */
        makeRotationY(theta) {
            const c = Math.cos(theta), s = Math.sin(theta);

            return _m.set(
                c,
                0,
                s,
                0,
                0,
                1,
                0,
                0,
                -s,
                0,
                c,
                0,
                0,
                0,
                0,
                1,
            );
        },

        /**
         * @param {number} theta
         * @returns {Matrix4}
         */
        makeRotationZ(theta) {
            const c = Math.cos(theta), s = Math.sin(theta);

            return _m.set(
                c,
                -s,
                0,
                0,
                s,
                c,
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
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @returns {Matrix4}
         */
        makeScale(x, y, z) {
            return _m.set(
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
                z,
                0,
                0,
                0,
                0,
                1,
            );
        },

        /**
         * @param {number} xy
         * @param {number} xz
         * @param {number} yx
         * @param {number} yz
         * @param {number} zx
         * @param {number} zy
         * @returns {Matrix4}
         */
        makeShear(xy, xz, yx, yz, zx, zy) {
            return _m.set(
                1,
                yx,
                zx,
                0,
                xy,
                1,
                zy,
                0,
                xz,
                yz,
                1,
                0,
                0,
                0,
                0,
                1,
            );
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @returns {Matrix4}
         */
        makeTranslation(x, y, z) {
            return _m.set(
                1,
                0,
                0,
                x,
                0,
                1,
                0,
                y,
                0,
                0,
                1,
                z,
                0,
                0,
                0,
                1,
            );
        },

        /**
         * @param {Matrix4} m
         * @returns {Matrix4}
         */
        mul(m) {
            return _m.mulMatrices(_m, m);
        },

        /**
         * @param {Matrix4} a
         * @param {Matrix4} b
         * @returns {Matrix4}
         */
        mulMatrices(a, b) {
            const ae = a.elements, be = b.elements;

            const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
            const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
            const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
            const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

            const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
            const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
            const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
            const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

            return _m.set(
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
        },

        /**
         * @param {number} s
         * @returns {Matrix4}
         */
        mulScalar(s) {
            const te = _m.elements;

            return _m.set(
                te[0] * s,
                te[4] * s,
                te[8] * s,
                te[12] * s,
                te[1] * s,
                te[5] * s,
                te[9] * s,
                te[13] * s,
                te[2] * s,
                te[6] * s,
                te[10] * s,
                te[14] * s,
                te[3] * s,
                te[7] * s,
                te[11] * s,
                te[15] * s,
            );
        },

        /**
         * @param {Matrix4} m
         * @returns {Matrix4}
         */
        premul(m) {
            return _m.mulMatrices(m, _m);
        },

        /**
         * @param {Vector3} v
         * @returns {Matrix4}
         */
        scale(v) {
            const x = v.x, y = v.y, z = v.z;

            const te = _m.elements;
            te[0] *= x, te[4] *= y, te[8] *= z;
            te[1] *= x, te[5] *= y, te[9] *= z;
            te[2] *= x, te[6] *= y, te[10] *= z;
            te[3] *= x, te[7] *= y, te[11] *= z;
            return _m;
        },

        /**
         * @param {number} n11
         * @param {number} n12
         * @param {number} n13
         * @param {number} n14
         * @param {number} n21
         * @param {number} n22
         * @param {number} n23
         * @param {number} n24
         * @param {number} n31
         * @param {number} n32
         * @param {number} n33
         * @param {number} n34
         * @param {number} n41
         * @param {number} n42
         * @param {number} n43
         * @param {number} n44
         * @returns {Matrix4}
         */
        set(
            n11,
            n12,
            n13,
            n14,
            n21,
            n22,
            n23,
            n24,
            n31,
            n32,
            n33,
            n34,
            n41,
            n42,
            n43,
            n44,
        ) {
            const te = _m.elements;
            te[0] = n11, te[4] = n12, te[8] = n13, te[12] = n14;
            te[1] = n21, te[5] = n22, te[9] = n23, te[13] = n24;
            te[2] = n31, te[6] = n32, te[10] = n33, te[14] = n34;
            te[3] = n41, te[7] = n42, te[11] = n43, te[15] = n44;
            return _m;
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @returns {Matrix4}
         */
        setPosition(x, y, z) {
            const te = _m.elements;
            te[12] = x, te[13] = y, te[14] = z;
            return _m;
        },

        /**
         * @param {Array<number>} array
         * @param {number} offset
         * @returns {Array<number>}
         */
        toArray(array = [], offset = 0) {
            const te = _m.elements;

            array[offset + 0] = te[0], array[offset + 1] = te[1];
            array[offset + 2] = te[2], array[offset + 3] = te[3];
            array[offset + 4] = te[4], array[offset + 5] = te[5];
            array[offset + 6] = te[6], array[offset + 7] = te[7];
            array[offset + 8] = te[8], array[offset + 9] = te[9];
            array[offset + 10] = te[10], array[offset + 11] = te[11];
            array[offset + 12] = te[12], array[offset + 13] = te[13];
            array[offset + 14] = te[14], array[offset + 15] = te[15];
            return array;
        },

        /**
         * @returns {Matrix4}
         */
        transpose() {
            const te = _m.elements;

            let temp;
            temp = te[1], te[1] = te[4], te[4] = temp;
            temp = te[2], te[2] = te[8], te[8] = temp;
            temp = te[3], te[3] = te[12], te[12] = temp;
            temp = te[6], te[6] = te[9], te[9] = temp;
            temp = te[7], te[7] = te[13], te[13] = temp;
            temp = te[11], te[11] = te[14], te[14] = temp;

            return _m;
        },

        *[Symbol.iterator]() {
            const te = _m.elements;
            yield te[0], yield te[1], yield te[2], yield te[3];
            yield te[4], yield te[5], yield te[6], yield te[7];
            yield te[8], yield te[9], yield te[10], yield te[11];
            yield te[12], yield te[13], yield te[14], yield te[15];
        },
    };
    _m.identity();
    return _m;
}

export const Matrix4 = {
    // statics go here
};
