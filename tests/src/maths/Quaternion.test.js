import {
    Euler as ThreeEuler,
    Quaternion as ThreeQuaternion,
    Vector3 as ThreeVector3,
} from "three";
import { createEuler } from "../../../src/maths/Euler.js";
import { MathsUtils } from "../../../src/maths/MathsUtils.js";
import { createMatrix4 } from "../../../src/maths/Matrix4.js";
import { createQuaternion } from "../../../src/maths/Quaternion.js";
import { createVector3 } from "../../../src/maths/Vector3.js";

const compareQuaternions = (
    ourQuat,
    threeQuat,
    epsilon = MathsUtils.EPSILON,
) => {
    const directMatch = Math.abs(ourQuat.x - threeQuat.x) < epsilon &&
        Math.abs(ourQuat.y - threeQuat.y) < epsilon &&
        Math.abs(ourQuat.z - threeQuat.z) < epsilon &&
        Math.abs(ourQuat.w - threeQuat.w) < epsilon;
    const negativeMatch = Math.abs(ourQuat.x + threeQuat.x) < epsilon &&
        Math.abs(ourQuat.y + threeQuat.y) < epsilon &&
        Math.abs(ourQuat.z + threeQuat.z) < epsilon &&
        Math.abs(ourQuat.w + threeQuat.w) < epsilon;

    expect(directMatch || negativeMatch).toBe(true);
};

describe("Quaternion basics", () => {
    test("clone and copy", () => {
        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;

        const ourQuatA = createQuaternion(x, y, z, w);
        const threeQuatA = new ThreeQuaternion(x, y, z, w);

        const ourQuatB = ourQuatA.clone();
        const threeQuatB = threeQuatA.clone();
        compareQuaternions(ourQuatB, threeQuatB);

        const ourQuatC = createQuaternion().copy(ourQuatA);
        const threeQuatC = new ThreeQuaternion().copy(threeQuatA);
        compareQuaternions(ourQuatC, threeQuatC);
    });

    test("create / constructor", () => {
        const ourQuatA = createQuaternion();
        const threeQuatA = new ThreeQuaternion();
        compareQuaternions(ourQuatA, threeQuatA);

        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;

        const ourQuatB = createQuaternion(x, y, z, w);
        const threeQuatB = new ThreeQuaternion(x, y, z, w);
        compareQuaternions(ourQuatB, threeQuatB);

        expect(ourQuatB.isQuaternion).toBe(true);
    });

    test("identity", () => {
        const ourQuat = createQuaternion(0.1, 0.2, 0.3, 0.4).identity();
        const threeQuat = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).identity();
        compareQuaternions(ourQuat, threeQuat);
    });

    test("length and lengthSq", () => {
        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;

        const ourQuat = createQuaternion(x, y, z, w);
        const threeQuat = new ThreeQuaternion(x, y, z, w);

        expect(ourQuat.lengthSq).toBeCloseTo(threeQuat.lengthSq(), 1e-5);
        expect(ourQuat.length).toBeCloseTo(threeQuat.length(), 1e-5);
    });

    test("set", () => {
        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;

        const ourQuat = createQuaternion().set(x, y, z, w);
        const threeQuat = new ThreeQuaternion().set(x, y, z, w);
        compareQuaternions(ourQuat, threeQuat);
    });
});

