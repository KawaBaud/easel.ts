import { createFrustum } from "../../maths/Frustum.js";
import { createVector3 } from "../../maths/Vector3.js";

/**
 * @typedef {import("../../maths/Vector3.js").Vector3} Vector3
 * @typedef {import("../../maths/Frustum.js").Frustum} Frustum
 * @typedef {import("../../cameras/Camera.js").Camera} Camera
 * @typedef {import("../../objects/Object3D.js").Object3D} Object3D
 * @typedef {Object} CullingContext
 * @property {Frustum} frustum
 * @property {boolean} backfaceCulled
 * @property {boolean} frustumCulled
 */

/**
 * @param {Camera} camera
 * @returns {CullingContext}
 */
export function createCullingContext(camera) {
    const _frustum = createFrustum().setFromCamera(camera);
    const _a = createVector3();
    const _b = createVector3();
    const _normal = createVector3();
    const _vertex = createVector3();
    const _centre = createVector3();

    const _context = {
        frustum: _frustum,
        backfaceCulled: true,
        frustumCulled: true,

        /**
         * @param {Vector3} v1
         * @param {Vector3} v2
         * @param {Vector3} v3
         * @returns {boolean}
         */
        backfaceCull(v1, v2, v3) {
            if (!_context.backfaceCulled) return true;

            _a.subVectors(v2, v1);
            _b.subVectors(v3, v1);
            _normal.crossVectors(_a, _b);

            return _normal.z < 0;
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
            if (!_context.backfaceCulled) return true;

            const opz = ((x1 - x0) * (y2 - y0)) - ((x2 - x0) * (y1 - y0));
            return opz > 0;
        },

        /**
         * @param {Object3D} object
         * @returns {boolean}
         */
        frustumCull(object) {
            if (!_context.frustumCulled) return true;
            if (!object.geometry) return true;

            if (object.geometry.boundingSphere) {
                const sphere = object.geometry.boundingSphere;
                _centre.copy(sphere.centre).applyMatrix4(object.worldMatrix);
                const radius = sphere.radius * Math.max(
                    object.scale.x,
                    object.scale.y,
                    object.scale.z,
                );

                return _context.frustum.intersectsSphere(_centre, radius);
            }

            if (object.geometry.vertices) {
                const vertices = object.geometry.vertices;
                const worldMatrix = object.worldMatrix;

                for (let i = 0; i < vertices.length; i += 3) {
                    _vertex.set(
                        vertices[i],
                        vertices[i + 1],
                        vertices[i + 2],
                    ).applyMatrix4(worldMatrix);

                    if (_context.frustum.containsPoint(_vertex)) return true;
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
