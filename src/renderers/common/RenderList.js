import { createVector3 } from "../../maths/Vector3.js";

/**
 * @typedef {import("../../objects/Object3D.js").Object3D} Object3D
 * @typedef {Object} RenderList
 * @property {Array<Object3D>} objects
 */

/**
 * @returns {RenderList}
 */
export function createRenderList() {
    const _objects = [];
    const _zValues = new Float32Array(128);
    const _indices = new Uint16Array(128);
    let _capacity = 128;

    const _v1 = createVector3();
    const _v2 = createVector3();
    const _v3 = createVector3();

    const _renderList = {
        /**
         * @returns {Array<Object3D>}
         */
        get objects() {
            return _objects;
        },

        /**
         * @param {Object3D} object
         * @returns {RenderList}
         */
        add(object) {
            if (!_objects.includes(object)) _objects.push(object);
            return _renderList;
        },

        /**
         * @returns {RenderList}
         */
        clear() {
            _objects.length = 0;
            return _renderList;
        },

        /**
         * OTZ = (SZ0 + SZ1 + SZ2) / 3
         * @param {Object} mesh
         * @returns {number}
         */
        calculateOTZ(mesh) {
            if (
                !mesh.geometry || !mesh.geometry.vertices ||
                !mesh.geometry.indices
            ) {
                return mesh.position.z;
            }

            const vertices = mesh.geometry.vertices;
            const indices = mesh.geometry.indices;
            if (indices.length < 3) return mesh.position.z;

            const idx1 = indices[0] * 3;
            const idx2 = indices[1] * 3;
            const idx3 = indices[2] * 3;

            _v1.set(vertices[idx1], vertices[idx1 + 1], vertices[idx1 + 2]);
            _v2.set(vertices[idx2], vertices[idx2 + 1], vertices[idx2 + 2]);
            _v3.set(vertices[idx3], vertices[idx3 + 1], vertices[idx3 + 2]);

            _v1.applyMatrix4(mesh.worldMatrix);
            _v2.applyMatrix4(mesh.worldMatrix);
            _v3.applyMatrix4(mesh.worldMatrix);

            return (_v1.z + _v2.z + _v3.z) / 3;
        },

        /**
         * @param {Array<Object3D>} objects
         * @returns {RenderList}
         */
        depthSort(objects = _objects) {
            const count = objects.length;
            if (count > _capacity) {
                _capacity = Math.max(count, _capacity * 2);
                _zValues = new Float32Array(_capacity);
                _indices = new Uint16Array(_capacity);
            }

            for (let i = 0; i < count; i++) {
                _zValues[i] = _renderList.calculateOTZ(objects[i]);
                _indices[i] = i;
            }
            _indices.sort((a, b) => _zValues[b] - _zValues[a]);

            const sortedObjects = new Array(count);
            for (let i = 0; i < count; i++) {
                sortedObjects[i] = objects[_indices[i]];
            }
            for (let i = 0; i < count; i++) {
                objects[i] = sortedObjects[i];
            }

            return _renderList;
        },

        /**
         * @param {Object3D} object
         * @returns {RenderList}
         */
        remove(object) {
            const index = _objects.indexOf(object);
            if (index !== -1) _objects.splice(index, 1);
            return _renderList;
        },
    };

    return _renderList;
}
