import { Maths } from "./Maths.js";

export function createQuaternion(x = 0, y = 0, z = 0, w = 1) {
    const _q = {
        /**
         * @type {number}
         */
        x,

        /**
         * @type {number}
         */
        y,

        /**
         * @type {number}
         */
        z,

        /**
         * @type {number}
         */
        w,

        /**
         * @type {boolean}
         */
        get isQuaternion() {
            return true;
        },

        /**
         * @type {number}
         */
        get length() {
            return Math.sqrt(_q.lengthSq);
        },

        /**
         * @type {number}
         */
        get lengthSq() {
            return (
                (_q.x * _q.x) +
                (_q.y * _q.y) +
                (_q.z * _q.z) +
                (_q.w * _q.w)
            );
        },

        /**
         * @param {Quaternion} q
         * @returns {number}
         */
        angleTo(q) {
            return 2 * Math.acos(Math.abs(Maths.clamp(_q.dot(q), -1, 1)));
        },

        clone() {
            return createQuaternion().copy(_q);
        },
        conjugate() {
            return _q.set(-_q.x, -_q.y, -_q.z, _q.w);
        },
        copy(q) {
            return q === undefined ? _q : _q.set(q.x, q.y, q.z, q.w);
        },

        dot(q) {
            return (_q.x * q.x) + (_q.y * q.y) + (_q.z * q.z) + (_q.w * q.w);
        },

        equals(q) {
            return (
                (q.x === _q.x) &&
                (q.y === _q.y) &&
                (q.z === _q.z) &&
                (q.w === _q.w)
            );
        },

        fromArray(array, offset = 0) {
            return _q.set(
                array[offset],
                array[offset + 1],
                array[offset + 2],
                array[offset + 3],
            );
        },

        identity() {
            return _q.set(0, 0, 0, 1);
        },

        mul(q) {
            return _q.mulQuaternions(_q, q);
        },
        mulQuaternions(a, b) {
            const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
            const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

            return _q.set(
                (qax * qbw) + (qaw * qbx) + (qay * qbz) - (qaz * qby),
                (qay * qbw) + (qaw * qby) + (qaz * qbx) - (qax * qbz),
                (qaz * qbw) + (qaw * qbz) + (qax * qby) - (qay * qbx),
                (qaw * qbw) - (qax * qbx) - (qay * qby) - (qaz * qbz),
            );
        },

        premul(q) {
            return _q.mulQuaternions(q, _q);
        },

        random() {
            const u1 = Math.random(), u2 = Math.random(), u3 = Math.random();

            const sqrt1MinusU1 = Math.sqrt(1 - u1), sqrtU1 = Math.sqrt(u1);

            return _q.set(
                sqrt1MinusU1 * Math.sin(Maths.TAU * u2),
                sqrt1MinusU1 * Math.cos(Maths.TAU * u2),
                sqrtU1 * Math.sin(Maths.TAU * u3),
                sqrtU1 * Math.cos(Maths.TAU * u3),
            );
        },
        rotateTowards(q, step) {
            const angle = _q.angleTo(q);
            if (angle === 0) return _q;

            const t = Math.min(1, step / angle);
            return _q.slerp(q, t);
        },
        rotateVector3(v) {
            return createVector3(v.x, v.y, v.z).applyQuaternion(_q);
        },

        set(x, y, z, w) {
            _q.x = x, _q.y = y, _q.z = z, _q.w = w;
            return _q;
        },
        setFromAxisAngle(axis, angle) {
            const halfAngle = angle / 2;
            const s = Math.sin(halfAngle);

            return _q.set(
                axis.x * s,
                axis.y * s,
                axis.z * s,
                Math.cos(halfAngle),
            );
        },
        setFromEuler(euler) {
            const c1 = Math.cos(euler.x / 2),
                c2 = Math.cos(euler.y / 2),
                c3 = Math.cos(euler.z / 2);
            const s1 = Math.sin(euler.x / 2),
                s2 = Math.sin(euler.y / 2),
                s3 = Math.sin(euler.z / 2);

            const order = euler.order || "XYZ";
            switch (order) {
                case "XYZ":
                    _q.set(
                        (s1 * c2 * c3) + (c1 * s2 * s3),
                        (c1 * s2 * c3) - (s1 * c2 * s3),
                        (c1 * c2 * s3) + (s1 * s2 * c3),
                        (c1 * c2 * c3) - (s1 * s2 * s3),
                    );
                    break;
                case "YXZ":
                    _q.set(
                        (s1 * c2 * c3) + (c1 * s2 * s3),
                        (c1 * s2 * c3) - (s1 * c2 * s3),
                        (c1 * c2 * s3) - (s1 * s2 * c3),
                        (c1 * c2 * c3) + (s1 * s2 * s3),
                    );
                    break;
                case "ZXY":
                    _q.set(
                        (s1 * c2 * c3) - (c1 * s2 * s3),
                        (c1 * s2 * c3) + (s1 * c2 * s3),
                        (c1 * c2 * s3) + (s1 * s2 * c3),
                        (c1 * c2 * c3) - (s1 * s2 * s3),
                    );
                    break;
                case "ZYX":
                    _q.set(
                        (s1 * c2 * c3) - (c1 * s2 * s3),
                        (c1 * s2 * c3) + (s1 * c2 * s3),
                        (c1 * c2 * s3) - (s1 * s2 * c3),
                        (c1 * c2 * c3) + (s1 * s2 * s3),
                    );
                    break;
                case "YZX":
                    _q.set(
                        (s1 * c2 * c3) + (c1 * s2 * s3),
                        (c1 * s2 * c3) + (s1 * c2 * s3),
                        (c1 * c2 * s3) - (s1 * s2 * c3),
                        (c1 * c2 * c3) - (s1 * s2 * s3),
                    );
                    break;
                case "XZY":
                    _q.set(
                        (s1 * c2 * c3) - (c1 * s2 * s3),
                        (c1 * s2 * c3) - (s1 * c2 * s3),
                        (c1 * c2 * s3) + (s1 * s2 * c3),
                        (c1 * c2 * c3) + (s1 * s2 * s3),
                    );
                    break;
            }

            return _q;
        },
        setFromRotationMatrix(m) {
            const te = m.elements;

            const m11 = te[0], m12 = te[4], m13 = te[8];
            const m21 = te[1], m22 = te[5], m23 = te[9];
            const m31 = te[2], m32 = te[6], m33 = te[10];

            const trace = m11 + m22 + m33;
            if (trace > 0) {
                const s = 0.5 / Math.sqrt(trace + 1.0);

                _q.set(
                    (m32 - m23) * s,
                    (m13 - m31) * s,
                    (m21 - m12) * s,
                    0.25 / s,
                );
            } else if (m11 > m22 && m11 > m33) {
                const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

                _q.set(
                    0.25 * s,
                    (m12 + m21) / s,
                    (m13 + m31) / s,
                    (m32 - m23) / s,
                );
            } else if (m22 > m33) {
                const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

                _q.set(
                    (m12 + m21) / s,
                    0.25 * s,
                    (m23 + m32) / s,
                    (m13 - m31) / s,
                );
            } else {
                const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

                _q.set(
                    (m13 + m31) / s,
                    (m23 + m32) / s,
                    0.25 * s,
                    (m21 - m12) / s,
                );
            }

            return _q;
        },
        setFromUnitVectors(vFrom, vTo) {
            let r = vFrom.dot(vTo) + 1;
            if (r < Maths.EPSILON) {
                r = 0;
                Math.abs(vFrom.x) > Math.abs(vFrom.z)
                    ? _q.set(-vFrom.y, vFrom.x, 0, r)
                    : _q.set(0, -vFrom.z, vFrom.y, r);
            } else {
                _q.set(
                    (vFrom.y * vTo.z) - (vFrom.z * vTo.y),
                    (vFrom.z * vTo.x) - (vFrom.x * vTo.z),
                    (vFrom.x * vTo.y) - (vFrom.y * vTo.x),
                    r,
                );
            }

            return _q.unit();
        },
        slerp(qb, t) {
            if (t === 0) return _q;
            if (t === 1) return _q.copy(qb);

            const x = _q.x, y = _q.y, z = _q.z, w = _q.w;
            const qbx = qb.x, qby = qb.y, qbz = qb.z, qbw = qb.w;

            let cHalfTheta = (w * qbw) + (x * qbx) + (y * qby) + (z * qbz);

            let bx = qbx, by = qby, bz = qbz, bw = qbw;
            if (cHalfTheta < 0) {
                cHalfTheta = -cHalfTheta;
                bx = -qbx;
                by = -qby;
                bz = -qbz;
                bw = -qbw;
            }
            if (cHalfTheta >= 0.999) {
                return _q.set(
                    x + t * (bx - x),
                    y + t * (by - y),
                    z + t * (bz - z),
                    w + t * (bw - w),
                ).unit();
            }

            const sHalfTheta = Math.sqrt(1.0 - cHalfTheta * cHalfTheta);
            const halfTheta = Maths.fastAtan2(sHalfTheta, cHalfTheta);
            const ratioA = Math.sin((1 - t) * halfTheta) / sHalfTheta;
            const ratioB = Math.sin(t * halfTheta) / sHalfTheta;

            return _q.set(
                (x * ratioA) + (bx * ratioB),
                (y * ratioA) + (by * ratioB),
                (z * ratioA) + (bz * ratioB),
                (w * ratioA) + (bw * ratioB),
            );
        },

        toArray(array = [], offset = 0) {
            array[offset] = _q.x;
            array[offset + 1] = _q.y;
            array[offset + 2] = _q.z;
            array[offset + 3] = _q.w;
            return array;
        },

        toMatrix4() {
            return createMatrix4().makeRotationFromQuaternion(_q);
        },

        unit() {
            const length = _q.length === 0 ? _q.identity() : 1 / _q.length;

            return _q.set(
                _q.x * length,
                _q.y * length,
                _q.z * length,
                _q.w * length,
            );
        },

        *[Symbol.iterator]() {
            yield _q.x, yield _q.y, yield _q.z, yield _q.w;
        },
    };
    return _q;
}

export const Quaternion = {
    fromAxisAngle(axis, angle) {
        return createQuaternion().setFromAxisAngle(axis, angle);
    },
    fromEuler(euler) {
        return createQuaternion().setFromEuler(euler);
    },
    fromRotationMatrix(m) {
        return createQuaternion().setFromRotationMatrix(m);
    },
    fromUnitVectors(vFrom, vTo) {
        return createQuaternion().setFromUnitVectors(vFrom, vTo);
    },

    slerp(qa, qb, qm, t) {
        return qm.copy(qa).slerp(qb, t);
    },
};
