import { createRectangleShape } from "../shapes/RectangleShape.js";
import { ShapeUtils } from "../shapes/ShapeUtils.js";
import { createMesh } from "./Mesh.js";

/**
 * @typedef {import("./Mesh.js").Mesh} Mesh
 * @typedef {Mesh} QuadMesh
 * @property {boolean} isQuadMesh
 */

/**
 * @param {number} [width=1]
 * @param {number} [height=1]
 * @param {Object} [material]
 * @returns {QuadMesh}
 */
export function createQuadMesh(width = 1, height = 1, material) {
    const _geometry = createRectangleShape(width, height);
    const _mesh = createMesh(_geometry, material);

    if (_geometry.vertices && !_geometry.indices) {
        const indices = new Uint16Array(6); // 2 triangles

        ShapeUtils.addQuad(indices, 0, 0, 1, 2, 3);
        _geometry.indices = indices;
    }

    Object.assign(_mesh, {
        /**
         * @readonly
         * @default true
         */
        isQuadMesh: true,

        /**
         * @param {QuadMesh} source
         * @returns {QuadMesh}
         */
        copy(source) {
            createMesh().copy.call(_mesh, source);
            _mesh.geometry = source.geometry;
            _mesh.material = source.material;
            _mesh.position.copy(source.position);
            _mesh.quaternion.copy(source.quaternion);
            _mesh.scale.copy(source.scale);
            return _mesh;
        },
    });

    return _mesh;
}
