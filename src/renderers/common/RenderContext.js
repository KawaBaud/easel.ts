/**
 * @typedef {import("../../cameras/Camera.js").Camera} Camera
 * @typedef {import("../../scenes/Scene.js").Scene} Scene
 * @typedef {Object} RenderContext
 * @property {Camera} camera
 * @property {Scene} scene
 */

/**
 * @param {Scene} scene
 * @param {Camera} camera
 * @returns {RenderContext}
 */
export function createRenderContext(scene, camera) {
    const _context = {
        /**
         * @type {Camera}
         */
        camera,

        /**
         * @type {Scene}
         */
        scene,

        /**
         * @param {Camera} newCamera
         * @returns {RenderContext}
         */
        setCamera(newCamera) {
            _context.camera = newCamera;
            return _context;
        },

        /**
         * @param {Scene} newScene
         * @returns {RenderContext}
         */
        setScene(newScene) {
            _context.scene = newScene;
            return _context;
        },

        /**
         * @returns {RenderContext}
         */
        update() {
            if (_context.camera) _context.camera.updateMatrixWorld();
            if (_context.scene) _context.scene.updateWorldMatrix(true, false);
            return _context;
        },
    };

    return _context;
}
