import { createVector3 } from "./Vector3.js";

/**
 * @typedef {import("./Vector3.js").Vector3} Vector3
 * @typedef {Object} Sphere
 * @property {Vector3} centre
 * @property {number} radius
 * @property {boolean} isSphere
 */

/**
 * @param {Vector3} [centre=createVector3()]
 * @param {number} [radius=0]
 * @returns {Sphere}
 */
export function createSphere(centre = createVector3(), radius = 0) {
    const _sphere = {
        /**
         * @type {Vector3}
         * @default createVector3()
         */
        centre,

        /**
         * @type {number}
         * @default 0
         */
        radius,

        /**
         * @type {boolean}
         * @readonly
         * @default true
         */
        isSphere: true,

        /**
         * @returns {Sphere}
         */
        clone() {
            return createSphere().copy(_sphere);
        },

        /**
         * @param {Sphere} sphere
         * @returns {boolean}
         */
        containsPoint(point) {
            return point.distanceSqTo(_sphere.centre) <=
                (_sphere.radius * _sphere.radius);
        },

        /**
         * @param {Sphere} sphere
         * @returns {boolean}
         */
        containsSphere(sphere) {
            const radiusDiff = _sphere.radius - sphere.radius;
            return sphere.centre.distanceSqTo(_sphere.centre) <=
                (radiusDiff * radiusDiff);
        },

        /**
         * @param {Sphere} sphere
         * @returns {Sphere}
         */
        copy(sphere) {
            _sphere.centre.copy(sphere.centre);
            _sphere.radius = sphere.radius;
            return _sphere;
        },

        /**
         * @param {Sphere} sphere
         * @returns {boolean}
         */
        intersectsSphere(sphere) {
            const radiusSum = _sphere.radius + sphere.radius;
            return sphere.centre.distanceSqTo(_sphere.centre) <=
                (radiusSum * radiusSum);
        },

        /**
         * @param {Array<Vector3>} points
         * @returns {Sphere}
         */
        setFromPoints(points) {
            const box = {
                min: createVector3(Infinity, Infinity, Infinity),
                max: createVector3(-Infinity, -Infinity, -Infinity),
            };
            for (const point of points) {
                box.min.min(point);
                box.max.max(point);
            }

            _sphere.centre.copy(box.min).add(box.max).mulScalar(0.5);

            let maxRadiusSq = 0;
            for (const point of points) {
                maxRadiusSq = Math.max(
                    maxRadiusSq,
                    _sphere.centre.distanceSqTo(point),
                );
            }
            _sphere.radius = Math.sqrt(maxRadiusSq);
            return _sphere;
        },

        /**
         * @param {Array<number>} vertices
         * @returns {Sphere}
         */
        setFromVertices(vertices) {
            const points = [];
            for (let i = 0; i < vertices.length; i += 3) {
                points.push(createVector3(
                    vertices[i],
                    vertices[i + 1],
                    vertices[i + 2],
                ));
            }
            return _sphere.setFromPoints(points);
        },
    };

    return _sphere;
}
