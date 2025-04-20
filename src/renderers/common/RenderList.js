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
            objects.sort((a, b) => {
                return a.position.z !== b.position.z
                    ? b.position.z - a.position.z
                    : 0;
            });
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
