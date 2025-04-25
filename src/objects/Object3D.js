import { createMatrix4 } from "../maths/Matrix4.js";
import { createQuaternion } from "../maths/Quaternion.js";
import { createVector3 } from "../maths/Vector3.js";

/**
 * @typedef {import("../maths/Vector3.js").Vector3} Vector3
 * @typedef {import("../maths/Quaternion.js").Quaternion} Quaternion
 * @typedef {import("../maths/Matrix4.js").Matrix4} Matrix4
 * @typedef {Object} Object3D
 * @property {string} id
 * @property {Vector3} position
 * @property {Quaternion} quaternion
 * @property {Vector3} scale
 * @property {Matrix4} matrix
 * @property {Matrix4} worldMatrix
 * @property {boolean} autoUpdateMatrix
 * @property {Object3D|null} parent
 * @property {Array<Object3D>} children
 * @property {boolean} visible
 * @property {number} layers
 * @property {Object} userData
 * @property {boolean} isObject3D
 */

const _q = createQuaternion();
const _m = createMatrix4();
const _up = createVector3(0, 1, 0);
const _xAxis = createVector3(1, 0, 0);
const _yAxis = createVector3(0, 1, 0);
const _zAxis = createVector3(0, 0, 1);
const _v1 = createVector3();
const _position = createVector3();
const _scale = createVector3();

/**
 * @param {string} [id=""]
 * @returns {Object3D}
 */
