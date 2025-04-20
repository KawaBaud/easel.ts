import { Vector2 as ThreeVector2 } from "three";
import { MathsUtils } from "../../../src/maths/MathsUtils.js";
import { createVector2 } from "../../../src/maths/Vector2.js";

const compareVectors = (ourVec, threeVec, epsilon = MathsUtils.EPSILON) => {
    expect(ourVec.x).toBeCloseTo(threeVec.x, epsilon);
    expect(ourVec.y).toBeCloseTo(threeVec.y, epsilon);
};

describe("Vector2 basics", () => {
    test("create / constructor", () => {
        const ourVecA = createVector2();
        const threeVecA = new ThreeVector2();
        compareVectors(ourVecA, threeVecA);

        const x = 1, y = 2;

        const ourVecB = createVector2(x, y);
        const threeVecB = new ThreeVector2(x, y);
        compareVectors(ourVecB, threeVecB);

        expect(ourVecB.isVector2).toBe(true);
        expect(threeVecB.isVector2).toBe(true);
    });

    test("clone and copy", () => {
        const x = 1, y = 2;

        const ourVecA = createVector2(x, y);
        const threeVecA = new ThreeVector2(x, y);

        const ourVecB = ourVecA.clone();
        const threeVecB = threeVecA.clone();
        compareVectors(ourVecB, threeVecB);

        const ourVecC = createVector2().copy(ourVecA);
        const threeVecC = new ThreeVector2().copy(threeVecA);
        compareVectors(ourVecC, threeVecC);
    });

    test("length and lengthSq", () => {
        const testCases = [
            [0, 0],
            [1, 0],
            [3, 4],
            [-3, -4],
        ];

        testCases.forEach(([x, y]) => {
            const ourVec = createVector2(x, y);
            const threeVec = new ThreeVector2(x, y);

            expect(ourVec.lengthSq).toBeCloseTo(threeVec.lengthSq(), 1e-5);
            expect(ourVec.length).toBeCloseTo(threeVec.length(), 1e-5);
        });
    });

    test("set", () => {
        const x = 1, y = 2;

        const ourVec = createVector2().set(x, y);
        const threeVec = new ThreeVector2().set(x, y);
        compareVectors(ourVec, threeVec);
    });
});

describe("Vector2 operations", () => {
    test("add", () => {
        const ourVecA = createVector2(1, 2);
        const ourVecB = createVector2(3, 4);

        const threeVecA = new ThreeVector2(1, 2);
        const threeVecB = new ThreeVector2(3, 4);

        ourVecA.add(ourVecB);
        threeVecA.add(threeVecB);
        compareVectors(ourVecA, threeVecA);
    });

    test("addVectors", () => {
        const ourVecA = createVector2(1, 2);
        const ourVecB = createVector2(3, 4);
        const ourResult = createVector2();

        const threeVecA = new ThreeVector2(1, 2);
        const threeVecB = new ThreeVector2(3, 4);
        const threeResult = new ThreeVector2();

        ourResult.addVectors(ourVecA, ourVecB);
        threeResult.addVectors(threeVecA, threeVecB);
        compareVectors(ourResult, threeResult);
    });

    test("mul / multiply", () => {
        const ourVecA = createVector2(1, 2);
        const ourVecB = createVector2(3, 4);

        const threeVecA = new ThreeVector2(1, 2);
        const threeVecB = new ThreeVector2(3, 4);

        ourVecA.mul(ourVecB);
        threeVecA.multiply(threeVecB);
        compareVectors(ourVecA, threeVecA);
    });

    test("mulScalar / multiplyScalar", () => {
        const ourVec = createVector2(1, 2);
        const threeVec = new ThreeVector2(1, 2);

        ourVec.mulScalar(5);
        threeVec.multiplyScalar(5);
        compareVectors(ourVec, threeVec);
    });

    test("sub", () => {
        const ourVecA = createVector2(1, 2);
        const ourVecB = createVector2(3, 4);

        const threeVecA = new ThreeVector2(1, 2);
        const threeVecB = new ThreeVector2(3, 4);

        ourVecA.sub(ourVecB);
        threeVecA.sub(threeVecB);
        compareVectors(ourVecA, threeVecA);
    });
});

