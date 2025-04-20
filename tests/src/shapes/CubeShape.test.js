import { BoxGeometry as ThreeBoxGeometry } from "three";
import { createCubeShape } from "../../../src/shapes/CubeShape.js";
import { createShape } from "../../../src/shapes/Shape.js";

describe("CubeShape core", () => {
    test("create / constructor", () => {
        const ourShape = createCubeShape();
        const threeGeometry = new ThreeBoxGeometry(1, 1, 1);

        expect(ourShape.isCubeShape).toBe(true);
        expect(ourShape.isShape).toBe(true);
        expect(ourShape.isObject3D).toBe(true);
        expect(threeGeometry.isBufferGeometry).toBe(true);

        expect(ourShape.vertices).toBeInstanceOf(Float32Array);
        expect(ourShape.normals).toBeInstanceOf(Float32Array);
        expect(ourShape.uvs).toBeInstanceOf(Float32Array);
        expect(ourShape.indices).toBeInstanceOf(Uint16Array);

        expect(ourShape.vertices.length).toBe(72); // 24 vertices * 3 components
        expect(ourShape.normals.length).toBe(72); // 24 vertices * 3 components
        expect(ourShape.uvs.length).toBe(48); // 24 vertices * 2 components
        expect(ourShape.indices.length).toBe(36); // 12 triangles * 3 indices
    });

    test("create - using size", () => {
        const size = 2;
        const ourShape = createCubeShape(size);

        const halfSize = size * 0.5;

        expect(ourShape.vertices[0]).toBe(-halfSize);
        expect(ourShape.vertices[1]).toBe(-halfSize);
        expect(ourShape.vertices[2]).toBe(halfSize);

        expect(ourShape.vertices[3]).toBe(halfSize);
        expect(ourShape.vertices[4]).toBe(-halfSize);
        expect(ourShape.vertices[5]).toBe(halfSize);
    });

    test("copy", () => {
        const ourShapeA = createCubeShape(2);
        const ourShapeB = createCubeShape(1);

        const origVertices = Array.from(ourShapeA.vertices);
        const origNormals = Array.from(ourShapeA.normals);
        const origUvs = Array.from(ourShapeA.uvs);
        const origIndices = Array.from(ourShapeA.indices);

        ourShapeB.copy(ourShapeA);

        for (let i = 0; i < origVertices.length; i++) {
            expect(ourShapeB.vertices[i]).toBe(origVertices[i]);
        }
        for (let i = 0; i < origNormals.length; i++) {
            expect(ourShapeB.normals[i]).toBe(origNormals[i]);
        }
        for (let i = 0; i < origUvs.length; i++) {
            expect(ourShapeB.uvs[i]).toBe(origUvs[i]);
        }
        for (let i = 0; i < origIndices.length; i++) {
            expect(ourShapeB.indices[i]).toBe(origIndices[i]);
        }
    });

    test("Shape inheritance", () => {
        const ourShape = createCubeShape();

        expect(ourShape.isShape).toBe(true);
        expect(ourShape.isObject3D).toBe(true);

        expect(typeof ourShape.setVertices).toBe("function");
        expect(typeof ourShape.setNormals).toBe("function");
        expect(typeof ourShape.setUVs).toBe("function");
        expect(typeof ourShape.setIndices).toBe("function");

        const newVertices = new Float32Array(ourShape.vertices);
        newVertices[0] = 5;

        ourShape.setVertices(newVertices);
        expect(ourShape.vertices[0]).toBe(5);
    });

    test("Object3D inheritance", () => {
        const ourShape = createCubeShape();

        expect(ourShape.isObject3D).toBe(true);
        expect(typeof ourShape.add).toBe("function");
        expect(typeof ourShape.remove).toBe("function");
        expect(typeof ourShape.updateMatrix).toBe("function");
        expect(typeof ourShape.updateWorldMatrix).toBe("function");

        const child = createShape();
        ourShape.add(child);

        expect(ourShape.children.length).toBe(1);
        expect(ourShape.children[0]).toBe(child);
        expect(child.parent).toBe(ourShape);

        ourShape.position.set(1, 2, 3);
        ourShape.updateWorldMatrix(false, true);

        expect(ourShape.worldMatrix.elements[12]).toBe(1);
        expect(ourShape.worldMatrix.elements[13]).toBe(2);
        expect(ourShape.worldMatrix.elements[14]).toBe(3);
    });
});
