import { createFrustum } from "../maths/Frustum.js";
import { createVector3 } from "../maths/Vector3.js";

/**
 * @typedef {import("../maths/Vector3.js").Vector3} Vector3
 * @typedef {import("../maths/Frustum.js").Frustum} Frustum
 * @typedef {import("../cameras/Camera.js").Camera} Camera
 * @typedef {import("../objects/Object3D.js").Object3D} Object3D
 */

const _a = createVector3();
const _b = createVector3();
const _normal = createVector3();
const _centre = createVector3();

/**
 * @namespace
 */
export const RendererUtils = {
    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @param {Vector3} v3
     * @returns {boolean}
     */
    backfaceCull(v1, v2, v3) {
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
        const opz = ((x1 - x0) * (y2 - y0)) - ((x2 - x0) * (y1 - y0));
        return opz > 0;
    },

    /**
     * @param {Camera} camera
     * @returns {Frustum}
     */
    createCameraFrustum(camera) {
        return createFrustum().setFromCamera(camera);
    },

    /**
     * @param {Array<Object3D>} objects
     * @returns {Array<Object3D>}
     */
    depthSort(objects) {
        return [...objects].sort((a, b) => {
            return a.position.z !== b.position.z
                ? b.position.z - a.position.z
                : 0;
        });
    },

    /**
     * @param {Array<{vertices: Array<number>, indices: Array<number>}>} faces
     * @returns {Array<{vertices: Array<number>, indices: Array<number>}>}
     */
    faceSort(faces) {
        return [...faces].sort((a, b) => {
            const aZ = RendererUtils.getFaceAverageZ(a);
            const bZ = RendererUtils.getFaceAverageZ(b);
            return bZ - aZ;
        });
    },

    /**
     * @param {Frustum} frustum
     * @param {Object3D} object
     * @returns {boolean}
     */
    frustumCull(frustum, object) {
        if (!object.geometry) return true;

        if (object.geometry.boundingSphere) {
            const sphere = object.geometry.boundingSphere;
            _centre.copy(sphere.centre).applyMatrix4(object.worldMatrix);
            const radius = sphere.radius * Math.max(
                object.scale.x,
                object.scale.y,
                object.scale.z,
            );

            return frustum.intersectsSphere(_centre, radius);
        }

        if (object.geometry.vertices) {
            const vertices = object.geometry.vertices;
            const worldMatrix = object.worldMatrix;

            for (let i = 0; i < vertices.length; i += 3) {
                const vert = createVector3(
                    vertices[i],
                    vertices[i + 1],
                    vertices[i + 2],
                ).applyMatrix4(worldMatrix);

                if (frustum.containsPoint(vert)) return true;
            }
            return false;
        }
        return true;
    },

    /**
     * @param {{vertices: Array<number>, indices: Array<number>}} face
     * @returns {number}
     */
    getFaceAverageZ(face) {
        const vertices = face.vertices;
        const indices = face.indices;

        let sumZ = 0;
        for (let i = 0; i < indices.length; i++) {
            const idx = indices[i] * 3 + 2;
            sumZ += vertices[idx];
        }

        return sumZ / indices.length;
    },

    /**
     * @param {Array<number>} vertices
     * @param {Array<number>} indices
     * @param {number} i
     * @returns {number}
     */
    getTriangleAverageZ(vertices, indices, i) {
        const idx1 = indices[i] * 3 + 2;
        const idx2 = indices[i + 1] * 3 + 2;
        const idx3 = indices[i + 2] * 3 + 2;

        return (vertices[idx1] + vertices[idx2] + vertices[idx3]) / 3;
    },

    /**
     * @param {Array<{z: number}>} objects
     * @returns {Array<{z: number}>}
     */
    painterSort(objects) {
        return [...objects].sort((a, b) => b.z - a.z);
    },
};
