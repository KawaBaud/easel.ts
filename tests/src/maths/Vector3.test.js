import {
    Euler as ThreeEuler,
    Matrix4 as ThreeMatrix4,
    Quaternion as ThreeQuaternion,
    Vector3 as ThreeVector3,
} from "three";
import { MathsUtils } from "../../../src/maths/MathsUtils.js";
import { createMatrix4 } from "../../../src/maths/Matrix4.js";
import { createQuaternion } from "../../../src/maths/Quaternion.js";
import { createVector3 } from "../../../src/maths/Vector3.js";

const compareVectors = (ourVec, threeVec, epsilon = MathsUtils.EPSILON) => {
    expect(ourVec.x).toBeCloseTo(threeVec.x, epsilon);
    expect(ourVec.y).toBeCloseTo(threeVec.y, epsilon);
    expect(ourVec.z).toBeCloseTo(threeVec.z, epsilon);
};

describe("Vector3 basics", () => {
    test("clone and copy", () => {
        const x = 1, y = 2, z = 3;

        const ourVecA = createVector3(x, y, z);
        const threeVecA = new ThreeVector3(x, y, z);

        const ourVecB = ourVecA.clone();
        const threeVecB = threeVecA.clone();
        compareVectors(ourVecB, threeVecB);

        const ourVec3 = createVector3().copy(ourVecA);
        const threeVec3 = new ThreeVector3().copy(threeVecA);
        compareVectors(ourVec3, threeVec3);
    });

    test("create / constructor", () => {
        const ourVecA = createVector3();
        const threeVecA = new ThreeVector3();
        compareVectors(ourVecA, threeVecA);

        const x = 1, y = 2, z = 3;

        const ourVecB = createVector3(x, y, z);
        const threeVecB = new ThreeVector3(x, y, z);
        compareVectors(ourVecB, threeVecB);

        expect(ourVecB.isVector3).toBe(true);
        expect(threeVecB.isVector3).toBe(true);
    });

    test("length and lengthSq", () => {
        const testCases = [
            [0, 0, 0],
            [1, 0, 0],
            [1, 2, 3],
            [-1, -2, -3],
        ];

        testCases.forEach(([x, y, z]) => {
            const ourVec = createVector3(x, y, z);
            const threeVec = new ThreeVector3(x, y, z);

            expect(ourVec.lengthSq).toBeCloseTo(threeVec.lengthSq(), 1e-5);
            expect(ourVec.length).toBeCloseTo(threeVec.length(), 1e-5);
        });
    });

    test("set", () => {
        const x = 1, y = 2, z = 3;

        const ourVec = createVector3().set(x, y, z);
        const threeVec = new ThreeVector3().set(x, y, z);
        compareVectors(ourVec, threeVec);
    });
});

describe("Vector3 operations", () => {
    test("add", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);

        ourVecA.add(ourVecB);
        threeVecA.add(threeVecB);
        compareVectors(ourVecA, threeVecA);
    });

    test("addVectors", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);
        const ourResult = createVector3();

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);
        const threeResult = new ThreeVector3();

        ourResult.addVectors(ourVecA, ourVecB);
        threeResult.addVectors(threeVecA, threeVecB);
        compareVectors(ourResult, threeResult);
    });

    test("div / divide", () => {
        const ourVecA = createVector3(10, 20, 30);
        const ourVecB = createVector3(2, 4, 5);

        const threeVecA = new ThreeVector3(10, 20, 30);
        const threeVecB = new ThreeVector3(2, 4, 5);

        ourVecA.div(ourVecB);
        threeVecA.divide(threeVecB);
        compareVectors(ourVecA, threeVecA);
    });

    test("divScalar / divideScalar", () => {
        const ourVec = createVector3(10, 20, 30);
        const threeVec = new ThreeVector3(10, 20, 30);

        ourVec.divScalar(2);
        threeVec.divideScalar(2);
        compareVectors(ourVec, threeVec);
    });

    test("mul / multiply", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);

        ourVecA.mul(ourVecB);
        threeVecA.multiply(threeVecB);
        compareVectors(ourVecA, threeVecA);
    });

    test("mulScalar / multiplyScalar", () => {
        const ourVec = createVector3(1, 2, 3);
        const threeVec = new ThreeVector3(1, 2, 3);

        ourVec.mulScalar(5);
        threeVec.multiplyScalar(5);
        compareVectors(ourVec, threeVec);
    });

    test("sub", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);

        ourVecA.sub(ourVecB);
        threeVecA.sub(threeVecB);
        compareVectors(ourVecA, threeVecA);
    });

    test("subVectors", () => {
        const ourVecA = createVector3(10, 20, 30);
        const ourVecB = createVector3(4, 5, 6);
        const ourResult = createVector3();

        const threeVecA = new ThreeVector3(10, 20, 30);
        const threeVecB = new ThreeVector3(4, 5, 6);
        const threeResult = new ThreeVector3();

        ourResult.subVectors(ourVecA, ourVecB);
        threeResult.subVectors(threeVecA, threeVecB);
        compareVectors(ourResult, threeResult);
    });
});

