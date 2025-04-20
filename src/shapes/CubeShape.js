import { createVector3 } from "../maths/Vector3.js";
import { createShape } from "./Shape.js";

/**
 * @typedef {import("./Shape.js").Shape} Shape
 * @typedef {Shape} CubeShape
 */

/**
 * @param {number} [size=1]
 * @returns {CubeShape}
 */
export function createCubeShape(size = 1) {
    const halfSize = size * 0.5;

    const fbl = createVector3(-halfSize, -halfSize, halfSize);
    const fbr = createVector3(halfSize, -halfSize, halfSize);
    const ftr = createVector3(halfSize, halfSize, halfSize);
    const ftl = createVector3(-halfSize, halfSize, halfSize);
    const bbl = createVector3(-halfSize, -halfSize, -halfSize);
    const bbr = createVector3(halfSize, -halfSize, -halfSize);
    const btr = createVector3(halfSize, halfSize, -halfSize);
    const btl = createVector3(-halfSize, halfSize, -halfSize);

    const frontFaceVertices = [
        fbl.x,
        fbl.y,
        fbl.z,
        fbr.x,
        fbr.y,
        fbr.z,
        ftr.x,
        ftr.y,
        ftr.z,
        ftl.x,
        ftl.y,
        ftl.z,
    ];
    const frontFaceNormals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    const frontFaceUvs = [0, 0, 1, 0, 1, 1, 0, 1];
    const frontFaceIndices = [0, 1, 2, 0, 2, 3];

    const backFaceVertices = [
        bbr.x,
        bbr.y,
        bbr.z,
        bbl.x,
        bbl.y,
        bbl.z,
        btl.x,
        btl.y,
        btl.z,
        btr.x,
        btr.y,
        btr.z,
    ];
    const backFaceNormals = [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1];
    const backFaceUvs = [0, 0, 1, 0, 1, 1, 0, 1];
    const backFaceIndices = [4, 5, 6, 4, 6, 7];

    const rightFaceVertices = [
        fbr.x,
        fbr.y,
        fbr.z,
        bbr.x,
        bbr.y,
        bbr.z,
        btr.x,
        btr.y,
        btr.z,
        ftr.x,
        ftr.y,
        ftr.z,
    ];
    const rightFaceNormals = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];
    const rightFaceUvs = [0, 0, 1, 0, 1, 1, 0, 1];
    const rightFaceIndices = [8, 9, 10, 8, 10, 11];

    const leftFaceVertices = [
        bbl.x,
        bbl.y,
        bbl.z,
        fbl.x,
        fbl.y,
        fbl.z,
        ftl.x,
        ftl.y,
        ftl.z,
        btl.x,
        btl.y,
        btl.z,
    ];
    const leftFaceNormals = [-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0];
    const leftFaceUvs = [0, 0, 1, 0, 1, 1, 0, 1];
    const leftFaceIndices = [12, 13, 14, 12, 14, 15];

    const topFaceVertices = [
        ftl.x,
        ftl.y,
        ftl.z,
        ftr.x,
        ftr.y,
        ftr.z,
        btr.x,
        btr.y,
        btr.z,
        btl.x,
        btl.y,
        btl.z,
    ];
    const topFaceNormals = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
    const topFaceUvs = [0, 0, 1, 0, 1, 1, 0, 1];
    const topFaceIndices = [16, 17, 18, 16, 18, 19];

    const bottomFaceVertices = [
        fbr.x,
        fbr.y,
        fbr.z,
        fbl.x,
        fbl.y,
        fbl.z,
        bbl.x,
        bbl.y,
        bbl.z,
        bbr.x,
        bbr.y,
        bbr.z,
    ];
    const bottomFaceNormals = [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0];
    const bottomFaceUvs = [0, 0, 1, 0, 1, 1, 0, 1];
    const bottomFaceIndices = [20, 21, 22, 20, 22, 23];

    const vertices = new Float32Array([
        ...frontFaceVertices,
        ...backFaceVertices,
        ...rightFaceVertices,
        ...leftFaceVertices,
        ...topFaceVertices,
        ...bottomFaceVertices,
    ]);
    const normals = new Float32Array([
        ...frontFaceNormals,
        ...backFaceNormals,
        ...rightFaceNormals,
        ...leftFaceNormals,
        ...topFaceNormals,
        ...bottomFaceNormals,
    ]);
    const uvs = new Float32Array([
        ...frontFaceUvs,
        ...backFaceUvs,
        ...rightFaceUvs,
        ...leftFaceUvs,
        ...topFaceUvs,
        ...bottomFaceUvs,
    ]);
    const indices = new Uint16Array([
        ...frontFaceIndices,
        ...backFaceIndices,
        ...rightFaceIndices,
        ...leftFaceIndices,
        ...topFaceIndices,
        ...bottomFaceIndices,
    ]);

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
        get isCubeShape() {
            return true;
        },

        /**
         * @param {CubeShape} source
         * @returns {CubeShape}
         */
        copy(source) {
            const shape = createShape();
            shape.copy.call(_shape, source);
            if (source.vertices) _shape.vertices.set(source.vertices);
            if (source.normals) _shape.normals.set(source.normals);
            if (source.uvs) _shape.uvs.set(source.uvs);
            if (source.indices) _shape.indices.set(source.indices);
            return _shape;
        },
    });
    return _shape;
}
