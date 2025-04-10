import { Maths } from "./Maths.js";

export function createQuaternion(x = 0, y = 0, z = 0, w = 1) {
    const _q = {
        x,
        y,
        z,
        w,

        get length() {
            return Math.sqrt(_q.lengthSq);
        },
        get lengthSq() {
            return (
                (_q.x * _q.x) +
                (_q.y * _q.y) +
                (_q.z * _q.z) +
                (_q.w * _q.w)
            );
        },

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
        invert() {
            return _q.conjugate();
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
                    (m32 - m23) / s,
                    0.25 * s,
                    (m12 + m21) / s,
                    (m13 + m31) / s,
                );
            } else if (m22 > m33) {
                const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

                _q.set(
                    (m13 - m31) / s,
                    (m12 + m21) / s,
                    0.25 * s,
                    (m23 + m32) / s,
                );
            } else {
                const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

                _q.set(
                    (m21 - m12) / s,
                    (m13 + m31) / s,
                    (m23 + m32) / s,
                    0.25 * s,
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

            let cosHalfTheta = (w * qb.w) + (x * qb.x) + (y * qb.y) +
                (z * qb.z);
            if (cosHalfTheta < 0) {
                _q.set(-qb.w, -qb.x, -qb.y, -qb.z);
                cosHalfTheta = -cosHalfTheta;
            } else _q.copy(qb);
            if (cosHalfTheta >= 1.0) return _q.set(w, x, y, z);

            const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;
            if (sqrSinHalfTheta <= Maths.EPSILON) {
                const s = 1 - t;

                return _q.set(
                    (s * x) + (t * _q.x),
                    (s * y) + (t * _q.y),
                    (s * z) + (t * _q.z),
                    (s * w) + (t * _q.w),
                ).unit();
            }

            const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
            const halfTheta = Math.fastAtan2(sinHalfTheta, cosHalfTheta);
            const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
            const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

            return _q.set(
                (x * ratioA) + (_q.x * ratioB),
                (y * ratioA) + (_q.y * ratioB),
                (z * ratioA) + (_q.z * ratioB),
                (w * ratioA) + (_q.w * ratioB),
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
            const len = _q.length === 0 ? _q.identity() : 1 / _q.length;

            return _q.set(
                _q.x * len,
                _q.y * len,
                _q.z * len,
                _q.w * len,
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
