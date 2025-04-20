import { createMatrix4 } from "./Matrix4.js";
import { createQuaternion } from "./Quaternion.js";
import { createVector3 } from "./Vector3.js";

/**
 * @typedef {import("./Vector3.js").Vector3} Vector3
 * @typedef {import("./Quaternion.js").Quaternion} Quaternion
 * @typedef {import("./Matrix4.js").Matrix4} Matrix4
 * @typedef {Object} Transform
 * @property {Vector3} position
 * @property {Quaternion} rotation
 * @property {Vector3} scale
 * @property {Matrix4} matrix
 */

/**
 * @returns {Transform}
 */
export function createTransform() {
    const _position = createVector3();
    const _rotation = createQuaternion();
    const _scale = createVector3(1, 1, 1);
    const _matrix = createMatrix4();

    const _transform = {
        /**
         * @returns {Vector3}
         */
        get position() {
            return _position;
        },

        /**
         * @returns {Quaternion}
         */
        get rotation() {
            return _rotation;
        },

        /**
         * @returns {Vector3}
         */
        get scale() {
            return _scale;
        },

        /**
         * @returns {Matrix4}
         */
        get matrix() {
            return _matrix;
        },

        /**
         * @returns {boolean}
         */
        get isTransform() {
            return true;
        },

        /**
         * @returns {Transform}
         */
        clone() {
            const newTransform = createTransform();
            newTransform.copy(_transform);
            return newTransform;
        },

        /**
         * @param {Transform} transform
         * @returns {Transform}
         */
        copy(transform) {
            _position.copy(transform.position);
            _rotation.copy(transform.rotation);
            _scale.copy(transform.scale);
            _matrix.copy(transform.matrix);
            return _transform;
        },

        /**
         * @returns {Transform}
         */
        identity() {
            _position.set(0, 0, 0);
            _rotation.set(0, 0, 0, 1);
            _scale.set(1, 1, 1);
            _matrix.identity();
            return _transform;
        },

        /**
         * @returns {Transform}
         */
        invert() {
            _matrix.invert();
            _matrix.decompose(_position, _rotation, _scale);
            return _transform;
        },

        /**
         * @param {number} t
         * @param {Transform} target
         * @returns {Transform}
         */
        lerp(t, target) {
            _position.lerp(target.position, t);
            _rotation.slerp(target.rotation, t);
            _scale.lerp(target.scale, t);
            return _transform.updateMatrix();
        },

        /**
         * @param {Vector3} point
         * @returns {Vector3}
         */
        localToWorld(point) {
            return point.clone().applyMatrix4(_matrix);
        },

        /**
         * @param {Vector3} target
         * @param {Vector3} [up=Vector3(0,1,0)]
         * @returns {Transform}
         */
        lookAt(target, up = createVector3(0, 1, 0)) {
            const m = createMatrix4().lookAt(target, _position, up);
            _rotation.setFromRotationMatrix(m);
            return _transform;
        },

        /**
         * @param {Transform} transform
         * @returns {Transform}
         */
        mul(transform) {
            _transform.updateMatrix();
            const otherMat = transform.updateMatrix().matrix;

            _matrix.mul(otherMat);
            _matrix.decompose(_position, _rotation, _scale);

            return _transform;
        },

        /**
         * @param {Vector3} axis
         * @param {number} angle
         * @returns {Transform}
         */
        rotateOnAxis(axis, angle) {
            const q = createQuaternion().setFromAxisAngle(axis, angle);
            _rotation.mul(q);
            return _transform;
        },

        /**
         * @param {number} angle - in radians
         * @returns {Transform}
         */
        rotateX(angle) {
            return _transform.rotateOnAxis(createVector3(1, 0, 0), angle);
        },

        /**
         * @param {number} angle - in radians
         * @returns {Transform}
         */
        rotateY(angle) {
            return _transform.rotateOnAxis(createVector3(0, 1, 0), angle);
        },

        /**
         * @param {number} angle - in radians
         * @returns {Transform}
         */
        rotateZ(angle) {
            return _transform.rotateOnAxis(createVector3(0, 0, 1), angle);
        },

        /**
         * @param {Vector3} position
         * @returns {Transform}
         */
        setPosition(position) {
            _position.copy(position);
            return _transform;
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @returns {Transform}
         */
        setPositionXYZ(x, y, z) {
            _position.set(x, y, z);
            return _transform;
        },

        /**
         * @param {Quaternion} rotation
         * @returns {Transform}
         */
        setRotation(rotation) {
            _rotation.copy(rotation);
            return _transform;
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @param {number} w
         * @returns {Transform}
         */
        setRotationXYZW(x, y, z, w) {
            _rotation.set(x, y, z, w);
            return _transform;
        },

        /**
         * @param {Vector3} scale
         * @returns {Transform}
         */
        setScale(scale) {
            _scale.copy(scale);
            return _transform;
        },

        /**
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @returns {Transform}
         */
        setScaleXYZ(x, y, z) {
            _scale.set(x, y, z);
            return _transform;
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        transformDirection(v) {
            const m = createMatrix4().copy(_matrix);
            const me = m.elements;
            me[12] = 0, me[13] = 0, me[14] = 0;
            return v.clone().applyMatrix4(m).unit();
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        transformPoint(v) {
            return v.clone().applyMatrix4(_matrix);
        },

        /**
         * @param {Vector3} axis
         * @param {number} distance
         * @returns {Transform}
         */
        translateOnAxis(axis, distance) {
            const v = createVector3().copy(axis).applyQuaternion(_rotation)
                .mulScalar(distance);
            _position.add(v);
            return _transform;
        },

        /**
         * @param {number} distance
         * @returns {Transform}
         */
        translateX(distance) {
            return _transform.translateOnAxis(createVector3(1, 0, 0), distance);
        },

        /**
         * @param {number} distance
         * @returns {Transform}
         */
        translateY(distance) {
            return _transform.translateOnAxis(createVector3(0, 1, 0), distance);
        },

        /**
         * @param {number} distance
         * @returns {Transform}
         */
        translateZ(distance) {
            return _transform.translateOnAxis(createVector3(0, 0, 1), distance);
        },

        /**
         * @returns {Transform}
         */
        updateMatrix() {
            _matrix.compose(_position, _rotation, _scale);
            return _transform;
        },

        /**
         * @param {Vector3} point
         * @returns {Vector3}
         */
        worldToLocal(point) {
            const invMat = createMatrix4().copy(_matrix).invert();
            return point.clone().applyMatrix4(invMat);
        },
    };
    return _transform;
}
