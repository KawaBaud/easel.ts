import { MathsUtils } from "../../maths/MathsUtils.js";
import { createVector3 } from "../../maths/Vector3.js";

/**
 * @typedef {import("../../maths/Vector3.js").Vector3} Vector3
 * @typedef {import("../../maths/Matrix4.js").Matrix4} Matrix4
 * @typedef {import("../../cameras/Camera.js").Camera} Camera
 * @typedef {Object} VertexProcessor
 */

/**
 * @returns {VertexProcessor}
 */
export function createVertexProcessor() {
    const _vector = createVector3();
    const _tempVector = createVector3();

    function _projectPoint(
        x,
        y,
        z,
        camera,
        width,
        height,
        handleNearPlane = false,
    ) {
        _tempVector.set(x, y, z);
        _tempVector.applyMatrix4(camera.matrixWorldInverse);

        const behindNearPlane = _tempVector.z > -camera.near;
        if (behindNearPlane && !handleNearPlane) return null;
        if (behindNearPlane && handleNearPlane) {
            const behindRatio = (_tempVector.z + camera.near) / camera.near;

            _tempVector.z = -camera.near;
            _tempVector.x *= 1.0 - behindRatio >> 1;
            _tempVector.y *= 1.0 - behindRatio >> 1;
        }

        _tempVector.applyMatrix4(camera.projectionMatrix);
        _tempVector.x = -_tempVector.x;

        const scale = 1 / -_tempVector.z;

        const halfWidth = width >> 1;
        const halfHeight = height >> 1;

        let screenX = _tempVector.x * scale;
        let screenY = _tempVector.y * scale;
        screenX = (screenX * halfWidth) + halfWidth;
        screenY = halfHeight - (screenY * halfHeight);

        return {
            x: MathsUtils.fastTrunc(screenX),
            y: MathsUtils.fastTrunc(screenY),
            z: _tempVector.z,
            behindNearPlane,
        };
    }

    const _vertexProcessor = {
        /**
         * @param {Array<number>|Float32Array} vertices
         * @param {Matrix4} matrix
         * @returns {Float32Array}
         */
        applyMatrixToVertices(vertices, matrix) {
            const result = new Float32Array(vertices.length);

            for (let i = 0; i < vertices.length; i += 3) {
                _tempVector.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                _tempVector.applyMatrix4(matrix);

                result[i] = _tempVector.x;
                result[i + 1] = _tempVector.y;
                result[i + 2] = _tempVector.z;
            }
            return result;
        },

        /**
         * @param {Vector3} vertex
         * @param {Matrix4} viewMatrix
         * @param {Matrix4} projectionMatrix
         * @returns {Vector3}
         */
        processVertex(vertex, viewMatrix, projectionMatrix) {
            _vector.copy(vertex);
            _vector.applyMatrix4(viewMatrix);
            _vector.applyMatrix4(projectionMatrix);
            return _vector.clone();
        },

        /**
         * @param {Array<number>|Float32Array} vertices
         * @param {Matrix4} viewMatrix
         * @param {Matrix4} projectionMatrix
         * @returns {Float32Array}
         */
        processVertices(vertices, viewMatrix, projectionMatrix) {
            const result = new Float32Array(vertices.length);

            for (let i = 0; i < vertices.length; i += 3) {
                _tempVector.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                _tempVector.applyMatrix4(viewMatrix);
                _tempVector.applyMatrix4(projectionMatrix);

                result[i] = _tempVector.x;
                result[i + 1] = _tempVector.y;
                result[i + 2] = _tempVector.z;
            }
            return result;
        },

        /**
         * @param {Vector3} v1
         * @param {Vector3} v2
         * @param {Vector3} v3
         * @param {Camera} camera
         * @param {number} width
         * @param {number} height
         * @param {boolean} [backfaceCulled=true]
         * @param {boolean} [handleNearPlane=false]
         * @returns {Array<Object>|null}
         */
        projectTriangle(
            v1,
            v2,
            v3,
            camera,
            width,
            height,
            backfaceCulled = true,
            handleNearPlane = false,
        ) {
            if (!camera || !camera.matrixWorldInverse) return null;

            const vertices = [
                { x: v1.x, y: v1.y, z: v1.z },
                { x: v2.x, y: v2.y, z: v2.z },
                { x: v3.x, y: v3.y, z: v3.z },
            ];

            const result = [
                _projectPoint(
                    vertices[0].x,
                    vertices[0].y,
                    vertices[0].z,
                    camera,
                    width,
                    height,
                    handleNearPlane,
                ),
                _projectPoint(
                    vertices[1].x,
                    vertices[1].y,
                    vertices[1].z,
                    camera,
                    width,
                    height,
                    handleNearPlane,
                ),
                _projectPoint(
                    vertices[2].x,
                    vertices[2].y,
                    vertices[2].z,
                    camera,
                    width,
                    height,
                    handleNearPlane,
                ),
            ];
            if (!result[0] || !result[1] || !result[2]) return null;

            if (backfaceCulled) {
                const p1 = result[0];
                const p2 = result[1];
                const p3 = result[2];

                const normalSort = ((p2.x - p1.x) * (p3.y - p1.y)) -
                    ((p3.x - p1.x) * (p2.y - p1.y));
                if (normalSort <= 0) return null;
            }

            return result;
        },

        /**
         * @param {Vector3} vertex
         * @param {Camera} camera
         * @param {number} width
         * @param {number} height
         * @param {boolean} [handleNearPlane=false]
         * @returns {Object}
         */
        projectVertex(vertex, camera, width, height, handleNearPlane = false) {
            if (!vertex || !camera) return null;
            if (!camera.matrixWorldInverse) return null;

            return _projectPoint(
                vertex.x,
                vertex.y,
                vertex.z,
                camera,
                width,
                height,
                handleNearPlane,
            );
        },

        /**
         * @param {Vector3} vertex
         * @param {Matrix4} matrix
         * @returns {Vector3}
         */
        transformVertex(vertex, matrix) {
            return _vector.copy(vertex).applyMatrix4(matrix);
        },
    };

    return _vertexProcessor;
}
