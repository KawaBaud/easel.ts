import { MathsUtils } from "../maths/MathsUtils.js";
import { createVector3 } from "../maths/Vector3.js";

/**
 * @typedef {import("../maths/Vector3.js").Vector3} Vector3
 * @typedef {import("../maths/Matrix4.js").Matrix4} Matrix4
 * @typedef {import("../cameras/Camera.js").Camera} Camera
 * @typedef {Object} Processor
 */

/**
 * @returns {Processor}
 */
export function createProcessor() {
    const _v = createVector3();

    const _processor = {
        /**
         * @param {Array<number>} vertices
         * @param {Matrix4} matrix
         * @returns {Array<number>}
         */
        applyMatrixToVertices(vertices, matrix) {
            const v = createVector3();

            const result = new Array(vertices.length);
            for (let i = 0; i < vertices.length; i += 3) {
                v.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                v.applyMatrix4(matrix);

                result[i] = v.x;
                result[i + 1] = v.y;
                result[i + 2] = v.z;
            }
            return result;
        },

        /**
         * @param {Vector3} vertex
         * @param {Camera} camera
         * @param {number} width
         * @param {number} height
         * @returns {Object}
         */
        projectVertex(vertex, camera, width, height) {
            if (!vertex || !camera) return null;
            if (!camera.matrixWorldInverse) return null;

            const v = vertex.clone();
            v.applyMatrix4(camera.matrixWorldInverse);
            if (v.z > -0.1) return null;

            const halfWidth = MathsUtils.shrdiv(width);
            const halfHeight = MathsUtils.shrdiv(height);

            const scale = 1 / -v.z;

            let screenX = v.x * scale;
            let screenY = v.y * scale;
            screenX = (screenX * halfWidth) + halfWidth;
            screenY = halfHeight - (screenY * halfHeight);

            const x = MathsUtils.fastTrunc(screenX);
            const y = MathsUtils.fastTrunc(screenY);
            return { x, y, z: v.z };
        },

        /**
         * @param {Vector3} vertex
         * @param {Matrix4} viewMatrix
         * @param {Matrix4} projectionMatrix
         * @returns {Vector3}
         */
        processVertex(vertex, viewMatrix, projectionMatrix) {
            const v = createVector3().copy(vertex);
            v.applyMatrix4(viewMatrix);
            v.applyMatrix4(projectionMatrix);
            return v;
        },

        /**
         * @param {Array<number>} vertices
         * @param {Matrix4} viewMatrix
         * @param {Matrix4} projectionMatrix
         * @returns {Array<number>}
         */
        processVertices(vertices, viewMatrix, projectionMatrix) {
            const v = createVector3();

            const result = new Array(vertices.length);
            for (let i = 0; i < vertices.length; i += 3) {
                v.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                v.applyMatrix4(viewMatrix);
                v.applyMatrix4(projectionMatrix);

                result[i] = v.x;
                result[i + 1] = v.y;
                result[i + 2] = v.z;
            }
            return result;
        },

        /**
         * @param {Vector3} vertex
         * @param {Matrix4} matrix
         * @returns {Vector3}
         */
        transformVertex(vertex, matrix) {
            return _v.copy(vertex).applyMatrix4(matrix);
        },
    };
    return _processor;
}
