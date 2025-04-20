import {
    Euler as ThreeEuler,
    Matrix4 as ThreeMatrix4,
    Quaternion as ThreeQuaternion,
    Vector3 as ThreeVector3,
} from "three";
import { createMatrix4 } from "../../../src/maths/Matrix4.js";
import { createQuaternion } from "../../../src/maths/Quaternion.js";
import { createVector3 } from "../../../src/maths/Vector3.js";
import { MathsUtils } from "../../../src/utils/MathsUtils.js";

const compareVectors = (ourVec, threeVec, epsilon = MathsUtils.EPSILON) => {
    expect(ourVec.x).toBeCloseTo(threeVec.x, epsilon);
    expect(ourVec.y).toBeCloseTo(threeVec.y, epsilon);
    expect(ourVec.z).toBeCloseTo(threeVec.z, epsilon);
};

describe("Vector3 core", () => {
    test("create / constructor", () => {
        const ourVecA = createVector3();
        const threeVecA = new ThreeVector3();
        compareVectors(ourVecA, threeVecA);

        const x = 1, y = 2, z = 3;

        const ourVecB = createVector3(x, y, z);
        const threeVecB = new ThreeVector3(x, y, z);
        compareVectors(ourVecB, threeVecB);
    });

    test("set", () => {
        const x = 1, y = 2, z = 3;

        const ourVec = createVector3().set(x, y, z);
        const threeVec = new ThreeVector3().set(x, y, z);
        compareVectors(ourVec, threeVec);
    });

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

    test("sub", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);

        ourVecA.sub(ourVecB);
        threeVecA.sub(threeVecB);
        compareVectors(ourVecA, threeVecA);
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
});

describe("Vector3 utility methods", () => {
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

    test("cross", () => {
        const ourVecA = createVector3(1, 2, 3);
        const ourVecB = createVector3(4, 5, 6);

        const threeVecA = new ThreeVector3(1, 2, 3);
        const threeVecB = new ThreeVector3(4, 5, 6);

        const ourResult = ourVecA.clone().cross(ourVecB);
        const threeResult = threeVecA.clone().cross(threeVecB);
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

describe("Vector3 transformations", () => {
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
