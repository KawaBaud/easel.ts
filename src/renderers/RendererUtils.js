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
     * @param {Camera} camera
     * @returns {Frustum}
     */
    createCameraFrustum(camera) {
        return createFrustum().setFromCamera(camera);
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
     * @param {Array<Object3D>} objects
     * @returns {Array<Object3D>}
     */
    sortDepth(objects) {
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
    sortFace(faces) {
        return [...faces].sort((a, b) => {
            const aZ = RendererUtils.getFaceAverageZ(a);
            const bZ = RendererUtils.getFaceAverageZ(b);
            return bZ - aZ;
        });
    },
};
