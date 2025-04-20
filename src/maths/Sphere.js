import { createVector3 } from "./Vector3.js";

/**
 * @typedef {import("./Vector3.js").Vector3} Vector3
 * @typedef {Object} Sphere
 * @property {Vector3} centre
 * @property {number} radius
 */

/**
 * @param {Vector3} [centre=createVector3()]
 * @param {number} [radius=0]
 * @returns {Sphere}
 */
export function createSphere(centre = createVector3(), radius = 0) {
    const _sphere = {
        centre,
        radius,

        /**
         * @returns {boolean}
         */
        get isSphere() {
            return true;
        },

        /**
         * @param {Sphere} sphere
         * @returns {boolean}
         */
        containsPoint(point) {
            return point.distanceToSquared(_sphere.centre) <= (_sphere.radius * _sphere.radius);
        },

        /**
         * @param {Sphere} sphere
         * @returns {boolean}
         */
        containsSphere(sphere) {
            const radiusDiff = _sphere.radius - sphere.radius;
            return sphere.centre.distanceToSquared(_sphere.centre) <= (radiusDiff * radiusDiff);
        },

        /**
         * @param {Sphere} sphere
         * @returns {boolean}
         */
        intersectsSphere(sphere) {
            const radiusSum = _sphere.radius + sphere.radius;
            return sphere.centre.distanceToSquared(_sphere.centre) <= (radiusSum * radiusSum);
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

            // Find the bounding box
            for (const point of points) {
                box.min.min(point);
                box.max.max(point);
            }

            // Set the center to the center of the box
            _sphere.centre.copy(box.min).add(box.max).multiplyScalar(0.5);

            // Find the radius from the center to the furthest point
            let maxRadiusSq = 0;
            for (const point of points) {
                maxRadiusSq = Math.max(maxRadiusSq, _sphere.centre.distanceToSquared(point));
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
         * @returns {Sphere}
         */
        clone() {
            return createSphere().copy(_sphere);
        },
    };

    return _sphere;
}
