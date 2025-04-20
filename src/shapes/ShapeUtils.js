import { MathsUtils } from "../maths/MathsUtils.js";
import { createVector3 } from "../maths/Vector3.js";

/**
 * @typedef {import("../maths/Vector3.js").Vector3} Vector3
 */

/**
 * @namespace
 */
export const ShapeUtils = {
    /**
     * @param {Uint16Array} indices
     * @param {number} indexOffset
     * @param {number} vIndex0
     * @param {number} vIndex1
     * @param {number} vIndex2
     * @param {number} vIndex3
     * @returns {number}
     */
    addQuad(indices, indexOffset, vIndex0, vIndex1, vIndex2, vIndex3) {
        indices[indexOffset] = vIndex0;
        indices[indexOffset + 1] = vIndex1;
        indices[indexOffset + 2] = vIndex2;

        indices[indexOffset + 3] = vIndex0;
        indices[indexOffset + 4] = vIndex2;
        indices[indexOffset + 5] = vIndex3;

        return indexOffset + 6;
    },

    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @param {Vector3} v3
     * @returns {number}
     */
    areaTriangle(v1, v2, v3) {
        const a = createVector3().subVectors(v2, v1);
        const b = createVector3().subVectors(v3, v1);
        const cross = createVector3().crossVectors(a, b);
        return cross.length * 0.5;
    },

    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @returns {number}
     */
    areaTriangleFixed(x1, y1, x2, y2, x3, y3) {
        const term1 = MathsUtils.qmul(x1, y2 - y3);
        const term2 = MathsUtils.qmul(x2, y3 - y1);
        const term3 = MathsUtils.qmul(x3, y1 - y2);

        const sum = term1 + term2 + term3;
        const absSum = sum < 0 ? -sum : sum;

        return MathsUtils.shrdiv(absSum);
    },

    /**
     * @param {number} px
     * @param {number} py
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @returns {boolean}
     */
    pointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
        const denom = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
        if (denom === 0) return false;

        const a = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denom;
        const b = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denom;
        const c = 1 - a - b;

        return (
            (a >= 0 && a <= 1) &&
            (b >= 0 && b <= 1) &&
            (c >= 0 && c <= 1)
        );
    },

    /**
     * @param {Float32Array} vertices
     * @param {Uint16Array} indices
     * @param {number[]} polygonIndices
     * @param {number} indexOffset
     * @returns {number}
     */
    triangulate(vertices, indices, polygonIndices, indexOffset) {
        if (polygonIndices.length < 3) return indexOffset;
        if (polygonIndices.length === 3) {
            indices[indexOffset] = polygonIndices[0];
            indices[indexOffset + 1] = polygonIndices[1];
            indices[indexOffset + 2] = polygonIndices[2];
            return indexOffset + 3;
        }
        if (polygonIndices.length === 4) {
            return this.addQuad(
                indices,
                indexOffset,
                polygonIndices[0],
                polygonIndices[1],
                polygonIndices[2],
                polygonIndices[3],
            );
        }

        const remIndices = [...polygonIndices];
        let currOffset = indexOffset;

        while (remIndices.length > 3) {
            for (let i = 0; i < remIndices.length; i++) {
                const prev = (i === 0) ? remIndices.length - 1 : i - 1;
                const next = (i === remIndices.length - 1) ? 0 : i + 1;

                const v0 = remIndices[prev];
                const v1 = remIndices[i];
                const v2 = remIndices[next];

                let ear = true;

                const x0 = vertices[v0 * 3];
                const y0 = vertices[v0 * 3 + 1];
                const x1 = vertices[v1 * 3];
                const y1 = vertices[v1 * 3 + 1];
                const x2 = vertices[v2 * 3];
                const y2 = vertices[v2 * 3 + 1];

                const signedArea = (x1 - x0) * (y2 - y0) -
                    (x2 - x0) * (y1 - y0);
                if (signedArea <= 0) {
                    ear = false;
                    continue;
                }

                for (let j = 0; j < remIndices.length; j++) {
                    if (j === prev || j === i || j === next) continue;

                    const vj = remIndices[j];
                    const xj = vertices[vj * 3];
                    const yj = vertices[vj * 3 + 1];

                    if (this.pointInTriangle(xj, yj, x0, y0, x1, y1, x2, y2)) {
                        ear = false;
                        break;
                    }
                }

                if (ear) {
                    indices[currOffset] = v0;
                    indices[currOffset + 1] = v1;
                    indices[currOffset + 2] = v2;
                    currOffset += 3;

                    remIndices.splice(i, 1);
                    break;
                }
            }
        }

        indices[currOffset] = remIndices[0];
        indices[currOffset + 1] = remIndices[1];
        indices[currOffset + 2] = remIndices[2];

        return currOffset + 3;
    },

    /**
     * @param {number} worldX
     * @param {number} worldY
     * @param {number} worldZ
     * @param {number} halfWidth
     * @param {number} halfHeight
     * @param {number} cameraDistance
     * @returns {{x: number, y: number, z: number}}
     */
    worldToScreenFixed(
        worldX,
        worldY,
        worldZ,
        halfWidth,
        halfHeight,
        cameraDistance,
    ) {
        const z = worldZ + cameraDistance;
        if (z <= 0) return { x: -32768, y: -32768, z: 32767 };

        const scale = MathsUtils.qdiv(MathsUtils.Q_ONE, z);

        let screenX = MathsUtils.qmul(worldX, scale);
        let screenY = MathsUtils.qmul(worldY, scale);
        screenX = MathsUtils.qmul(screenX, halfWidth) + halfWidth;
        screenY = halfHeight - MathsUtils.qmul(screenY, halfHeight);

        return {
            x: MathsUtils.fastFloor(MathsUtils.toFloat(screenX)),
            y: MathsUtils.fastFloor(MathsUtils.toFloat(screenY)),
            z: z,
        };
    },
};