export function createObject3D(id = "") {
    const _object = {
        /**
         * @type {string}
         * @default ""
         */
        id,

        /**
         * @type {Vector3}
         * @default createVector3()
         */
        position: createVector3(),

        /**
         * @type {Quaternion}
         * @default createQuaternion()
         */
        quaternion: createQuaternion(),

        /**
         * @type {Vector3}
         * @default createVector3(1, 1, 1)
         */
        scale: createVector3(1, 1, 1),

        /**
         * @type {Matrix4}
         * @default createMatrix4().identity()
         */
        matrix: createMatrix4().identity(),

        /**
         * @type {Matrix4}
         * @default createMatrix4().identity()
         */
        worldMatrix: createMatrix4().identity(),

        /**
         * @type {boolean}
         * @default true
         */
        autoUpdateMatrix: true,

        /**
         * @type {Object3D|null}
         * @default null
         */
        parent: null,

        /**
         * @type {Array<Object3D>}
         * @default []
         */
        children: [],

        /**
         * @type {boolean}
         * @default true
         */
        visible: true,

        /**
         * @type {number}
         * @default 1
         */
        layers: 1,

        /**
         * @type {Object}
         * @default {}
         */
        userData: {},

        /**
         * @type {boolean}
         * @readonly
         * @default true
         */
        isObject3D: true,

        /**
         * @param {Object3D} object
         * @returns {Object3D}
         */
        add(object) {
            if (object === _object) return _object;
            if (object.parent) object.parent.remove(object);

            object.parent = _object;
            _object.children.push(object);
            return _object;
        },

        /**
         * @param {Matrix4} m
         * @returns {Object3D}
         */
        applyMatrix4(m) {
            _object.matrix.premul(m);
            _object.matrix.decompose(
                _object.position,
                _object.quaternion,
                _object.scale,
            );
            return _object;
        },

        /**
         * @param {Quaternion} q
         * @returns {Object3D}
         */
        applyQuaternion(q) {
            _object.quaternion.premultiply(q);
            return _object;
        },

        /**
         * @param {Object3D} object
         * @returns {Object3D}
         */
        attach(object) {
            const m = createMatrix4();
            m.copy(_object.worldMatrix).inv();

            if (object.parent) {
                object.parent.updateWorldMatrix(true, false);
                m.mulMatrices(m, object.parent.worldMatrix);
                object.parent.remove(object);
            }

            object.applyMatrix4(m);
            _object.add(object);
            return _object;
        },

        /**
         * @returns {Object3D}
         */
        clear() {
            while (_object.children.length > 0) {
                _object.remove(_object.children[0]);
            }
            return _object;
        },

        /**
         * @param {boolean} [recursive=true]
         * @returns {Object3D}
         */
        clone(recursive = true) {
            return createObject3D().copy(_object, recursive);
        },

        /**
         * @param {Object3D} source
         * @param {boolean} [recursive=true]
         * @returns {Object3D}
         */
        copy(source, recursive = true) {
            _object.id = source.id;
            _object.position.copy(source.position);
            _object.quaternion.copy(source.quaternion);
            _object.scale.copy(source.scale);
            _object.matrix.copy(source.matrix);
            _object.worldMatrix.copy(source.worldMatrix);
            _object.autoUpdateMatrix = source.autoUpdateMatrix;
            _object.parent = null;
            _object.children = [];
            _object.visible = source.visible;
            _object.layers = source.layers;
            _object.userData = JSON.parse(JSON.stringify(source.userData));

            if (recursive) {
                for (let i = 0; i < source.children.length; i++) {
                    const child = source.children[i];
                    _object.add(createObject3D().copy(child, recursive));
                }
            }
            return _object;
        },

        /**
         * @param {number} layer
         * @returns {Object3D}
         */
        disableLayer(layer) {
            _object.layers &= ~(1 << layer);
            return _object;
        },

        /**
         * @param {number} layer
         * @returns {Object3D}
         */
        enableLayer(layer) {
            _object.layers |= 1 << layer;
            return _object;
        },

        /**
         * @param {number} id
         * @returns {Object3D|null}
         */
        getObjectById(id) {
            return _object.getObjectByProperty("id", id);
        },

        /**
         * @param {string} name
         * @returns {Object3D|null}
         */
        getObjectByName(name) {
            return _object.getObjectByProperty("name", name);
        },

        /**
         * @param {string} name
         * @param {any} value
         * @returns {Object3D|null}
         */
        getObjectByProperty(name, value) {
            if (_object[name] === value) return _object;

            for (let i = 0, l = _object.children.length; i < l; i++) {
                const child = _object.children[i];
                const object = child.getObjectByProperty(name, value);
                if (object !== null) return object;
            }
            return null;
        },

        /**
         * @param {string} name
         * @param {any} value
         * @param {Array<Object3D>} [result=[]]
         * @returns {Array<Object3D>}
         */
        getObjectsByProperty(name, value, result = []) {
            if (_object[name] === value) result.push(_object);

            for (let i = 0, l = _object.children.length; i < l; i++) {
                _object.children[i].getObjectsByProperty(name, value, result);
            }

            return result;
        },

        /**
         * @param {Vector3} [target=createVector3()]
         * @returns {Vector3}
         */
        getWorldDirection(target = createVector3()) {
            _object.updateWorldMatrix(true, false);
            const e = _object.worldMatrix.elements;
            return target.set(e[8], e[9], e[10]).unit();
        },

        /**
         * @param {Vector3} [target=createVector3()]
         * @returns {Vector3}
         */
        getWorldPosition(target = createVector3()) {
            _object.updateWorldMatrix(true, false);
            const e = _object.worldMatrix.elements;
            return target.set(e[12], e[13], e[14]);
        },

        /**
         * @param {Quaternion} [target=createQuaternion()]
         * @returns {Quaternion}
         */
        getWorldQuaternion(target = createQuaternion()) {
            _object.updateWorldMatrix(true, false);
            _object.worldMatrix.decompose(_position, target, _scale);
            return target;
        },

        /**
         * @param {Vector3} [target=createVector3()]
         * @returns {Vector3}
         */
        getWorldScale(target = createVector3()) {
            _object.updateWorldMatrix(true, false);
            _object.worldMatrix.decompose(_position, _q, target);
            return target;
        },

        /**
         * @param {number} layer
         * @returns {boolean}
         */
        isInLayer(layer) {
            return (_object.layers & (1 << layer)) !== 0;
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        localToWorld(v) {
            _object.updateWorldMatrix(true, false);
            return v.applyMatrix4(_object.worldMatrix);
        },

        /**
         * @param {Vector3} target
         * @returns {Object3D}
         */
        lookAt(target) {
            _m.lookAt(target, _object.position, _up);
            _object.quaternion.setFromRotationMatrix(_m);
            return _object;
        },

        /**
         * @param {Object3D} object
         * @returns {Object3D}
         */
        remove(object) {
            const index = _object.children.indexOf(object);
            if (index !== -1) {
                object.parent = null;
                _object.children.splice(index, 1);
            }

            return _object;
        },

        /**
         * @param {Vector3} axis
         * @param {number} angle - in radians
         * @returns {Object3D}
         */
        rotateOnWorldAxis(axis, angle) {
            _q.setFromAxisAngle(axis, angle);
            _object.quaternion.premul(_q);
            return _object;
        },

        /**
         * @param {number} angle - in radians
         * @returns {Object3D}
         */
        rotateX(angle) {
            _q.setFromAxisAngle(_xAxis, angle);
            _object.quaternion.mul(_q);
            return _object;
        },

        /**
         * @param {number} angle - in radians
         * @returns {Object3D}
         */
        rotateY(angle) {
            _q.setFromAxisAngle(_yAxis, angle);
            _object.quaternion.mul(_q);
            return _object;
        },

        /**
         * @param {number} angle - in radians
         * @returns {Object3D}
         */
        rotateZ(angle) {
            _q.setFromAxisAngle(_zAxis, angle);
            _object.quaternion.mul(_q);
            return _object;
        },

        /**
         * @param {number} layer
         * @returns {Object3D}
         */
        setLayer(layer) {
            _object.layers = 1 << layer;
            return _object;
        },

        /**
         * @param {Vector3} axis
         * @param {number} distance
         * @returns {Object3D}
         */
        translateOnAxis(axis, distance) {
            _v1.copy(axis).applyQuaternion(_object.quaternion);
            _object.position.add(_v1.mulScalar(distance));
            return _object;
        },

        /**
         * @param {number} distance
         * @returns {Object3D}
         */
        translateX(distance) {
            return _object.translateOnAxis(_xAxis, distance);
        },

        /**
         * @param {number} distance
         * @returns {Object3D}
         */
        translateY(distance) {
            return _object.translateOnAxis(_yAxis, distance);
        },

        /**
         * @param {number} distance
         * @returns {Object3D}
         */
        translateZ(distance) {
            return _object.translateOnAxis(_zAxis, distance);
        },

        /**
         * @param {Function} callback
         * @returns {Object3D}
         */
        traverse(callback) {
            callback(_object);
            for (const child of _object.children) {
                child.traverse(callback);
            }
            return _object;
        },

        /**
         * @param {Function} callback
         * @returns {Object3D}
         */
        traverseAncestors(callback) {
            if (_object.parent) {
                callback(_object.parent);
                _object.parent.traverseAncestors(callback);
            }

            return _object;
        },

        /**
         * @param {Function} callback
         * @returns {Object3D}
         */
        traverseVisible(callback) {
            if (!_object.visible) return _object;

            callback(_object);
            for (const child of _object.children) {
                if (child.visible) child.traverseVisible(callback);
            }

            return _object;
        },

        /**
         * @returns {Object3D}
         */
        updateMatrix() {
            _object.matrix.compose(
                _object.position,
                _object.quaternion,
                _object.scale,
            );
            return _object;
        },

        /**
         * @param {boolean} [updateParents=false]
         * @param {boolean} [updateChildren=false]
         * @returns {Object3D}
         */
        updateWorldMatrix(updateParents = false, updateChildren = false) {
            if (updateParents && _object.parent) {
                _object.parent.updateWorldMatrix(true, false);
            }

            if (_object.autoUpdateMatrix) _object.updateMatrix();
            _object.worldMatrix = _object.parent
                ? _object.worldMatrix.mulMatrices(
                    _object.parent.worldMatrix,
                    _object.matrix,
                )
                : _object.worldMatrix.copy(_object.matrix);

            if (updateChildren) {
                for (const child of _object.children) {
                    child.updateWorldMatrix(false, true);
                }
            }

            return _object;
        },

        /**
         * @param {Vector3} v
         * @returns {Vector3}
         */
        worldToLocal(v) {
            _object.updateWorldMatrix(true, false);
            return v.applyMatrix4(_m.copy(_object.worldMatrix).inv());
        },
    };

    return _object;
}