describe("Vector2 array operations", () => {
    test("fromArray and toArray", () => {
        const array = [1, 2];

        const ourVec = createVector2().fromArray(array);
        const threeVec = new ThreeVector2().fromArray(array);
        compareVectors(ourVec, threeVec);

        const ourArray = [];
        const threeArray = [];

        ourVec.toArray(ourArray);
        threeVec.toArray(threeArray);

        expect(ourArray[0]).toBeCloseTo(threeArray[0], MathsUtils.EPSILON);
        expect(ourArray[1]).toBeCloseTo(threeArray[1], MathsUtils.EPSILON);
    });

    test("iterator", () => {
        const ourVec = createVector2(1, 2);
        const values = [];

        for (const value of ourVec) {
            values.push(value);
        }

        expect(values[0]).toBe(1);
        expect(values[1]).toBe(2);
        expect(values.length).toBe(2);
    });
});

describe("Vector2 utilities", () => {
    test("cross", () => {
        const ourVecA = createVector2(1, 2);
        const ourVecB = createVector2(3, 4);

        const threeVecA = new ThreeVector2(1, 2);
        const threeVecB = new ThreeVector2(3, 4);

        const ourCross = ourVecA.cross(ourVecB);
        const threeCross = threeVecA.cross(threeVecB);

        expect(ourCross).toBeCloseTo(threeCross, MathsUtils.EPSILON);
    });

    test("distanceTo", () => {
        const ourVecA = createVector2(1, 2);
        const ourVecB = createVector2(4, 6);

        const threeVecA = new ThreeVector2(1, 2);
        const threeVecB = new ThreeVector2(4, 6);

        expect(ourVecA.distanceTo(ourVecB)).toBeCloseTo(
            threeVecA.distanceTo(threeVecB),
            1e-5,
        );
    });

    test("dot", () => {
        const ourVecA = createVector2(1, 2);
        const ourVecB = createVector2(3, 4);

        const threeVecA = new ThreeVector2(1, 2);
        const threeVecB = new ThreeVector2(3, 4);

        expect(ourVecA.dot(ourVecB)).toBeCloseTo(
            threeVecA.dot(threeVecB),
            MathsUtils.EPSILON,
        );

        const extremeVecA = createVector2(1e10, 1e-10);
        const extremeVecB = createVector2(-1e8, 1e-8);

        const threeExtremeVecA = new ThreeVector2(1e10, 1e-10);
        const threeExtremeVecB = new ThreeVector2(-1e8, 1e-8);

        expect(extremeVecA.dot(extremeVecB)).toBeCloseTo(
            threeExtremeVecA.dot(threeExtremeVecB),
            MathsUtils.EPSILON,
        );
    });

    test("equals", () => {
        const ourVecA = createVector2(1, 2);
        const ourVecB = createVector2(1, 2);
        const ourVecC = createVector2(3, 4);

        const threeVecA = new ThreeVector2(1, 2);
        const threeVecB = new ThreeVector2(1, 2);
        const threeVecC = new ThreeVector2(3, 4);

        expect(ourVecA.equals(ourVecB)).toBe(threeVecA.equals(threeVecB));
        expect(ourVecA.equals(ourVecC)).toBe(threeVecA.equals(threeVecC));
    });

    test("negate", () => {
        const ourVec = createVector2(1, 2);
        const threeVec = new ThreeVector2(1, 2);

        ourVec.negate();
        threeVec.negate();
        compareVectors(ourVec, threeVec);
    });

    test("rotateAround", () => {
        const ourVec = createVector2(1, 0);
        const threeVec = new ThreeVector2(1, 0);

        ourVec.rotateAround(createVector2(0, 0), MathsUtils.HALF_PI);
        threeVec.rotateAround(new ThreeVector2(0, 0), MathsUtils.HALF_PI);
        compareVectors(ourVec, threeVec);

        ourVec.rotateAround(createVector2(0, 0), MathsUtils.HALF_PI);
        threeVec.rotateAround(new ThreeVector2(0, 0), MathsUtils.HALF_PI);
        compareVectors(ourVec, threeVec);
    });

    test("unit / normalize", () => {
        const testCases = [
            [1, 0],
            [0, 1],
            [1, 2],
            [-3, 4],
        ];
        testCases.forEach(([x, y]) => {
            const ourVec = createVector2(x, y);
            const threeVec = new ThreeVector2(x, y);
            ourVec.unit();
            threeVec.normalize();
            compareVectors(ourVec, threeVec);

            expect(ourVec.length).toBeCloseTo(1, 1e-5);
            expect(threeVec.length()).toBeCloseTo(1, 1e-5);
        });
    });
});
