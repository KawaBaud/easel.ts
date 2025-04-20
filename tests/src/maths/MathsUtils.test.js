import { MathsUtils } from "../../../src/maths/MathsUtils.js";

describe("MathsUtils", () => {
    describe("core", () => {
        test("clamp", () => {
            expect(MathsUtils.clamp(5, 0, 10)).toBe(5);
            expect(MathsUtils.clamp(-5, 0, 10)).toBe(0);
            expect(MathsUtils.clamp(15, 0, 10)).toBe(10);
        });

        test("constants", () => {
            expect(MathsUtils.DEGREES_TO_RADIANS * 180).toBeCloseTo(Math.PI, 5);
            expect(MathsUtils.RADIANS_TO_DEGREES * Math.PI).toBeCloseTo(180, 5);
            expect(MathsUtils.EPSILON).toBe(1e-4);
        });

        test("shrdiv", () => {
            expect(MathsUtils.shrdiv(10)).toBe(5);
            expect(MathsUtils.shrdiv(100)).toBe(50);
        });
    });

    describe("fixed-point maths", () => {
        test("toFixed and toFloat", () => {
            const values = [
                0,
                1,
                -1,
                0.5,
                -0.5,
                3.14159,
                -3.14159,
                1000,
                -1000,
            ];

            for (const value of values) {
                const fixed = MathsUtils.toFixed(value);
                const float = MathsUtils.toFloat(fixed);
                expect(float).toBeCloseTo(value, 3);
            }
        });

        test("qmul", () => {
            const testCases = [
                [1, 1, 1],
                [2, 3, 6],
                [0.5, 2, 1],
                [-1, 2, -2],
                [1.5, 2.5, 3.75],
            ];

            for (const [a, b, expected] of testCases) {
                const fixedA = MathsUtils.toFixed(a);
                const fixedB = MathsUtils.toFixed(b);
                const result = MathsUtils.qmul(fixedA, fixedB);
                expect(MathsUtils.toFloat(result)).toBeCloseTo(expected, 5);
            }
        });

        test("qdiv", () => {
            const testCases = [
                [6, 2, 3],
                [1, 2, 0.5],
                [10, 4, 2.5],
                [-6, 2, -3],
                [6, -2, -3],
            ];

            for (const [a, b, expected] of testCases) {
                const fixedA = MathsUtils.toFixed(a);
                const fixedB = MathsUtils.toFixed(b);
                const result = MathsUtils.qdiv(fixedA, fixedB);
                expect(MathsUtils.toFloat(result)).toBeCloseTo(expected, 5);
            }
        });
    });

    describe("fast maths", () => {
        test("fastTrunc", () => {
            expect(MathsUtils.fastTrunc(1.5)).toBe(1);
            expect(MathsUtils.fastTrunc(-1.5)).toBe(-1);
        });

        test("fastRound", () => {
            expect(MathsUtils.fastRound(1.4)).toBe(1);
            expect(MathsUtils.fastRound(1.5)).toBe(2);
        });

        test("fastFloor", () => {
            const testCases = [
                [1.5, 1],
                [1.9, 1],
                [1.0, 1],
                [0.1, 0],
                [-0.1, -1],
                [-1.0, -1],
                [-1.5, -2],
                [-1.9, -2],
            ];

            for (const [input, expected] of testCases) {
                const result = MathsUtils.fastFloor(input);
                expect(result).toBe(expected);
            }
        });
    });

    describe("coordinate conversion", () => {
        test("3D world -> 2D screen (floating-point)", () => {
            const worldX = 10;
            const worldY = 20;
            const worldZ = 100;

            const halfWidth = 320;
            const halfHeight = 240;

            const expectedX = (worldX / worldZ) * halfWidth + halfWidth;
            const expectedY = halfHeight - (worldY / worldZ) * halfHeight;
            expect(expectedX).toBe(352);
            expect(expectedY).toBe(192);
        });

        test("3D world -> 2D screen (fixed-point)", () => {
            const worldX = MathsUtils.toFixed(10);
            const worldY = MathsUtils.toFixed(20);
            const worldZ = MathsUtils.toFixed(100);

            const halfWidth = MathsUtils.toFixed(320);
            const halfHeight = MathsUtils.toFixed(240);

            const scale = MathsUtils.qdiv(MathsUtils.Q_ONE, worldZ);

            const screenX = MathsUtils.qmul(worldX, scale);
            const screenY = MathsUtils.qmul(worldY, scale);
            const x = MathsUtils.toFloat(
                MathsUtils.qmul(screenX, halfWidth) + halfWidth,
            );
            const y = MathsUtils.toFloat(
                halfHeight - MathsUtils.qmul(screenY, halfHeight),
            );
            expect(Math.round(x / 10) * 10).toBe(320);
            expect(Math.round(y / 10) * 10).toBe(240);
        });
    });
});
