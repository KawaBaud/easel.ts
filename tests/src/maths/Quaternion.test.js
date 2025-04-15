import {
    Euler as ThreeEuler,
    Quaternion as ThreeQuaternion,
    Vector3 as ThreeVector3,
} from "three";
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

const createEuler = (x, y, z, order = "XYZ") => ({ x, y, z, order });

describe("Quaternion core", () => {
    test("constructor/creation", () => {
        const ourQuat = createQuaternion();
        const threeQuat = new ThreeQuaternion();

        compareQuaternions(ourQuat, threeQuat);

        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;
        const ourQuat2 = createQuaternion(x, y, z, w);
        const threeQuat2 = new ThreeQuaternion(x, y, z, w);

        compareQuaternions(ourQuat2, threeQuat2);
    });

    test("set", () => {
        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;
        const ourQuat = createQuaternion().set(x, y, z, w);
        const threeQuat = new ThreeQuaternion().set(x, y, z, w);

        compareQuaternions(ourQuat, threeQuat);
    });

    test("clone and copy", () => {
        const x = 0.1, y = 0.2, z = 0.3, w = 0.4;
        const ourQuat1 = createQuaternion(x, y, z, w);
        const threeQuat1 = new ThreeQuaternion(x, y, z, w);

        const ourQuat2 = ourQuat1.clone();
        const threeQuat2 = threeQuat1.clone();

        compareQuaternions(ourQuat2, threeQuat2);

        const ourQuat3 = createQuaternion().copy(ourQuat1);
        const threeQuat3 = new ThreeQuaternion().copy(threeQuat1);

        compareQuaternions(ourQuat3, threeQuat3);
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

    test("fromArray / toArray", () => {
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
        const q1 = createQuaternion(0.1, 0.2, 0.3, 0.4);
        const q2 = createQuaternion(0.5, 0.6, 0.7, 0.8);

        const threeQ1 = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4);
        const threeQ2 = new ThreeQuaternion(0.5, 0.6, 0.7, 0.8);

        expect(q1.dot(q2)).toBeCloseTo(threeQ1.dot(threeQ2), 1e-5);
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

    test("mul / premul", () => {
        const q1 = createQuaternion(0.1, 0.2, 0.3, 0.4);
        const q2 = createQuaternion(0.5, 0.6, 0.7, 0.8);

        const threeQ1 = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4);
        const threeQ2 = new ThreeQuaternion(0.5, 0.6, 0.7, 0.8);

        const ourMul = q1.clone().mul(q2);
        const threeMul = threeQ1.clone().multiply(threeQ2);

        compareQuaternions(ourMul, threeMul);

        const ourPremul = q1.clone().premul(q2);
        const threePremul = threeQ1.clone().premultiply(threeQ2);

        compareQuaternions(ourPremul, threePremul);
    });

    test("slerp", () => {
        const q1 = createQuaternion(1, 0, 0, 0);
        const q2 = createQuaternion(0, 1, 0, 0);

        const ourSlerp0 = q1.clone().slerp(q2, 0);
        expect(ourSlerp0.x).toBeCloseTo(q1.x, 5);
        expect(ourSlerp0.y).toBeCloseTo(q1.y, 5);
        expect(ourSlerp0.z).toBeCloseTo(q1.z, 5);
        expect(ourSlerp0.w).toBeCloseTo(q1.w, 5);

        const ourSlerp1 = q1.clone().slerp(q2, 1);
        expect(ourSlerp1.x).toBeCloseTo(q2.x, 5);
        expect(ourSlerp1.y).toBeCloseTo(q2.y, 5);
        expect(ourSlerp1.z).toBeCloseTo(q2.z, 5);
        expect(ourSlerp1.w).toBeCloseTo(q2.w, 5);

        const ourSlerp05 = q1.clone().slerp(q2, 0.5);
        expect(ourSlerp05.length).toBeCloseTo(1, 5);
    });

    test("angleTo", () => {
        const q1 = createQuaternion(0.1, 0.2, 0.3, 0.4).unit();
        const q2 = createQuaternion(0.5, 0.6, 0.7, 0.8).unit();

        const threeQ1 = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).normalize();
        const threeQ2 = new ThreeQuaternion(0.5, 0.6, 0.7, 0.8).normalize();

        expect(q1.angleTo(q2)).toBeCloseTo(threeQ1.angleTo(threeQ2), 1e-5);
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

        const q = createQuaternion().setFromRotationMatrix(ourMat);
        const v = createVector3(1, 0, 0);

        const v1 = v.clone().applyQuaternion(ourQuat);
        const v2 = v.clone().applyQuaternion(q);
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
