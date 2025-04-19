/**
 * @typedef {Object} Material
 * @property {number} colour
 * @property {boolean} wireframe
 */

/**
 * @param {Object} [options={}]
 * @param {number} [options.colour=0xFFFFFF]
 * @param {boolean} [options.wireframe=false]
 * @returns {Material}
 */
export function createMaterial(options = {}) {
    const _material = {
        colour: options.colour !== undefined ? options.colour : 0xFFFFFF,
        wireframe: options.wireframe !== undefined ? options.wireframe : false,

        /**
         * @returns {boolean}
         */
        get isMaterial() {
            return true;
        },

        /**
         * @param {Material} source
         * @returns {Material}
         */
        copy(source) {
            _material.colour = source.colour;
            _material.wireframe = source.wireframe;
            return _material;
        },
    };
    return _material;
}
