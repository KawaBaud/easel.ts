import { Maths } from "./Maths.js";

export function createVector3(x = 0, y = 0, z = 0) {
    const _v = {
        x,
        y,
        z,

        get length() {
            return Math.sqrt(_v.lengthSq);
        },
        get lengthSq() {
            return (_v.x * _v.x) + (_v.y * _v.y) + (_v.z * _v.z);
        },

        add(v) {
            _v.x += v.x, _v.y += v.y, _v.z += v.z;
            return _v;
        },
        addScalar(s) {
            _v.x += s, _v.y += s, _v.z += s;
            return _v;
        },
        addVectors(a, b) {
            return _v.set(a.x + b.x, a.y + b.y, a.z + b.z);
        },
        angle(a, b) {
            return Math.acos(a.dot(b) / (a.length * b.length));
        },
        angleTo(v) {
            const denom = Math.sqrt(_v.lengthSq * v.lengthSq);
            if (denom === 0) return Maths.TAU;

            const theta = _v.dot(v) / denom;
            return Math.acos(Maths.clamp(theta, -1, 1));
        },
        applyMatrix4(m) {
            const me = m.elements;

            const w = (me[3] * _v.x) + (me[7] * _v.y) + (me[11] * _v.z) +
                me[15];
            const iw = w !== 0 ? 1 / w : 1;

            return _v.set(
                ((me[0] * _v.x) + (me[4] * _v.y) + (me[8] * _v.z) + me[12]) *
                    iw,
                ((me[1] * _v.x) + (me[5] * _v.y) + (me[9] * _v.z) + me[13]) *
                    iw,
                ((me[2] * _v.x) + (me[6] * _v.y) + (me[10] * _v.z) + me[14]) *
                    iw,
            );
        },
        applyQuaternion(q) {
            const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
            const ix = (qw * _v.x) + (qy * _v.z) - (qz * _v.y),
                iy = (qw * _v.y) + (qz * _v.x) - (qx * _v.z),
                iz = (qw * _v.z) + (qx * _v.y) - (qy * _v.x),
                iw = (-qx * _v.x) - (qy * _v.y) - (qz * _v.z);

            return _v.set(
                (ix * qw) + (iw * -qx) + (iy * -qz) - (iz * -qy),
                (iy * qw) + (iw * -qy) + (iz * -qx) - (ix * -qz),
                (iz * qw) + (iw * -qz) + (ix * -qy) - (iy * -qx),
            );
        },

        ceil() {
            return _v.set(
                Maths.fastCeil(_v.x),
                Maths.fastCeil(_v.y),
                Maths.fastCeil(_v.z),
            );
        },
        clamp(min, max) {
            return _v.max(min).min(max);
        },
        clampScalar(min, max) {
            return _v.set(
                Maths.clamp(_v.x, min, max),
                Maths.clamp(_v.y, min, max),
                Maths.clamp(_v.z, min, max),
            );
        },
        clone() {
            return createVector3().copy(_v);
        },
        copy(v) {
            return v === undefined ? _v : _v.set(v.x, v.y, v.z);
        },
        cross(v) {
            return _v.crossVectors(_v, v);
        },
        crossVectors(a, b) {
            const ax = a.x, ay = a.y, az = a.z;
            const bx = b.x, by = b.y, bz = b.z;

            return _v.set(
                (ay * bz) - (az * by),
                (az * bx) - (ax * bz),
                (ax * by) - (ay * bx),
            );
        },

        distanceTo(v) {
            return Math.sqrt(_v.distanceSqTo(v));
        },
        distanceSqTo(v) {
            const dx = _v.x - v.x, dy = _v.y - v.y, dz = _v.z - v.z;
            return (dx * dx) + (dy * dy) + (dz * dz);
        },
        div(v) {
            _v.x /= v.x, _v.y /= v.y, _v.z /= v.z;
            return _v;
        },
        divScalar(s) {
            _v.x /= s, _v.y /= s, _v.z /= s;
            return _v;
        },
        divVectors(a, b) {
            return _v.set(a.x / b.x, a.y / b.y, a.z / b.z);
        },
        dot(v) {
            return (_v.x * v.x) + (_v.y * v.y) + (_v.z * v.z);
        },

        equals(v) {
            return (
                (_v.x === v.x) &&
                (_v.y === v.y) &&
                (_v.z === v.z)
            );
        },

        fromArray(array, offset = 0) {
            return _v.set(
                array[offset],
                array[offset + 1],
                array[offset + 2],
            );
        },

        lerp(v, alpha) {
            _v.x += (v.x - _v.x) * alpha;
            _v.y += (v.y - _v.y) * alpha;
            _v.z += (v.z - _v.z) * alpha;
            return _v;
        },
        lerpVectors(v1, v2, alpha) {
            return _v.set(
                v1.x + (v2.x - v1.x) * alpha,
                v1.y + (v2.y - v1.y) * alpha,
                v1.z + (v2.z - v1.z) * alpha,
            );
        },

        max(v) {
            return _v.set(
                Math.max(_v.x, v.x),
                Math.max(_v.y, v.y),
                Math.max(_v.z, v.z),
            );
        },
        min(v) {
            return _v.set(
                Math.min(_v.x, v.x),
                Math.min(_v.y, v.y),
                Math.min(_v.z, v.z),
            );
        },
        mul(v) {
            _v.x *= v.x, _v.y *= v.y, _v.z *= v.z;
            return _v;
        },
        mulScalar(s) {
            _v.x *= s, _v.y *= s, _v.z *= s;
            return _v;
        },
        mulVectors(a, b) {
            return _v.set(a.x * b.x, a.y * b.y, a.z * b.z);
        },

        neg() {
            return _v.set(-_v.x, -_v.y, -_v.z);
        },

        project(camera) {
            return _v
                .applyMatrix4(camera.matrixWorldInverse)
                .applyMatrix4(camera.projectionMatrix);
        },
        projectOnto(v) {
            const denom = v.lengthSq;
            if (denom === 0) return _v.set(0, 0, 0);

            const scalar = v.dot(_v) / denom;
            return _v.copy(v).mulScalar(scalar);
        },

        reflect(normal) {
            return _v.sub(normal.mulScalar(2 * _v.dot(normal)));
        },

        set(x, y, z) {
            if (z === undefined) z = _v.z;
            _v.x = x, _v.y = y, _v.z = z;
            return _v;
        },
        setFromArray(array, offset = 0) {
            return _v.fromArray(array, offset);
        },
        setScalar(s) {
            return _v.set(s, s, s);
        },
        sub(v) {
            _v.x -= v.x, _v.y -= v.y, _v.z -= v.z;
            return _v;
        },
        subScalar(s) {
            _v.x -= s, _v.y -= s, _v.z -= s;
            return _v;
        },
        subVectors(a, b) {
            return _v.set(a.x - b.x, a.y - b.y, a.z - b.z);
        },

        toArray(array = [], offset = 0) {
            array[offset] = _v.x;
            array[offset + 1] = _v.y;
            array[offset + 2] = _v.z;
            return array;
        },
        trunc(n) {
            return _v.set(
                Maths.fastTrunc(_v.x, n),
                Maths.fastTrunc(_v.y, n),
                Maths.fastTrunc(_v.z, n),
            );
        },

        unit() {
            return _v.divScalar(_v.length);
        },

        *[Symbol.iterator]() {
            yield _v.x, yield _v.y, yield _v.z;
        },
    };
    return _v;
}

export const Vector3 = {
    distance(v1, v2) {
        return Math.sqrt(Vector3.distanceSq(v1, v2));
    },
    distanceSq(v1, v2) {
        const dx = v1.x - v2.x, dy = v1.y - v2.y, dz = v1.z - v2.z;
        return (dx * dx) + (dy * dy) + (dz * dz);
    },

    lerp(v1, v2, alpha, target = createVector3()) {
        return target.copy(v1).lerp(v2, alpha);
    },
};