describe("Vector3 array operations", () => {
    test("fromArray and toArray", () => {
        const array = [1, 2, 3];

        const ourVec = createVector3().fromArray(array);
        const threeVec = new ThreeVector3().fromArray(array);
        compareVectors(ourVec, threeVec);

        const ourArray = [];
        const threeArray = [];

        ourVec.toArray(ourArray);
        threeVec.toArray(threeArray);

        expect(ourArray[0]).toBeCloseTo(threeArray[0], MathsUtils.EPSILON);
        expect(ourArray[1]).toBeCloseTo(threeArray[1], MathsUtils.EPSILON);
        expect(ourArray[2]).toBeCloseTo(threeArray[2], MathsUtils.EPSILON);
    });

    test("iterator", () => {
        const ourVec = createVector3(1, 2, 3);
        const values = [];

        for (const value of ourVec) {
            values.push(value);
        }

        expect(values[0]).toBe(1);
        expect(values[1]).toBe(2);
        expect(values[2]).toBe(3);
        expect(values.length).toBe(3);
    });
});

describe("Vector3 transformations", () => {
    test("applyEuler", () => {
        const testCases = [
            { v: [1, 0, 0], rotation: [0, 0, 0] },
            { v: [0, 1, 0], rotation: [MathsUtils.HALF_PI, 0, 0] },
            { v: [1, 2, 3], rotation: [0, MathsUtils.QUARTER_PI, 0] },
        ];
        testCases.forEach(({ v, rotation }) => {
            const ourVec = createVector3(...v);
            const threeVec = new ThreeVector3(...v);

            const [rx, ry, rz] = rotation;

            const ourEuler = { x: rx, y: ry, z: rz, order: "XYZ" };
            const threeEuler = new ThreeEuler(rx, ry, rz, "XYZ");

            ourVec.applyEuler(ourEuler);
            threeVec.applyEuler(threeEuler);
            compareVectors(ourVec, threeVec);
        });
    });

    test("applyMatrix4", () => {
        const testCases = [
            { v: [1, 0, 0], matrix: "identity" },
            { v: [1, 2, 3], matrix: "translate" },
            { v: [1, 2, 3], matrix: "rotateY" },
        ];

        const matrices = {
            identity: [createMatrix4(), new ThreeMatrix4()],
            rotateY: [
                createMatrix4().makeRotationY(MathsUtils.QUARTER_PI),
                new ThreeMatrix4().makeRotationY(MathsUtils.QUARTER_PI),
            ],
            translate: [
                createMatrix4().makeTranslation(10, 20, 30),
                new ThreeMatrix4().makeTranslation(10, 20, 30),
            ],
        };

        testCases.forEach(({ v, matrix }) => {
            const ourVec = createVector3(...v);
            const threeVec = new ThreeVector3(...v);

            const [ourMat, threeMat] = matrices[matrix];

            ourVec.applyMatrix4(ourMat);
            threeVec.applyMatrix4(threeMat);
            compareVectors(ourVec, threeVec);
        });
    });

    test("applyQuaternion", () => {
        const testCases = [
            { v: [1, 0, 0], rotation: [0, 0, 0] },
            { v: [0, 1, 0], rotation: [MathsUtils.HALF_PI, 0, 0] },
            { v: [1, 2, 3], rotation: [0, MathsUtils.QUARTER_PI, 0] },
        ];
        testCases.forEach(({ v, rotation }) => {
            const ourVec = createVector3(...v);
            const threeVec = new ThreeVector3(...v);

            const [rx, ry, rz] = rotation;

            const ourQuat = createQuaternion();
            ourQuat.setFromEuler({ x: rx, y: ry, z: rz, order: "XYZ" });

            const threeQuat = new ThreeQuaternion();
            const threeEuler = new ThreeEuler(rx, ry, rz, "XYZ");
            threeQuat.setFromEuler(threeEuler);

            ourVec.applyQuaternion(ourQuat);
            threeVec.applyQuaternion(threeQuat);
            compareVectors(ourVec, threeVec);
        });
    });
});

