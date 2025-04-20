import { createVector3 } from "../../maths/Vector3.js";

/**
 * @typedef {import("../../maths/Vector3.js").Vector3} Vector3
 */

/**
 * @namespace
 */
export const CanvasClipping = {
    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @param {Vector3} v3
     * @param {number} minZ
     * @returns {Array<Vector3>|null}
     */
    clipTriangleAgainstNearPlane(v1, v2, v3, minZ = 0.1) {
        const points = [v1, v2, v3];
        const result = [];

        for (let i = 0; i < 3; i++) {
            const curr = points[i];
            if (curr.z < -minZ) result.push(curr);
            const next = points[(i + 1) % 3];

            const currBehind = curr.z < -minZ;
            const nextBehind = next.z < -minZ;
            if (currBehind !== nextBehind) {
                const t = (-minZ - curr.z) / (next.z - curr.z);
                const intersection = createVector3().copy(curr).lerp(next, t);
                result.push(intersection);
            }
        }
        return result.length > 0 ? result : null;
    },

    /**
     * @param {Array<Vector3>} vertices
     * @param {Function} planeFunc
     * @param {number} planeConst
     * @returns {Array<Vector3>}
     */
    clipPolygonAgainstPlane(vertices, planeFunc, planeConst) {
        if (vertices.length < 3) return [];

        const result = [];
        let prevVert = vertices[vertices.length - 1];
        let prevDist = planeFunc(prevVert) + planeConst;

        for (let i = 0; i < vertices.length; i++) {
            const currVert = vertices[i];
            const currDist = planeFunc(currVert) + planeConst;

            if (currDist >= 0) {
                if (prevDist < 0) {
                    const t = prevDist / (prevDist - currDist);
                    const intersection = createVector3().copy(prevVert).lerp(
                        currVert,
                        t,
                    );
                    result.push(intersection);
                }
                result.push(currVert);
            } else if (prevDist >= 0) {
                const t = prevDist / (prevDist - currDist);
                const intersection = createVector3().copy(prevVert).lerp(
                    currVert,
                    t,
                );
                result.push(intersection);
            }

            prevVert = currVert;
            prevDist = currDist;
        }
        return result;
    },

    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @param {Vector3} v3
     * @returns {Array<Vector3>|null}
     */
    clipTriangleAgainstViewport(v1, v2, v3) {
        const points = [v1, v2, v3];
        let result = [...points];

        const clipAgainstPlane = CanvasClipping.clipPolygonAgainstPlane;
        result = clipAgainstPlane(result, (p) => p.x + p.z, -p.z);
        result = clipAgainstPlane(result, (p) => -p.x + p.z, -p.z);
        result = clipAgainstPlane(result, (p) => p.y + p.z, -p.z);
        result = clipAgainstPlane(result, (p) => -p.y + p.z, -p.z);
        return result.length > 0 ? result : null;
    },
};
