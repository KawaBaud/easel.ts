import { createFrustum } from "../maths/Frustum.js";
import { createVector3 } from "../maths/Vector3.js";

/**
 * @typedef {import("../maths/Vector3.js").Vector3} Vector3
 * @typedef {import("../maths/Frustum.js").Frustum} Frustum
 * @typedef {import("../cameras/Camera.js").Camera} Camera
 * @typedef {import("../objects/Object3D.js").Object3D} Object3D
 * @typedef {Object} CullingContext
 * @property {Frustum} frustum
 * @property {boolean} enableBackfaceCulling
 * @property {boolean} enableFrustumCulling
 */

/**
 * @param {Camera} camera
 * @returns {CullingContext}
 */
export function createCullingContext(camera) {
    const _frustum = createFrustum().setFromCamera(camera);

    const _context = {
        frustum: _frustum,
        enableBackfaceCulling: true,
        enableFrustumCulling: true,

        /**
         * @param {Vector3} v1
         * @param {Vector3} v2
         * @param {Vector3} v3
         * @returns {boolean}
         */
        backfaceCull(v1, v2, v3) {
            if (!_context.enableBackfaceCulling) return true;

            const a = createVector3().subVectors(v2, v1);
            const b = createVector3().subVectors(v3, v1);
            const normal = createVector3().crossVectors(a, b);

            return normal.z < 0;
        },

        /**
         * @param {number} x0
         * @param {number} y0
         * @param {number} x1
         * @param {number} y1
         * @param {number} x2
         * @param {number} y2
         * @returns {boolean}
         */
        backfaceCullScreenSpace(x0, y0, x1, y1, x2, y2) {
            if (!_context.enableBackfaceCulling) return true;

            const opz = ((x1 - x0) * (y2 - y0)) - ((x2 - x0) * (y1 - y0));
            return opz > 0;
        },

        /**
         * @param {Object3D} object
         * @returns {boolean}
         */
        frustumCull(object) {
            if (!_context.enableFrustumCulling) return true;
            if (!object.geometry) return true;

            if (object.geometry.boundingSphere) {
                const sphere = object.geometry.boundingSphere;
                const centre = createVector3().copy(sphere.centre).applyMatrix4(
                    object.worldMatrix,
                );
                const radius = sphere.radius * Math.max(
                    object.scale.x,
                    object.scale.y,
                    object.scale.z,
                );

                return _context.frustum.intersectsSphere(centre, radius);
            }

            if (object.geometry.vertices) {
                const vertices = object.geometry.vertices;
                const worldMatrix = object.worldMatrix;

                for (let i = 0; i < vertices.length; i += 3) {
                    const vertex = createVector3(
                        vertices[i],
                        vertices[i + 1],
                        vertices[i + 2],
                    ).applyMatrix4(worldMatrix);

                    if (_context.frustum.containsPoint(vertex)) return true;
                }
                return false;
            }

            return true;
        },

        /**
         * @param {Camera} camera
         * @returns {CullingContext}
         */
        updateFrustum(camera) {
            _context.frustum.setFromCamera(camera);
            return _context;
        },
    };

    return _context;
}