describe("Quaternion operations", () => {
    test("angleTo", () => {
        const ourQuatA = createQuaternion(0.1, 0.2, 0.3, 0.4).unit();
        const ourQuatB = createQuaternion(0.5, 0.6, 0.7, 0.8).unit();

        const threeQuatA = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).normalize();
        const threeQuatB = new ThreeQuaternion(0.5, 0.6, 0.7, 0.8).normalize();

        expect(ourQuatA.angleTo(ourQuatB)).toBeCloseTo(
            threeQuatA.angleTo(threeQuatB),
            1e-5,
        );
    });

    test("conjugate", () => {
        const ourQuat = createQuaternion(0.1, 0.2, 0.3, 0.4).conjugate();
        const threeQuat = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).conjugate();
        compareQuaternions(ourQuat, threeQuat);
    });

    test("dot", () => {
        const ourQuatA = createQuaternion(0.1, 0.2, 0.3, 0.4);
        const ourQuatB = createQuaternion(0.5, 0.6, 0.7, 0.8);

        const threeQuatA = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4);
        const threeQuatB = new ThreeQuaternion(0.5, 0.6, 0.7, 0.8);

        expect(ourQuatA.dot(ourQuatB)).toBeCloseTo(
            threeQuatA.dot(threeQuatB),
            1e-5,
        );
    });

    test("equals", () => {
        const q1 = createQuaternion(0.1, 0.2, 0.3, 0.4);
        const q2 = createQuaternion(0.1, 0.2, 0.3, 0.4);
        const q3 = createQuaternion(0.5, 0.6, 0.7, 0.8);

        expect(q1.equals(q2)).toBe(true);
        expect(q1.equals(q3)).toBe(false);
    });

    test("mul and premul / multiply and premultiply", () => {
        const ourQuatA = createQuaternion(0.1, 0.2, 0.3, 0.4);
        const ourQuatB = createQuaternion(0.5, 0.6, 0.7, 0.8);

        const threeQuatA = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4);
        const threeQuatB = new ThreeQuaternion(0.5, 0.6, 0.7, 0.8);

        const ourMul = ourQuatA.clone().mul(ourQuatB);
        const threeMul = threeQuatA.clone().multiply(threeQuatB);
        compareQuaternions(ourMul, threeMul);

        const ourPremul = ourQuatA.clone().premul(ourQuatB);
        const threePremul = threeQuatA.clone().premultiply(threeQuatB);
        compareQuaternions(ourPremul, threePremul);
    });

    test("random", () => {
        const ourQuat = createQuaternion().random();
        expect(ourQuat.length).toBeCloseTo(1, 5);

        const ourQuat2 = createQuaternion().random();

        const allSame = (ourQuat.x === ourQuat2.x) &&
            (ourQuat.y === ourQuat2.y) &&
            (ourQuat.z === ourQuat2.z) &&
            (ourQuat.w === ourQuat2.w);
        expect(allSame).toBe(false);
    });

    test("rotateTowards", () => {
        const q1 = createQuaternion(1, 0, 0, 0).unit();
        const q2 = createQuaternion(0, 1, 0, 0).unit();

        const angle = q1.angleTo(q2);

        const result1 = q1.clone().rotateTowards(q2, 0);
        expect(result1.x).toBeCloseTo(q1.x, 5);
        expect(result1.y).toBeCloseTo(q1.y, 5);
        expect(result1.z).toBeCloseTo(q1.z, 5);
        expect(result1.w).toBeCloseTo(q1.w, 5);

        const result2 = q1.clone().rotateTowards(q2, angle);
        expect(result2.x).toBeCloseTo(q2.x, 5);
        expect(result2.y).toBeCloseTo(q2.y, 5);
        expect(result2.z).toBeCloseTo(q2.z, 5);
        expect(result2.w).toBeCloseTo(q2.w, 5);

        const result3 = q1.clone().rotateTowards(q2, angle / 2);
        expect(result3.length).toBeCloseTo(1, 5);
    });

    test("rotateVector3", () => {
        const testCases = [
            { axis: [1, 0, 0], angle: MathsUtils.QUARTER_PI },
            { axis: [0, 1, 0], angle: MathsUtils.HALF_PI },
            { axis: [0, 0, 1], angle: Math.PI },
        ];
        testCases.forEach(({ axis, angle }) => {
            const ourAxis = createVector3(...axis).unit();
            const threeAxis = new ThreeVector3(...axis).normalize();

            const ourQuat = createQuaternion().setFromAxisAngle(ourAxis, angle);
            const threeQuat = new ThreeQuaternion().setFromAxisAngle(
                threeAxis,
                angle,
            );

            const testVec = createVector3(1, 2, 3);
            const threeTestVec = new ThreeVector3(1, 2, 3);

            const ourResult = ourQuat.rotateVector3(testVec);
            const threeResult = threeTestVec.clone().applyQuaternion(threeQuat);
            expect(ourResult.x).toBeCloseTo(threeResult.x, 5);
            expect(ourResult.y).toBeCloseTo(threeResult.y, 5);
            expect(ourResult.z).toBeCloseTo(threeResult.z, 5);
        });
    });

    test("slerp", () => {
        const q1 = createQuaternion(1, 0, 0, 0);
        const q2 = createQuaternion(0, 1, 0, 0);

        const slerp0 = q1.clone().slerp(q2, 0);
        expect(slerp0.x).toBeCloseTo(q1.x, 5);
        expect(slerp0.y).toBeCloseTo(q1.y, 5);
        expect(slerp0.z).toBeCloseTo(q1.z, 5);
        expect(slerp0.w).toBeCloseTo(q1.w, 5);

        const slerp1 = q1.clone().slerp(q2, 1);
        expect(slerp1.x).toBeCloseTo(q2.x, 5);
        expect(slerp1.y).toBeCloseTo(q2.y, 5);
        expect(slerp1.z).toBeCloseTo(q2.z, 5);
        expect(slerp1.w).toBeCloseTo(q2.w, 5);

        const slerp5 = q1.clone().slerp(q2, 0.5);
        expect(slerp5.length).toBeCloseTo(1, 5);
    });

    test("toMatrix4", () => {
        const ourQuat = createQuaternion().setFromAxisAngle(
            createVector3(0, 1, 0),
            MathsUtils.HALF_PI,
        );
        const ourMat = ourQuat.toMatrix4();

        const testVec = createVector3(1, 0, 0);
        const result = testVec.clone().applyMatrix4(ourMat);
        expect(Math.abs(result.x)).toBeLessThan(1e-5);
        expect(Math.abs(result.y)).toBeLessThan(1e-5);
        expect(Math.abs(Math.abs(result.z) - 1)).toBeLessThan(1e-5);

        const testVec2 = createVector3(0, 0, 1);
        const result2 = testVec2.clone().applyMatrix4(ourMat);
        expect(Math.abs(Math.abs(result2.x) - 1)).toBeLessThan(1e-5);
        expect(Math.abs(result2.y)).toBeLessThan(1e-5);
        expect(Math.abs(result2.z)).toBeLessThan(1e-5);
    });

    test("unit / normalize", () => {
        const ourQuat = createQuaternion(0.1, 0.2, 0.3, 0.4).unit();
        const threeQuat = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).normalize();
        compareQuaternions(ourQuat, threeQuat);

        expect(ourQuat.length).toBeCloseTo(1, 1e-5);
        expect(threeQuat.length()).toBeCloseTo(1, 1e-5);
    });
});

