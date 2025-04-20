import { MathsUtils } from "../../../src/maths/MathsUtils.js";

describe("MathsUtils", () => {
    describe("basics", () => {
        test("clamp", () => {
            expect(MathsUtils.clamp(5, 0, 10)).toBe(5);
            expect(MathsUtils.clamp(-5, 0, 10)).toBe(0);
            expect(MathsUtils.clamp(15, 0, 10)).toBe(10);
        });

        test("constants", () => {
            expect(MathsUtils.HALF_PI).toBeCloseTo(Math.PI / 2, 10);
            expect(MathsUtils.QUARTER_PI).toBeCloseTo(Math.PI / 4, 10);
            expect(MathsUtils.THIRD_PI).toBeCloseTo(Math.PI / 3, 10);
            expect(MathsUtils.SIXTH_PI).toBeCloseTo(Math.PI / 6, 10);
            expect(MathsUtils.TAU).toBeCloseTo(Math.PI * 2, 10);
            expect(MathsUtils.PISQ).toBeCloseTo(Math.PI * Math.PI, 10);

            expect(MathsUtils.DEGREES_TO_RADIANS * 180).toBeCloseTo(
                Math.PI,
                10,
            );
            expect(MathsUtils.RADIANS_TO_DEGREES * Math.PI).toBeCloseTo(
                180,
                10,
            );

            expect(MathsUtils.EPSILON).toBe(1e-4);
        });

        test("ipow", () => {
            expect(MathsUtils.ipow(2, 0)).toBe(1);
            expect(MathsUtils.ipow(2, 1)).toBe(2);
            expect(MathsUtils.ipow(2, 3)).toBe(8);
            expect(MathsUtils.ipow(3, 2)).toBe(9);
            expect(MathsUtils.ipow(2, -2)).toBe(0.25);
        });

        test("shlmul", () => {
            expect(MathsUtils.shlmul(5)).toBe(10);
            expect(MathsUtils.shlmul(5, 2)).toBe(20);
            expect(MathsUtils.shlmul(5, 3)).toBe(40);
        });

        test("shrdiv", () => {
            expect(MathsUtils.shrdiv(10)).toBe(5);
            expect(MathsUtils.shrdiv(100)).toBe(50);
            expect(MathsUtils.shrdiv(16, 2)).toBe(4);
            expect(MathsUtils.shrdiv(16, 3)).toBe(2);
        });

        test("smoothstep", () => {
            expect(MathsUtils.smoothstep(-0.5)).toBe(0);
            expect(MathsUtils.smoothstep(0)).toBe(0);
            expect(MathsUtils.smoothstep(0.25)).toBeCloseTo(0.15625, 5);
            expect(MathsUtils.smoothstep(0.5)).toBeCloseTo(0.5, 5);
            expect(MathsUtils.smoothstep(0.75)).toBeCloseTo(0.84375, 5);
            expect(MathsUtils.smoothstep(1)).toBe(1);
            expect(MathsUtils.smoothstep(1.5)).toBe(1);
        });

        test("smootherstep", () => {
            expect(MathsUtils.smootherstep(-0.5)).toBe(0);
            expect(MathsUtils.smootherstep(0)).toBe(0);
            expect(MathsUtils.smootherstep(0.25)).toBeCloseTo(0.103515625, 5);
            expect(MathsUtils.smootherstep(0.5)).toBeCloseTo(0.5, 5);
            expect(MathsUtils.smootherstep(0.75)).toBeCloseTo(0.896484375, 5);
            expect(MathsUtils.smootherstep(1)).toBe(1);
            expect(MathsUtils.smootherstep(1.5)).toBe(1);
        });

        test("toDegrees and toRadians", () => {
            expect(MathsUtils.toDegrees(Math.PI)).toBeCloseTo(180, 10);
            expect(MathsUtils.toDegrees(MathsUtils.HALF_PI)).toBeCloseTo(
                90,
                10,
            );
            expect(MathsUtils.toDegrees(MathsUtils.QUARTER_PI)).toBeCloseTo(
                45,
                10,
            );

            expect(MathsUtils.toRadians(180)).toBeCloseTo(Math.PI, 10);
            expect(MathsUtils.toRadians(90)).toBeCloseTo(
                MathsUtils.HALF_PI,
                10,
            );
            expect(MathsUtils.toRadians(45)).toBeCloseTo(
                MathsUtils.QUARTER_PI,
                10,
            );
        });
    });

    describe("fast maths", () => {
        test("fastAtan2", () => {
            const testCases = [
                { y: 0, x: 1, expected: 0 },
                { y: 1, x: 0, expected: MathsUtils.HALF_PI },
                { y: 0, x: -1, expected: Math.PI },
                { y: -1, x: 0, expected: -MathsUtils.HALF_PI },
                { y: 1, x: 1, expected: MathsUtils.QUARTER_PI },
                { y: 1, x: -1, expected: 3 * MathsUtils.QUARTER_PI },
                { y: -1, x: -1, expected: -3 * MathsUtils.QUARTER_PI },
                { y: -1, x: 1, expected: -MathsUtils.QUARTER_PI },
                { y: 0, x: 0, expected: 0 },
            ];

            for (const { y, x, expected } of testCases) {
                const result = MathsUtils.fastAtan2(y, x);
                expect(result).toBeCloseTo(expected, 2);
            }
        });

        test("fastCeil", () => {
            expect(MathsUtils.fastCeil(1.5)).toBe(2);
            expect(MathsUtils.fastCeil(1.0)).toBe(1);
            expect(MathsUtils.fastCeil(-1.5)).toBe(-1);
            expect(MathsUtils.fastCeil(-1.0)).toBe(-1);
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

        test("fastRound", () => {
            expect(MathsUtils.fastRound(1.4)).toBe(1);
            expect(MathsUtils.fastRound(1.5)).toBe(2);
            expect(MathsUtils.fastRound(-1.4)).toBe(0); // fastTrunc(-1.4 + 0.5) = fastTrunc(-0.9) = 0
            expect(MathsUtils.fastRound(-1.5)).toBe(-1); // fastTrunc(-1.5 + 0.5) = fastTrunc(-1.0) = -1
        });

        test("fastTrunc", () => {
            expect(MathsUtils.fastTrunc(1.5)).toBe(1);
            expect(MathsUtils.fastTrunc(-1.5)).toBe(-1);
            expect(MathsUtils.fastTrunc(0)).toBe(0);
        });
    });

    describe("fixed-point maths", () => {
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

            const fixedA = MathsUtils.toFixed(10);
            const fixedB = MathsUtils.toFixed(0);
            const result = MathsUtils.qdiv(fixedA, fixedB);
            expect(result).toBe(0x7FFFFFFF);

            const fixedNegA = MathsUtils.toFixed(-10);
            const resultNeg = MathsUtils.qdiv(fixedNegA, fixedB);
            expect(resultNeg).toBe(-0x7FFFFFFF);
        });

        test("qfloor", () => {
            const testCases = [
                [1.5, 1],
                [1.9, 1],
                [1.0, 1],
                [0.1, 0],
                [-0.1, -1],
                [-1.0, -1],
                [-1.5, -2],
            ];

            for (const [input, expected] of testCases) {
                const fixedInput = MathsUtils.toFixed(input);
                const result = MathsUtils.qfloor(fixedInput);
                expect(MathsUtils.toFloat(result)).toBeCloseTo(expected, 5);
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

        test("qsin and qcos", () => {
            const angles = [
                0,
                MathsUtils.SIXTH_PI,
                MathsUtils.QUARTER_PI,
                MathsUtils.THIRD_PI,
                MathsUtils.HALF_PI,
                Math.PI,
                3 * MathsUtils.HALF_PI,
                MathsUtils.TAU,
            ];

            for (const angle of angles) {
                const qsinResult = MathsUtils.toFloat(MathsUtils.qsin(angle));
                const qcosResult = MathsUtils.toFloat(MathsUtils.qcos(angle));

                expect(qsinResult).toBeCloseTo(Math.sin(angle), 2);
                expect(qcosResult).toBeCloseTo(Math.cos(angle), 2);
            }
        });

        test("qtrunc", () => {
            const testCases = [
                [1.5, 1],
                [1.9, 1],
                [1.0, 1],
                [0.1, 0],
                [-0.1, 0],
                [-1.0, -1],
                [-1.5, -1],
                [-1.9, -1],
            ];

            for (const [input, expected] of testCases) {
                const fixedInput = MathsUtils.toFixed(input);
                const result = MathsUtils.qtrunc(fixedInput);
                expect(MathsUtils.toFloat(result)).toBeCloseTo(expected, 5);
            }
        });

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
    });

    describe("conversions - coordinates", () => {
        test("float: 3D world -> 2D screen", () => {
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

        test("fixed: 3D world -> 2D screen", () => {
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
