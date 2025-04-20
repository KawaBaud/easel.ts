import { createVector3 } from "../maths/Vector3.js";
import { createShape } from "./Shape.js";
import { ShapeUtils } from "./ShapeUtils.js";

/**
 * @typedef {import("./Shape.js").Shape} Shape
 * @typedef {Shape} RectangleShape
 */

/**
 * @param {number} [width=1]
 * @param {number} [height=1]
 * @returns {RectangleShape}
 */
export function createRectangleShape(width = 1, height = 1) {
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;

    const bl = createVector3(-halfWidth, -halfHeight, 0);
    const br = createVector3(halfWidth, -halfHeight, 0);
    const tr = createVector3(halfWidth, halfHeight, 0);
    const tl = createVector3(-halfWidth, halfHeight, 0);

    const vertices = new Float32Array([
        bl.x,
        bl.y,
        bl.z,
        br.x,
        br.y,
        br.z,
        tr.x,
        tr.y,
        tr.z,
        tl.x,
        tl.y,
        tl.z,
    ]);
    const normals = new Float32Array([
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
    ]);
    const uvs = new Float32Array([
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
    ]);
    const indices = new Uint16Array(6);

    ShapeUtils.addQuad(indices, 0, 0, 1, 2, 3);

    const _shape = createShape();
    _shape.setVertices(vertices);
    _shape.setNormals(normals);
    _shape.setUVs(uvs);
    _shape.setIndices(indices);
    _shape.computeBoundingSphere();

    Object.assign(_shape, {
        /**
         * @returns {boolean}
         */
        get isRectangleShape() {
            return true;
        },

        /**
         * @returns {RectangleShape}
         */
        clone() {
            const newShape = createRectangleShape();
            newShape.copy(_shape);
            newShape.position.copy(_shape.position);
            newShape.quaternion.copy(_shape.quaternion);
            newShape.scale.copy(_shape.scale);
            return newShape;
        },

        /**
         * @param {RectangleShape} source
         * @returns {RectangleShape}
         */
        copy(source) {
            createShape().copy.call(_shape, source);

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
            if (source.boundingSphere) _shape.computeBoundingSphere();
            return _shape;
        },
    });

    return _shape;
}