describe("Quaternion conversions", () => {
    test("setFromAxisAngle", () => {
        const testCases = [
            { axis: [1, 0, 0], angle: MathsUtils.QUARTER_PI },
            { axis: [0, 1, 0], angle: MathsUtils.HALF_PI },
            { axis: [0, 0, 1], angle: Math.PI },
            { axis: [1, 1, 1], angle: MathsUtils.THIRD_PI },
            { axis: [0, 1, 0], angle: 1e6 * Math.PI },
            { axis: [1000, 2000, 3000], angle: MathsUtils.SIXTH_PI },
        ];
        testCases.forEach(({ axis, angle }) => {
            const ourAxis = createVector3(...axis).unit();
            const threeAxis = new ThreeVector3(...axis).normalize();

            const ourQuat = createQuaternion().setFromAxisAngle(ourAxis, angle);
            const threeQuat = new ThreeQuaternion().setFromAxisAngle(
                threeAxis,
                angle,
            );
            compareQuaternions(ourQuat, threeQuat);
        });
    });

    test("setFromEuler", () => {
        const testCases = [
            { euler: [0, 0, 0], order: "XYZ" },
            { euler: [MathsUtils.QUARTER_PI, 0, 0], order: "XYZ" },
            { euler: [0, MathsUtils.QUARTER_PI, 0], order: "XYZ" },
            { euler: [0, 0, MathsUtils.QUARTER_PI], order: "XYZ" },
            {
                euler: [
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                ],
                order: "XYZ",
            },
            {
                euler: [
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                ],
                order: "YXZ",
            },
            {
                euler: [
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                ],
                order: "ZXY",
            },
            {
                euler: [
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                ],
                order: "ZYX",
            },
            {
                euler: [
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                ],
                order: "YZX",
            },
            {
                euler: [
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                    MathsUtils.QUARTER_PI,
                ],
                order: "XZY",
            },
        ];
        testCases.forEach(({ euler, order }) => {
            const ourEuler = createEuler(...euler, order);
            const threeEuler = new ThreeEuler(...euler, order);

            const ourQuat = createQuaternion().setFromEuler(ourEuler);
            const threeQuat = new ThreeQuaternion().setFromEuler(threeEuler);
            compareQuaternions(ourQuat, threeQuat);
        });
    });

    test("setFromRotationMatrix", () => {
        const m = createMatrix4().makeRotationY(MathsUtils.HALF_PI);
        const q = createQuaternion().setFromRotationMatrix(m);

        const testVec = createVector3(1, 0, 0);
        const result = testVec.clone().applyQuaternion(q);
        expect(Math.abs(result.x)).toBeLessThan(1e-5);
        expect(Math.abs(result.y)).toBeLessThan(1e-5);
        expect(Math.abs(result.z + 1)).toBeLessThan(1e-5);

        const testVec2 = createVector3(0, 0, 1);
        const result2 = testVec2.clone().applyQuaternion(q);
        expect(Math.abs(result2.x - 1)).toBeLessThan(1e-5);
        expect(Math.abs(result2.y)).toBeLessThan(1e-5);
        expect(Math.abs(result2.z)).toBeLessThan(1e-5);
    });

    test("setFromUnitVectors", () => {
        const testCases = [
            { from: [1, 0, 0], to: [0, 1, 0] },
            { from: [0, 1, 0], to: [0, 0, 1] },
            { from: [0, 0, 1], to: [1, 0, 0] },
            { from: [1, 0, 0], to: [-1, 0, 0] },
            { from: [1, 1, 1], to: [-1, -1, -1] },
            { from: [1, 2, 3], to: [3, 2, 1] },
        ];
        testCases.forEach(({ from, to }) => {
            const ourFrom = createVector3(...from).unit();
            const ourTo = createVector3(...to).unit();

            const threeFrom = new ThreeVector3(...from).normalize();
            const threeTo = new ThreeVector3(...to).normalize();

            const ourQuat = createQuaternion().setFromUnitVectors(
                ourFrom,
                ourTo,
            );
            const threeQuat = new ThreeQuaternion().setFromUnitVectors(
                threeFrom,
                threeTo,
            );
            compareQuaternions(ourQuat, threeQuat);
        });
    });
});

describe("Quaternion array operations", () => {
    test("fromArray and toArray", () => {
        const array = [0.1, 0.2, 0.3, 0.4];

        const ourQuat = createQuaternion().fromArray(array);
        const threeQuat = new ThreeQuaternion().fromArray(array);
        compareQuaternions(ourQuat, threeQuat);

        const ourArray = [];
        const threeArray = [];

        ourQuat.toArray(ourArray);
        threeQuat.toArray(threeArray);

        expect(ourArray).toEqual(threeArray);

        const offsetArray = [9, 9, ...array];

        const ourQuatOffset = createQuaternion().fromArray(offsetArray, 2);
        const threeQuatOffset = new ThreeQuaternion().fromArray(offsetArray, 2);
        compareQuaternions(ourQuatOffset, threeQuatOffset);
    });

    test("iterator", () => {
        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;

        const ourQuat = createQuaternion(x, y, z, w);

        const values = [];
        for (const value of ourQuat) values.push(value);

        expect(values[0]).toBe(x);
        expect(values[1]).toBe(y);
        expect(values[2]).toBe(z);
        expect(values[3]).toBe(w);
        expect(values.length).toBe(4);
    });
});
