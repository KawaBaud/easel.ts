import { createMatrix4 } from "./Matrix4.js";
import { createVector3 } from "./Vector3.js";

/**
 * @typedef {import("./Vector3.js").Vector3} Vector3
 * @typedef {import("./Matrix4.js").Matrix4} Matrix4
 * @typedef {import("../cameras/Camera.js").Camera} Camera
 * @typedef {Object} Plane
 * @property {number} constant
 * @property {Vector3} normal
 */

/**
 * @typedef {Object} Frustum
 * @property {Array<Plane>} planes
 */

/**
 * @returns {Plane}
 */
function createPlane() {
    const _plane = {
        /**
         * @default createVector3(1, 0, 0)
         */
        normal: createVector3(1, 0, 0),

        /**
         * @default 0
         */
        constant: 0,

        /**
         * @param {Vector3} point
         * @returns {number}
         */
        distanceToPoint(point) {
            return _plane.normal.dot(point) + _plane.constant;
        },

        /**
         * @param {Vector3} point
         * @returns {boolean}
         */
        isPointInFront(point) {
            return _plane.distanceToPoint(point) > 0;
        },

        /**
         * @param {Vector3} normal
         * @param {number} constant
         * @returns {Plane}
         */
        setComponents(normal, constant) {
            _plane.normal.copy(normal);
            _plane.constant = constant;
            return _plane;
        },
    };
    return _plane;
}

/**
 * @returns {Frustum}
 */
export function createFrustum() {
    const _planes = [
        createPlane(), // left
        createPlane(), // right
        createPlane(), // top
        createPlane(), // bottom
        createPlane(), // near
        createPlane(), // far
    ];

    const _m = createMatrix4();
    const _v1 = createVector3();

    const _frustum = {
        /**
         * @returns {Array<Plane>}
         */
        get planes() {
            return _planes;
        },

        /**
         * @returns {boolean}
         */
        get isFrustum() {
            return true;
        },

        /**
         * @param {Vector3} point
         * @returns {boolean}
         */
        containsPoint(point) {
            for (let i = 0; i < 6; i++) {
                if (_planes[i].distanceToPoint(point) < 0) {
                    return false;
                }
            }
            return true;
        },

        /**
         * @param {Vector3} min
         * @param {Vector3} max
         * @returns {boolean}
         */
        intersectsBox(min, max) {
            for (let i = 0; i < 6; i++) {
                const plane = _planes[i];
                const normal = plane.normal;

                _v1.x = normal.x > 0 ? max.x : min.x;
                _v1.y = normal.y > 0 ? max.y : min.y;
                _v1.z = normal.z > 0 ? max.z : min.z;

                if (plane.distanceToPoint(_v1) < 0) return false;
            }
            return true;
        },

        /**
         * @param {Vector3} centre
         * @param {number} radius
         * @returns {boolean}
         */
        intersectsSphere(centre, radius) {
            for (let i = 0; i < 6; i++) {
                const plane = _planes[i];

                const distance = plane.distanceToPoint(centre);
                if (distance < -radius) return false;
            }
            return true;
        },

        /**
         * @param {Camera} camera
         * @returns {Frustum}
         */
        setFromCamera(camera) {
            // projection * view matrix
            _m.copy(camera.projectionMatrix).mul(
                camera.matrixWorldInverse,
            );
            return _frustum.setFromProjectionMatrix(_m);
        },

        /**
         * @param {Matrix4} m
         * @returns {Frustum}
         */
        setFromProjectionMatrix(m) {
            const e = m.elements;
            const e0 = e[0], e1 = e[1], e2 = e[2], e3 = e[3];
            const e4 = e[4], e5 = e[5], e6 = e[6], e7 = e[7];
            const e8 = e[8], e9 = e[9], e10 = e[10], e11 = e[11];
            const e12 = e[12], e13 = e[13], e14 = e[14], e15 = e[15];

            _planes[0].setComponents(
                e3 + e0,
                e7 + e4,
                e11 + e8,
                e15 + e12,
            ); // left
            _planes[1].setComponents(
                e3 - e0,
                e7 - e4,
                e11 - e8,
                e15 - e12,
            ); // right
            _planes[2].setComponents(
                e3 - e1,
                e7 - e5,
                e11 - e9,
                e15 - e13,
            ); // top
            _planes[3].setComponents(
                e3 + e1,
                e7 + e5,
                e11 + e9,
                e15 + e13,
            ); // bottom
            _planes[4].setComponents(
                e3 + e2,
                e7 + e6,
                e11 + e10,
                e15 + e14,
            ); // near
            _planes[5].setComponents(
                e3 - e2,
                e7 - e6,
                e11 - e10,
                e15 - e14,
            ); // far

            for (let i = 0; i < 6; i++) {
                const plane = _planes[i];
                const normal = plane.normal;

                const invLength = 1 / normal.length;

                normal.mulScalar(invLength);
                plane.constant *= invLength;
            }

            return _frustum;
        },
    };
    return _frustum;
}
