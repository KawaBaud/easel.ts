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
    const _tempVertexBuffer = new Float32Array(9);

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
        ) {
            _tempVertexBuffer[0] = v1.x;
            _tempVertexBuffer[1] = v1.y;
            _tempVertexBuffer[2] = v1.z;
            _tempVertexBuffer[3] = v2.x;
            _tempVertexBuffer[4] = v2.y;
            _tempVertexBuffer[5] = v2.z;
            _tempVertexBuffer[6] = v3.x;
            _tempVertexBuffer[7] = v3.y;
            _tempVertexBuffer[8] = v3.z;

            if (!camera || !camera.matrixWorldInverse) return null;

            const halfWidth = width >> 1; // width / 2
            const halfHeight = height >> 1; // height / 2

            const result = [null, null, null];

            for (let i = 0; i < 3; i++) {
                const idx = i * 3;

                _tempVector.set(
                    _tempVertexBuffer[idx],
                    _tempVertexBuffer[idx + 1],
                    _tempVertexBuffer[idx + 2],
                );
                _tempVector.applyMatrix4(camera.matrixWorldInverse);
                if (_tempVector.z > -0.1) return null;

                const scale = 1 / -_tempVector.z;

                let screenX = _tempVector.x * scale;
                let screenY = _tempVector.y * scale;
                screenX = (screenX * halfWidth) + halfWidth;
                screenY = halfHeight - (screenY * halfHeight);

                result[i] = {
                    x: screenX | 0,
                    y: screenY | 0,
                    z: _tempVector.z,
                };
            }

            if (backfaceCulled) {
                const p1 = result[0];
                const p2 = result[1];
                const p3 = result[2];

                const opz = ((p2.x - p1.x) * (p3.y - p1.y)) -
                    ((p3.x - p1.x) * (p2.y - p1.y));
                if (opz <= 0) return null;
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

            _tempVector.copy(vertex);
            _tempVector.applyMatrix4(camera.matrixWorldInverse);
            if (_tempVector.z > -0.1) return null;

            const halfWidth = width >> 1; // width / 2
            const halfHeight = height >> 1; // height / 2

            const scale = 1 / -_tempVector.z;

            let screenX = _tempVector.x * scale;
            let screenY = _tempVector.y * scale;
            screenX = (screenX * halfWidth) + halfWidth;
            screenY = halfHeight - (screenY * halfHeight);

            const x = screenX | 0;
            const y = screenY | 0;
            return { x, y, z: _tempVector.z };
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
