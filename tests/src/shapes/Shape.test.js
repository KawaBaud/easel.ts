import { createShape } from "../../../src/shapes/Shape.js";

describe("Shape core", () => {
    test("create / constructor", () => {
        const shape = createShape();

        expect(shape.isShape).toBe(true);
        expect(shape.isObject3D).toBe(true);

        expect(shape.vertices).toBeInstanceOf(Float32Array);
        expect(shape.normals).toBeInstanceOf(Float32Array);
        expect(shape.uvs).toBeInstanceOf(Float32Array);
        expect(shape.indices).toBeInstanceOf(Uint16Array);

        expect(shape.vertices.length).toBe(0);
        expect(shape.normals.length).toBe(0);
        expect(shape.uvs.length).toBe(0);
        expect(shape.indices.length).toBe(0);
    });

    test("setVertices", () => {
        const shape = createShape();
        const vertices = new Float32Array([0, 1, 2, 3, 4, 5]);

        shape.setVertices(vertices);
        expect(shape.vertices).toBe(vertices);
        expect(shape.vertices.length).toBe(6);
    });

    test("setNormals", () => {
        const shape = createShape();
        const normals = new Float32Array([0, 1, 0, 0, 1, 0]);

        shape.setNormals(normals);
        expect(shape.normals).toBe(normals);
        expect(shape.normals.length).toBe(6);
    });

    test("setUVs", () => {
        const shape = createShape();
        const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);

        shape.setUVs(uvs);
        expect(shape.uvs).toBe(uvs);
        expect(shape.uvs.length).toBe(8);
    });

    test("setIndices", () => {
        const shape = createShape();
        const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

        shape.setIndices(indices);
        expect(shape.indices).toBe(indices);
        expect(shape.indices.length).toBe(6);
    });

    test("copy", () => {
        const shape1 = createShape();
        const vertices = new Float32Array([0, 1, 2, 3, 4, 5]);
        const normals = new Float32Array([0, 1, 0, 0, 1, 0]);
        const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
        const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

        shape1.setVertices(vertices);
        shape1.setNormals(normals);
        shape1.setUVs(uvs);
        shape1.setIndices(indices);

        const origPos = shape1.position.clone();
        origPos.set(1, 2, 3);
        const origQuat = shape1.quaternion.clone();
        origQuat.set(0, 1, 0, 0);
        const origScale = shape1.scale.clone();
        origScale.set(2, 2, 2);

        shape1.position.copy(origPos);
        shape1.quaternion.copy(origQuat);
        shape1.scale.copy(origScale);

        const shape2 = createShape();
        shape2.copy(shape1);

        expect(shape2.vertices).not.toBe(shape1.vertices);
        expect(shape2.normals).not.toBe(shape1.normals);
        expect(shape2.uvs).not.toBe(shape1.uvs);
        expect(shape2.indices).not.toBe(shape1.indices);

        expect(Array.from(shape2.vertices)).toEqual(
            Array.from(shape1.vertices),
        );
        expect(Array.from(shape2.normals)).toEqual(Array.from(shape1.normals));
        expect(Array.from(shape2.uvs)).toEqual(Array.from(shape1.uvs));
        expect(Array.from(shape2.indices)).toEqual(Array.from(shape1.indices));

        expect(shape2.position.x).toBeCloseTo(origPos.x);
        expect(shape2.position.y).toBeCloseTo(origPos.y);
        expect(shape2.position.z).toBeCloseTo(origPos.z);

        expect(shape2.quaternion.x).toBeCloseTo(origQuat.x);
        expect(shape2.quaternion.y).toBeCloseTo(origQuat.y);
        expect(shape2.quaternion.z).toBeCloseTo(origQuat.z);
        expect(shape2.quaternion.w).toBeCloseTo(origQuat.w);

        expect(shape2.scale.x).toBeCloseTo(origScale.x);
        expect(shape2.scale.y).toBeCloseTo(origScale.y);
        expect(shape2.scale.z).toBeCloseTo(origScale.z);
    });

    test("clone", () => {
        const shape1 = createShape();
        const vertices = new Float32Array([0, 1, 2, 3, 4, 5]);
        const normals = new Float32Array([0, 1, 0, 0, 1, 0]);
        const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
        const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

        shape1.setVertices(vertices);
        shape1.setNormals(normals);
        shape1.setUVs(uvs);
        shape1.setIndices(indices);

        const origPos = shape1.position.clone();
        origPos.set(1, 2, 3);

        shape1.position.copy(origPos);

        const shape2 = shape1.clone();

        expect(shape2.vertices).not.toBe(shape1.vertices);
        expect(shape2.normals).not.toBe(shape1.normals);
        expect(shape2.uvs).not.toBe(shape1.uvs);
        expect(shape2.indices).not.toBe(shape1.indices);

        expect(Array.from(shape2.vertices)).toEqual(
            Array.from(shape1.vertices),
        );
        expect(Array.from(shape2.normals)).toEqual(Array.from(shape1.normals));
        expect(Array.from(shape2.uvs)).toEqual(Array.from(shape1.uvs));
        expect(Array.from(shape2.indices)).toEqual(Array.from(shape1.indices));

        expect(shape2.position.x).toBeCloseTo(origPos.x);
        expect(shape2.position.y).toBeCloseTo(origPos.y);
        expect(shape2.position.z).toBeCloseTo(origPos.z);
    });

    test("Object3D inheritance", () => {
        const shape = createShape();

        expect(shape.isObject3D).toBe(true);
        expect(typeof shape.add).toBe("function");
        expect(typeof shape.remove).toBe("function");
        expect(typeof shape.updateMatrix).toBe("function");
        expect(typeof shape.updateWorldMatrix).toBe("function");

        const child = createShape();
        shape.add(child);

        expect(shape.children.length).toBe(1);
        expect(shape.children[0]).toBe(child);
        expect(child.parent).toBe(shape);

        shape.position.set(1, 2, 3);
        shape.updateWorldMatrix(false, true);

        expect(shape.worldMatrix.elements[12]).toBe(1);
        expect(shape.worldMatrix.elements[13]).toBe(2);
        expect(shape.worldMatrix.elements[14]).toBe(3);
    });
});
