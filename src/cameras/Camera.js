import { createEuler } from "../maths/Euler.js";
import { createMatrix4 } from "../maths/Matrix4.js";
import { createObject3D } from "../objects/Object3D.js";

/**
 * @typedef {import("../objects/Object3D.js").Object3D} Object3D
 * @typedef {import("../maths/Euler.js").Euler} Euler
 * @typedef {import("../maths/Matrix4.js").Matrix4} Matrix4
 * @typedef {Object3D} Camera
 * @property {Euler} rotation
 * @property {Matrix4} matrixWorldInverse
 * @property {Matrix4} projectionMatrix
 */

/**
 * @returns {Camera}
 */
export function createCamera() {
    const _camera = createObject3D();
    const _rotation = createEuler();

    _camera.position.set(0, 0, 0);

    _camera.matrixWorldInverse = createMatrix4().identity();
    _camera.projectionMatrix = createMatrix4().identity();

    _camera.matrix.identity();
    _camera.worldMatrix.copy(_camera.matrix);

    Object.assign(_camera, {
        /**
         * @returns {boolean}
         */
        get isCamera() {
            return true;
        },

        /**
         * @returns {Euler}
         */
        get rotation() {
            return _rotation;
        },

        /**
         * @param {Camera} source
         * @returns {Camera}
         */
        copy(source) {
            createObject3D().copy.call(_camera, source);
            _camera.position.copy(source.position);
            _camera.quaternion.copy(source.quaternion);
            _camera.scale.copy(source.scale);

            _camera.projectionMatrix.copy(source.projectionMatrix);
            _camera.matrixWorldInverse.copy(source.matrixWorldInverse);

            _rotation.copy(source.rotation);
            return _camera;
        },

        /**
         * @returns {Camera}
         */
        updateMatrixWorld() {
            _camera.updateWorldMatrix(true, false);
            _camera.matrixWorldInverse.copy(_camera.worldMatrix).invert();
            return _camera;
        },

        /**
         * @returns {Camera}
         */
        updateProjectionMatrix() {
            return _camera;
        },
    });

    return _camera;
}
