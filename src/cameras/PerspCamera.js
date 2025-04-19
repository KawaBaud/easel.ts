import { Maths } from "../maths/Maths.js";
import { createCamera } from "./Camera.js";

/**
 * @typedef {Camera} PerspCamera
 * @property {number} fov
 * @property {number} aspect
 * @property {number} near
 * @property {number} far
 */

/**
 * @param {number} [fov=50] - in degrees
 * @param {number} [aspect=1] - width / height
 * @param {number} [near=0.1]
 * @param {number} [far=2000]
 * @returns {PerspCamera}
 */
export function createPerspCamera(
    fov = 50,
    aspect = 1,
    near = 0.1,
    far = 2000,
) {
    const _camera = createCamera();
    Object.assign(_camera, {
        fov,
        aspect,
        near,
        far,

        /**
         * @returns {boolean}
         */
        get isPerspCamera() {
            return true;
        },

        /**
         * @param {PerspCamera} source
         * @returns {PerspCamera}
         */
        copy(source) {
            createCamera().copy.call(_camera, source);
            _camera.position.copy(source.position);
            _camera.quaternion.copy(source.quaternion);
            _camera.scale.copy(source.scale);
            _camera.fov = source.fov;
            _camera.aspect = source.aspect;
            _camera.near = source.near;
            _camera.far = source.far;
            _camera.updateProjectionMatrix();
            return _camera;
        },

        /**
         * @returns {PerspCamera}
         */
        updateProjectionMatrix() {
            const fovRad = Maths.toRadians(_camera.fov);
            _camera.projectionMatrix.makePerspective(
                fovRad,
                _camera.aspect,
                _camera.near,
                _camera.far,
            );

            return _camera;
        },
    });
    _camera.updateProjectionMatrix();
    return _camera;
}