describe("Vector3 utilities", () => {
    test("angleTo", () => {
        const testCases = [
            { a: [1, 0, 0], b: [0, 1, 0] }, // 90 degrees
            { a: [1, 0, 0], b: [-1, 0, 0] }, // 180 degrees
            { a: [1, 0, 0], b: [1, 0, 0] }, // 0 degrees
            { a: [1, 1, 1], b: [2, 2, 2] },
        ];
        testCases.forEach(({ a, b }) => {
            const ourVecA = createVector3(...a);
            const ourVecB = createVector3(...b);

            const threeVecA = new ThreeVector3(...a);
            const threeVecB = new ThreeVector3(...b);

            expect(ourVecA.angleTo(ourVecB)).toBeCloseTo(
                threeVecA.angleTo(threeVecB),
                MathsUtils.EPSILON,
            );
        });
    });

    test("cross", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);

        const ourResult = ourVecA.clone().cross(ourVecB);
        const threeResult = threeVecA.clone().cross(threeVecB);
        compareVectors(ourResult, threeResult);
    });

    test("crossVectors", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);
        const ourResult = createVector3();

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);
        const threeResult = new ThreeVector3();

        ourResult.crossVectors(ourVecA, ourVecB);
        threeResult.crossVectors(threeVecA, threeVecB);
        compareVectors(ourResult, threeResult);
    });

    test("distanceTo", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);

        expect(ourVecA.distanceTo(ourVecB)).toBeCloseTo(
            threeVecA.distanceTo(threeVecB),
            1e-5,
        );
    });

    test("dot", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);

        expect(ourVecA.dot(ourVecB)).toBeCloseTo(
            threeVecA.dot(threeVecB),
            MathsUtils.EPSILON,
        );

        const extremeVecA = createVector3(1e10, 1e-10, -1e5);
        const extremeVecB = createVector3(-1e8, 1e-8, 1e6);

        const threeExtremeVecA = new ThreeVector3(1e10, 1e-10, -1e5);
        const threeExtremeVecB = new ThreeVector3(-1e8, 1e-8, 1e6);

        expect(extremeVecA.dot(extremeVecB)).toBeCloseTo(
            threeExtremeVecA.dot(threeExtremeVecB),
            MathsUtils.EPSILON,
        );
    });

    test("equals", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(1, 2, 3);
        const ourVecC = createVector3(4, 5, 6);

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(1, 2, 3);
        const threeVecC = new ThreeVector3(4, 5, 6);

        expect(ourVecA.equals(ourVecB)).toBe(threeVecA.equals(threeVecB));
        expect(ourVecA.equals(ourVecC)).toBe(threeVecA.equals(threeVecC));
    });

    test("negate", () => {
        const ourVec = createVector3(1, 2, 3);
        const threeVec = new ThreeVector3(1, 2, 3);

        ourVec.negate();
        threeVec.negate();
        compareVectors(ourVec, threeVec);
    });

    test("unit / normalize", () => {
        const testCases = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 2, 3],
        ];
        testCases.forEach(([x, y, z]) => {
            const ourVec = createVector3(x, y, z);
            const threeVec = new ThreeVector3(x, y, z);
            ourVec.unit();
            threeVec.normalize();
            compareVectors(ourVec, threeVec);

            expect(ourVec.length).toBeCloseTo(1, 1e-5);
            expect(threeVec.length()).toBeCloseTo(1, 1e-5);
        });
    });
});
