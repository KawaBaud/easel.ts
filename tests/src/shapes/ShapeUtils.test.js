import { MathsUtils } from "../../../src/maths/MathsUtils.js";
import { createVector3 } from "../../../src/maths/Vector3.js";
import { ShapeUtils } from "../../../src/shapes/ShapeUtils.js";

describe("ShapeUtils core", () => {
    test("addQuad", () => {
        const indices = new Uint16Array(6);
        const offset = ShapeUtils.addQuad(indices, 0, 0, 1, 2, 3);

        expect(offset).toBe(6);
        expect(indices[0]).toBe(0);
        expect(indices[1]).toBe(1);
        expect(indices[2]).toBe(2);
        expect(indices[3]).toBe(0);
        expect(indices[4]).toBe(2);
        expect(indices[5]).toBe(3);
    });

    test("areaTriangle", () => {
        const v1 = createVector3(0, 0, 0);
        const v2 = createVector3(1, 0, 0);
        const v3 = createVector3(0, 1, 0);

        const area = ShapeUtils.areaTriangle(v1, v2, v3);
        expect(area).toBeCloseTo(0.5, 5);
    });

    test("areaTriangleFixed", () => {
        const x1 = MathsUtils.toFixed(0);
        const y1 = MathsUtils.toFixed(0);
        const x2 = MathsUtils.toFixed(1);
        const y2 = MathsUtils.toFixed(0);
        const x3 = MathsUtils.toFixed(0);
        const y3 = MathsUtils.toFixed(1);

        const area = ShapeUtils.areaTriangleFixed(x1, y1, x2, y2, x3, y3);
        expect(MathsUtils.toFloat(area)).toBeCloseTo(0.5, 5);
    });

    test("pointInTriangle", () => {
        const x1 = 0, y1 = 0;
        const x2 = 1, y2 = 0;
        const x3 = 0, y3 = 1;

        expect(ShapeUtils.pointInTriangle(0.25, 0.25, x1, y1, x2, y2, x3, y3))
            .toBe(true);
        expect(ShapeUtils.pointInTriangle(0.5, 0, x1, y1, x2, y2, x3, y3)).toBe(
            true,
        );
        expect(ShapeUtils.pointInTriangle(0.75, 0.75, x1, y1, x2, y2, x3, y3))
            .toBe(false);
    });

    test("triangulate - triangle", () => {
        const vertices = new Float32Array([
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            1,
            0,
        ]);
        const indices = new Uint16Array(3);
        const polygonIndices = [0, 1, 2];

        const offset = ShapeUtils.triangulate(
            vertices,
            indices,
            polygonIndices,
            0,
        );

        expect(offset).toBe(3);
        expect(indices[0]).toBe(0);
        expect(indices[1]).toBe(1);
        expect(indices[2]).toBe(2);
    });

    test("triangulate - quad", () => {
        const vertices = new Float32Array([
            0,
            0,
            0,
            1,
            0,
            0,
            1,
            1,
            0,
            0,
            1,
            0,
        ]);
        const indices = new Uint16Array(6);
        const polygonIndices = [0, 1, 2, 3];

        const offset = ShapeUtils.triangulate(
            vertices,
            indices,
            polygonIndices,
            0,
        );

        expect(offset).toBe(6);
        expect(indices[0]).toBe(0);
        expect(indices[1]).toBe(1);
        expect(indices[2]).toBe(2);
        expect(indices[3]).toBe(0);
        expect(indices[4]).toBe(2);
        expect(indices[5]).toBe(3);
    });

    test("worldToScreenFixed", () => {
        const worldX = MathsUtils.toFixed(10);
        const worldY = MathsUtils.toFixed(20);
        const worldZ = MathsUtils.toFixed(100);
        const halfWidth = MathsUtils.toFixed(160);
        const halfHeight = MathsUtils.toFixed(120);
        const cameraDistance = MathsUtils.toFixed(400);

        const result = ShapeUtils.worldToScreenFixed(
            worldX,
            worldY,
            worldZ,
            halfWidth,
            halfHeight,
            cameraDistance,
        );

        expect(result.x).toBeCloseTo(160, 0);
        expect(result.y).toBeCloseTo(120, 0);
        expect(result.z).toBeGreaterThan(worldZ);
    });

    test("worldToScreenFixed with point behind camera", () => {
        const worldX = MathsUtils.toFixed(10);
        const worldY = MathsUtils.toFixed(20);
        const worldZ = MathsUtils.toFixed(-500); // behind camera
        const halfWidth = MathsUtils.toFixed(160);
        const halfHeight = MathsUtils.toFixed(120);
        const cameraDistance = MathsUtils.toFixed(400);

        const result = ShapeUtils.worldToScreenFixed(
            worldX,
            worldY,
            worldZ,
            halfWidth,
            halfHeight,
            cameraDistance,
        );

        expect(result.x).toBe(-32768);
        expect(result.y).toBe(-32768);
        expect(result.z).toBe(32767);
    });
});
