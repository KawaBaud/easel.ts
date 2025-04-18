import {
    Euler as ThreeEuler,
    Quaternion as ThreeQuaternion,
    Vector3 as ThreeVector3,
} from "three";
import { createEuler } from "../../../src/maths/Euler.js";
import { Maths } from "../../../src/maths/Maths.js";
import { createMatrix4 } from "../../../src/maths/Matrix4.js";
import { createQuaternion } from "../../../src/maths/Quaternion.js";
import { createVector3 } from "../../../src/maths/Vector3.js";

const compareQuaternions = (ourQuat, threeQuat, epsilon = 0.01) => {
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

describe("Quaternion core", () => {
    test("create / constructor", () => {
        const ourQuatA = createQuaternion();
        const threeQuatA = new ThreeQuaternion();
        compareQuaternions(ourQuatA, threeQuatA);

        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;

        const ourQuatB = createQuaternion(x, y, z, w);
        const threeQuatB = new ThreeQuaternion(x, y, z, w);
        compareQuaternions(ourQuatB, threeQuatB);
    });

    test("set", () => {
        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;

        const ourQuat = createQuaternion().set(x, y, z, w);
        const threeQuat = new ThreeQuaternion().set(x, y, z, w);
        compareQuaternions(ourQuat, threeQuat);
    });

    test("clone, copy", () => {
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

    test("identity", () => {
        const ourQuat = createQuaternion(0.1, 0.2, 0.3, 0.4).identity();
        const threeQuat = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).identity();
        compareQuaternions(ourQuat, threeQuat);
    });

    test("length, lengthSq", () => {
        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;

        const ourQuat = createQuaternion(x, y, z, w);
        const threeQuat = new ThreeQuaternion(x, y, z, w);

        expect(ourQuat.lengthSq).toBeCloseTo(threeQuat.lengthSq(), 1e-5);
        expect(ourQuat.length).toBeCloseTo(threeQuat.length(), 1e-5);
    });

    test("fromArray, toArray", () => {
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
});

describe("Quaternion operations", () => {
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

    test("conjugate", () => {
        const ourQuat = createQuaternion(0.1, 0.2, 0.3, 0.4).conjugate();
        const threeQuat = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).conjugate();
        compareQuaternions(ourQuat, threeQuat);
    });

    test("unit", () => {
        const ourQuat = createQuaternion(0.1, 0.2, 0.3, 0.4).unit();
        const threeQuat = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).normalize();
        compareQuaternions(ourQuat, threeQuat);

        expect(ourQuat.length).toBeCloseTo(1, 1e-5);
        expect(threeQuat.length()).toBeCloseTo(1, 1e-5);
    });

    test("mul, premul / multiply, premultiply", () => {
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

    test("equals", () => {
        const q1 = createQuaternion(0.1, 0.2, 0.3, 0.4);
        const q2 = createQuaternion(0.1, 0.2, 0.3, 0.4);
        const q3 = createQuaternion(0.5, 0.6, 0.7, 0.8);

        expect(q1.equals(q2)).toBe(true);
        expect(q1.equals(q3)).toBe(false);
    });
});

describe("Quaternion conversions", () => {
    test("setFromAxisAngle", () => {
        const testCases = [
            { axis: [1, 0, 0], angle: Maths.QUARTER_PI },
            { axis: [0, 1, 0], angle: Maths.HALF_PI },
            { axis: [0, 0, 1], angle: Math.PI },
            { axis: [1, 1, 1], angle: Math.PI / 3 },
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
            { euler: [Maths.QUARTER_PI, 0, 0], order: "XYZ" },
            { euler: [0, Maths.QUARTER_PI, 0], order: "XYZ" },
            { euler: [0, 0, Maths.QUARTER_PI], order: "XYZ" },
            {
                euler: [Maths.QUARTER_PI, Maths.QUARTER_PI, Maths.QUARTER_PI],
                order: "XYZ",
            },
            {
                euler: [Maths.QUARTER_PI, Maths.QUARTER_PI, Maths.QUARTER_PI],
                order: "YXZ",
            },
            {
                euler: [Maths.QUARTER_PI, Maths.QUARTER_PI, Maths.QUARTER_PI],
                order: "ZXY",
            },
            {
                euler: [Maths.QUARTER_PI, Maths.QUARTER_PI, Maths.QUARTER_PI],
                order: "ZYX",
            },
            {
                euler: [Maths.QUARTER_PI, Maths.QUARTER_PI, Maths.QUARTER_PI],
                order: "YZX",
            },
            {
                euler: [Maths.QUARTER_PI, Maths.QUARTER_PI, Maths.QUARTER_PI],
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
        const angle = Maths.HALF_PI;
        const yAxis = [0, 1, 0];

        const ourAxis = createVector3(...yAxis).unit();
        const ourQuat = createQuaternion().setFromAxisAngle(ourAxis, angle);
        const ourMat = createMatrix4().makeRotationFromQuaternion(ourQuat);

        const testQuat = createQuaternion().setFromRotationMatrix(ourMat);
        const testVec = createVector3(1, 0, 0);

        const v1 = testVec.clone().applyQuaternion(ourQuat);
        const v2 = testVec.clone().applyQuaternion(testQuat);

        expect(Math.abs(v1.x)).toBeCloseTo(Math.abs(v2.x), 5);
        expect(Math.abs(v1.y)).toBeCloseTo(Math.abs(v2.y), 5);
        expect(Math.abs(v1.z)).toBeCloseTo(Math.abs(v2.z), 5);
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
