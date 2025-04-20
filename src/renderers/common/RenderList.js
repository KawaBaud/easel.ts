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
                _zValues[i] = objects[i].position.z;
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
