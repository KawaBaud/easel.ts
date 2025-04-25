/**
 * @typedef {Object} Material
 * @property {number} colour
 * @property {boolean} wireframe
 * @property {boolean} isMaterial
 */

/**
 * @param {Object} [options={}]
 * @param {number} [options.colour=0xFFFFFF]
 * @param {boolean} [options.wireframe=false]
 * @returns {Material}
 */
export function createMaterial(options = {}) {
    const _material = {
        /**
         * @type {number}
         * @default 0xFFFFFF
         */
        colour: options.colour !== undefined ? options.colour : 0xFFFFFF,

        /**
         * @type {boolean}
         * @default false
         */
        wireframe: options.wireframe !== undefined ? options.wireframe : false,

        /**
         * @type {boolean}
         * @readonly
         * @default true
         */
        isMaterial: true,

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
