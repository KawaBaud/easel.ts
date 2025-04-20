import { createRectangleShape } from "../../../src/shapes/RectangleShape.js";

describe("RectangleShape core", () => {
    test("create / constructor", () => {
        const rectangleShape = createRectangleShape();

        expect(rectangleShape.isRectangleShape).toBe(true);
        expect(rectangleShape.isShape).toBe(true);
        expect(rectangleShape.isObject3D).toBe(true);

        expect(rectangleShape.vertices).toBeInstanceOf(Float32Array);
        expect(rectangleShape.normals).toBeInstanceOf(Float32Array);
        expect(rectangleShape.uvs).toBeInstanceOf(Float32Array);
        expect(rectangleShape.indices).toBeInstanceOf(Uint16Array);

        expect(rectangleShape.vertices.length).toBe(12); // 4 vertices * 3 components
        expect(rectangleShape.normals.length).toBe(12); // 4 vertices * 3 components
        expect(rectangleShape.uvs.length).toBe(8); // 4 vertices * 2 components
        expect(rectangleShape.indices.length).toBe(6); // 2 triangles * 3 indices
    });

    test("dimensions", () => {
        const rectangleShape = createRectangleShape(2, 3);

        // BL vertex
        expect(rectangleShape.vertices[0]).toBeCloseTo(-1, 5);
        expect(rectangleShape.vertices[1]).toBeCloseTo(-1.5, 5);
        expect(rectangleShape.vertices[2]).toBeCloseTo(0, 5);

        // BR vertex
        expect(rectangleShape.vertices[3]).toBeCloseTo(1, 5);
        expect(rectangleShape.vertices[4]).toBeCloseTo(-1.5, 5);
        expect(rectangleShape.vertices[5]).toBeCloseTo(0, 5);

        // TR vertex
        expect(rectangleShape.vertices[6]).toBeCloseTo(1, 5);
        expect(rectangleShape.vertices[7]).toBeCloseTo(1.5, 5);
        expect(rectangleShape.vertices[8]).toBeCloseTo(0, 5);

        // TL vertex
        expect(rectangleShape.vertices[9]).toBeCloseTo(-1, 5);
        expect(rectangleShape.vertices[10]).toBeCloseTo(1.5, 5);
        expect(rectangleShape.vertices[11]).toBeCloseTo(0, 5);
    });

    test("normals", () => {
        const rectangleShape = createRectangleShape();

        // All normals should point in the positive Z direction
        for (let i = 0; i < 4; i++) {
            const idx = i * 3;
            expect(rectangleShape.normals[idx]).toBe(0);
            expect(rectangleShape.normals[idx + 1]).toBe(0);
            expect(rectangleShape.normals[idx + 2]).toBe(1);
        }
    });

    test("uvs", () => {
        const rectangleShape = createRectangleShape();

        // BL: (0, 0)
        expect(rectangleShape.uvs[0]).toBe(0);
        expect(rectangleShape.uvs[1]).toBe(0);

        // BR: (1, 0)
        expect(rectangleShape.uvs[2]).toBe(1);
        expect(rectangleShape.uvs[3]).toBe(0);

        // TR: (1, 1)
        expect(rectangleShape.uvs[4]).toBe(1);
        expect(rectangleShape.uvs[5]).toBe(1);

        // TL: (0, 1)
        expect(rectangleShape.uvs[6]).toBe(0);
        expect(rectangleShape.uvs[7]).toBe(1);
    });

    test("indices", () => {
        const rectangleShape = createRectangleShape();

        // 1st triangle: 0, 1, 2
        expect(rectangleShape.indices[0]).toBe(0);
        expect(rectangleShape.indices[1]).toBe(1);
        expect(rectangleShape.indices[2]).toBe(2);

        // 2nd triangle: 0, 2, 3
        expect(rectangleShape.indices[3]).toBe(0);
        expect(rectangleShape.indices[4]).toBe(2);
        expect(rectangleShape.indices[5]).toBe(3);
    });

    test("bounding sphere", () => {
        const rectangleShape = createRectangleShape(2, 2);

        expect(rectangleShape.boundingSphere).toBeDefined();
        expect(rectangleShape.boundingSphere.centre.x).toBeCloseTo(0, 5);
        expect(rectangleShape.boundingSphere.centre.y).toBeCloseTo(0, 5);
        expect(rectangleShape.boundingSphere.centre.z).toBeCloseTo(0, 5);
        expect(rectangleShape.boundingSphere.radius).toBeCloseTo(
            Math.sqrt(2),
            5,
        );
    });

    test("clone", () => {
        const rectangleShape1 = createRectangleShape(2, 3);
        rectangleShape1.position.set(1, 2, 3);

        const rectangleShape2 = rectangleShape1.clone();

        expect(rectangleShape2.vertices.length).toBe(
            rectangleShape1.vertices.length,
        );
        expect(rectangleShape2.normals.length).toBe(
            rectangleShape1.normals.length,
        );
        expect(rectangleShape2.uvs.length).toBe(rectangleShape1.uvs.length);
        expect(rectangleShape2.indices.length).toBe(
            rectangleShape1.indices.length,
        );

        expect(rectangleShape2.position.x).toBe(1);
        expect(rectangleShape2.position.y).toBe(2);
        expect(rectangleShape2.position.z).toBe(3);
    });
});
