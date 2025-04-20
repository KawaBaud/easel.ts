import { createSphere } from "../maths/Sphere.js";
import { createObject3D } from "../objects/Object3D.js";

/**
 * @typedef {import("../objects/Object3D.js").Object3D} Object3D
 * @typedef {import("../maths/Sphere.js").Sphere} Sphere
 * @typedef {Object3D} Shape
 * @property {Float32Array} vertices
 * @property {Float32Array} normals
 * @property {Float32Array} uvs
 * @property {Uint16Array} indices
 * @property {Sphere} [boundingSphere]
 */

/**
 * @returns {Shape}
 */
export function createShape() {
    const _shape = createObject3D();

    Object.assign(_shape, {
        vertices: new Float32Array(),
        normals: new Float32Array(),
        uvs: new Float32Array(),
        indices: new Uint16Array(),

        /**
         * @returns {boolean}
         */
        get isShape() {
            return true;
        },

        /**
         * @returns {Shape}
         */
        clone() {
            const newShape = createShape();
            newShape.copy(_shape);
            return newShape;
        },

        /**
         * @returns {Shape}
         */
        computeBoundingSphere() {
            if (!_shape.vertices || _shape.vertices.length === 0) return _shape;

            if (!_shape.boundingSphere) {
                _shape.boundingSphere = createSphere();
            }
            _shape.boundingSphere.setFromVertices(_shape.vertices);
            return _shape;
        },

        /**
         * @param {Shape} source
         * @returns {Shape}
         */
        copy(source) {
            _shape.position.copy(source.position);
            _shape.quaternion.copy(source.quaternion);
            _shape.scale.copy(source.scale);
            _shape.matrix.copy(source.matrix);
            _shape.worldMatrix.copy(source.worldMatrix);
            _shape.autoUpdateMatrix = source.autoUpdateMatrix;
            _shape.visible = source.visible;
            _shape.layers = source.layers;
            _shape.userData = JSON.parse(JSON.stringify(source.userData));

            if (source.vertices) {
                _shape.vertices = new Float32Array(source.vertices);
            }
            if (source.normals) {
                _shape.normals = new Float32Array(source.normals);
            }
            if (source.uvs) _shape.uvs = new Float32Array(source.uvs);
            if (source.indices) {
                _shape.indices = new Uint16Array(source.indices);
            }
            return _shape;
        },

        /**
         * @param {Uint16Array} indices
         * @returns {Shape}
         */
        setIndices(indices) {
            _shape.indices = indices;
            return _shape;
        },

        /**
         * @param {Float32Array} normals
         * @returns {Shape}
         */
        setNormals(normals) {
            _shape.normals = normals;
            return _shape;
        },

        /**
         * @param {Float32Array} uvs
         * @returns {Shape}
         */
        setUVs(uvs) {
            _shape.uvs = uvs;
            return _shape;
        },

        /**
         * @param {Float32Array} vertices
         * @returns {Shape}
         */
        setVertices(vertices) {
            _shape.vertices = vertices;
            return _shape;
        },
    });
    return _shape;
}
