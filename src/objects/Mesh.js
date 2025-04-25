import { createObject3D } from "./Object3D.js";

/**
 * @typedef {import("./Object3D.js").Object3D} Object3D
 * @typedef {Object3D} Mesh
 * @property {Object} geometry
 * @property {Object} material
 * @property {boolean} isMesh
 */

/**
 * @param {Object} geometry
 * @param {Object} material
 * @returns {Mesh}
 */
export function createMesh(geometry, material) {
    const _mesh = createObject3D();

    Object.assign(_mesh, {
        /**
         * @type {Object}
         */
        geometry,

        /**
         * @type {Object}
         */
        material,

        /**
         * @type {boolean}
         * @readonly
         * @default true
         */
        isMesh: true,

        /**
         * @param {Mesh} source
         * @returns {Mesh}
         */
        copy(source) {
            createObject3D().copy.call(_mesh, source);
            _mesh.position.copy(source.position);
            _mesh.quaternion.copy(source.quaternion);
            _mesh.scale.copy(source.scale);
            _mesh.geometry = source.geometry;
            _mesh.material = source.material;
            return _mesh;
        },
    });

    return _mesh;
}
