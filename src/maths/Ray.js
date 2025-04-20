import { createVector3 } from "./Vector3.js";

/**
 * @typedef {import("./Vector3.js").Vector3} Vector3
 * @typedef {Object} Ray
 * @property {Vector3} origin
 * @property {Vector3} direction
 */

/**
 * @returns {Ray}
 */
export function createRay() {
    const _origin = createVector3();
    const _direction = createVector3(0, 0, -1);

    const _v1 = createVector3();
    const _v2 = createVector3();
    const _v3 = createVector3();

    const _ray = {
        /**
         * @returns {Vector3}
         */
        get origin() {
            return _origin;
        },

        /**
         * @returns {Vector3}
         */
        get direction() {
            return _direction;
        },

        /**
         * @returns {boolean}
         */
        get isRay() {
            return true;
        },

        /**
         * @param {number} t
         * @param {Vector3} [target=createVector3()]
         * @returns {Vector3}
         */
        at(t, target = createVector3()) {
            return target.copy(_direction).mulScalar(t).add(_origin);
        },

        /**
         * @returns {Ray}
         */
        clone() {
            return createRay().copy(_ray);
        },

        /**
         * @param {Vector3} point
         * @param {Vector3} [target=createVector3()]
         * @returns {Vector3}
         */
        closestPointToPoint(point, target = createVector3()) {
            target.subVectors(point, _origin);

            const dirDist = target.dot(_direction);
            if (dirDist < 0) return target.copy(_origin);

            return target.copy(_direction).mulScalar(dirDist).add(
                _origin,
            );
        },

        /**
         * @param {Ray} ray
         * @returns {Ray}
         */
        copy(ray) {
            _origin.copy(ray.origin);
            _direction.copy(ray.direction);
            return _ray;
        },

        /**
         * @param {Vector3} point
         * @returns {number}
         */
        distanceToPoint(point) {
            const dirDist = _v1.subVectors(point, _origin).dot(
                _direction,
            );
            if (dirDist < 0) return _origin.distanceTo(point);

            _v1.copy(_direction).mulScalar(dirDist).add(_origin);
            return _v1.distanceTo(point);
        },

        /**
         * @param {Vector3} min
         * @param {Vector3} max
         * @param {Vector3} [target]
         * @returns {Vector3|null}
         */
        intersectBox(min, max, target = createVector3()) {
            let tmin, tmax, tymin, tymax, tzmin, tzmax;

            const invDirX = 1 / _direction.x;
            const invdirY = 1 / _direction.y;
            const invDirZ = 1 / _direction.z;

            tmin = ((invDirX >= 0 ? min.x : max.x) - _origin.x) * invDirX;
            tmax = ((invDirX >= 0 ? max.x : min.x) - _origin.x) * invDirX;
            tymin = ((invdirY >= 0 ? min.y : max.y) - _origin.y) * invdirY;
            tymax = ((invdirY >= 0 ? max.y : min.y) - _origin.y) * invdirY;

            if ((tmin > tymax) || (tymin > tmax)) return null;
            if (tymin > tmin) tmin = tymin;
            if (tymax < tmax) tmax = tymax;

            tzmin = ((invDirZ >= 0 ? min.z : max.z) - _origin.z) * invDirZ;
            tzmax = ((invDirZ >= 0 ? max.z : min.z) - _origin.z) * invDirZ;

            if ((tmin > tzmax) || (tzmin > tmax)) return null;
            if (tzmin > tmin) tmin = tzmin;
            if (tzmax < tmax) tmax = tzmax;
            if (tmax < 0) return null;

            return _ray.at(tmin >= 0 ? tmin : tmax, target);
        },

        /**
         * @param {Plane} plane
         * @param {Vector3} [target]
         * @returns {Vector3|null}
         */
        intersectPlane(plane, target = createVector3()) {
            const denom = plane.normal.dot(_direction);
            if (Math.abs(denom) < MathsUtils.EPSILON) {
                if (plane.distanceToPoint(_origin) === 0) {
                    return _ray.at(0, target);
                }
                return null;
            }

            const t = -(plane.normal.dot(_origin) + plane.constant) /
                denom;
            if (t < 0) return null;

            return _ray.at(t, target);
        },

        /**
         * @param {Vector3} centre
         * @param {number} radius
         * @param {Vector3} [target=createVector3()]
         * @returns {Vector3|null}
         */
        intersectSphere(centre, radius, target = createVector3()) {
            _v1.subVectors(centre, _origin);
            const tca = _v1.dot(_direction);

            const d2 = _v1.dot(_v1) - (tca * tca);
            const radius2 = radius * radius;
            if (d2 > radius2) return null;

            const thc = Math.sqrt(radius2 - d2);

            const t0 = tca - thc;
            const t1 = tca + thc;
            if (t0 < 0 && t1 < 0) return null;
            const t = t0 < 0 ? t1 : t0;

            return _ray.at(t, target);
        },

        /**
         * @param {Vector3} a
         * @param {Vector3} b
         * @param {Vector3} c
         * @param {boolean} [backfaceCulling=false]
         * @param {Vector3} [target=createVector3()]
         * @returns {Vector3|null}
         */
        intersectTriangle(
            a,
            b,
            c,
            backfaceCulling = false,
            target = createVector3(),
        ) {
            _v1.subVectors(c, b);
            _v2.subVectors(a, b);
            _v3.crossVectors(_v1, _v2);

            const dotNormDir = _direction.dot(_v3);
            if (Math.abs(dotNormDir) < MathsUtils.EPSILON) return null;
            if (backfaceCulling && dotNormDir > 0) return null;

            const invDot = 1 / dotNormDir;

            _v1.subVectors(_origin, b);
            const t = _v3.dot(_v1) * invDot;
            if (t < 0) return null;

            _v2.copy(_direction).mulScalar(t);
            const intersectionPoint = target.copy(_origin).add(_v2);

            _v1.subVectors(intersectionPoint, b);
            _v2.subVectors(c, b);

            const dot00 = _v2.dot(_v2);
            const dot01 = _v2.dot(_v3);
            const dot02 = _v2.dot(_v1);
            const dot11 = _v3.dot(_v3);
            const dot12 = _v3.dot(_v1);

            const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

            const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
            const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
            if (u < 0 || v < 0 || u + v > 1) return null;

            return intersectionPoint;
        },

        /**
         * @param {Vector3} origin
         * @param {Vector3} direction
         * @returns {Ray}
         */
        set(origin, direction) {
            _origin.copy(origin);
            _direction.copy(direction);
            return _ray;
        },

        /**
         * @param {Camera} camera
         * @param {number} x - (-1 to +1)
         * @param {number} y - (-1 to +1)
         * @returns {Ray}
         */
        setFromCamera(camera, x, y) {
            if (camera.isPerspCamera) {
                _direction.set(x, y, 0.5).unproject(camera).sub(camera.position)
                    .unit();
                _origin.copy(camera.position);
            } else {
                _direction.set(x, y, -1).unproject(camera).sub(_origin).unit();
                _origin.set(x, y, 0).unproject(camera);
            }
            return _ray;
        },
    };
    return _ray;
}
