import { createObject3D } from "../objects/Object3D.js";

/**
 * @typedef {import("../objects/Object3D.js").Object3D} Object3D
 * @typedef {Object3D} Scene
 * @property {number} background
 */

/**
 * @returns {Scene}
 */
export function createScene() {
    const _scene = createObject3D();

    Object.assign(_scene, {
        background: undefined,

        /**
         * @returns {boolean}
         */
        get isScene() {
            return true;
        },

        /**
         * @returns {Scene}
         */
        clear() {
            const children = [..._scene.children];
            for (const child of children) _scene.remove(child);
            return _scene;
        },

        /**
         * @param {Object3D} source
         * @returns {Scene}
         */
        copy(source) {
            createObject3D().copy.call(_scene, source);

            if (source.background !== undefined) {
                _scene.background = source.background;
            }
            return _scene;
        },
    });

    return _scene;
}
