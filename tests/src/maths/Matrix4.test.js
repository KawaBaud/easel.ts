import {
    Matrix4 as ThreeMatrix4,
    Quaternion as ThreeQuaternion,
    Vector3 as ThreeVector3,
} from "three";
import { describe, expect, test } from "vitest";
import { MathsUtils } from "../../../src/maths/MathsUtils.js";
import { createMatrix4 } from "../../../src/maths/Matrix4.js";
import { createQuaternion } from "../../../src/maths/Quaternion.js";
import { createVector3 } from "../../../src/maths/Vector3.js";

describe("Matrix4", () => {
    test("constructor", () => {
        const a = createMatrix4();
        const threeA = new ThreeMatrix4();

        expect(a.elements[0]).toBe(threeA.elements[0]);
        expect(a.elements[5]).toBe(threeA.elements[5]);
        expect(a.elements[10]).toBe(threeA.elements[10]);
        expect(a.elements[15]).toBe(threeA.elements[15]);
    });

    test("isMatrix4", () => {
        const a = createMatrix4();
        const threeA = new ThreeMatrix4();

        expect(a.isMatrix4).toBe(true);
        expect(threeA.isMatrix4).toBe(true);
    });

    test("determinant", () => {
        const a = createMatrix4().set(
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
        );
        const threeA = new ThreeMatrix4().set(
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
        );

        expect(a.determinant).toBeCloseTo(threeA.determinant());
    });

    test("clone/copy", () => {
        const a = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const b = createMatrix4().copy(a);
        const threeA = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const threeB = new ThreeMatrix4().copy(threeA);

        for (let i = 0; i < 16; i++) {
            expect(b.elements[i]).toBe(threeB.elements[i]);
        }
    });

    test("compose/decompose", () => {
        const position = createVector3(1, 2, 3);
        const quaternion = createQuaternion().setFromAxisAngle(
            createVector3(0, 1, 0),
            MathsUtils.QUARTER_PI,
        );
        const scale = createVector3(2, 3, 4);

        const threePosition = new ThreeVector3(1, 2, 3);
        const threeQuaternion = new ThreeQuaternion().setFromAxisAngle(
            new ThreeVector3(0, 1, 0),
            MathsUtils.QUARTER_PI,
        );
        const threeScale = new ThreeVector3(2, 3, 4);

        const a = createMatrix4().compose(position, quaternion, scale);
        const threeA = new ThreeMatrix4().compose(
            threePosition,
            threeQuaternion,
            threeScale,
        );

        const composeTestVec = createVector3(1, 0, 0);
        const composeThreeTestVec = new ThreeVector3(1, 0, 0);

        const composeTransformedVec = composeTestVec.clone().applyMatrix4(a);
        const composeThreeTransformedVec = composeThreeTestVec.clone()
            .applyMatrix4(threeA);

        expect(Math.abs(composeTransformedVec.x)).toBeCloseTo(
            Math.abs(composeThreeTransformedVec.x),
        );
        expect(Math.abs(composeTransformedVec.y)).toBeCloseTo(
            Math.abs(composeThreeTransformedVec.y),
        );

        const outPosition = createVector3();
        const outQuaternion = createQuaternion();
        const outScale = createVector3();
        const threeOutPosition = new ThreeVector3();
        const threeOutQuaternion = new ThreeQuaternion();
        const threeOutScale = new ThreeVector3();

        a.decompose(outPosition, outQuaternion, outScale);
        threeA.decompose(threeOutPosition, threeOutQuaternion, threeOutScale);

        expect(outPosition.x).toBeCloseTo(position.x);
        expect(outPosition.y).toBeCloseTo(position.y);
        expect(outPosition.z).toBeCloseTo(position.z);

        expect(outScale.x).toBeGreaterThan(0);
        expect(outScale.y).toBeGreaterThan(0);
        expect(outScale.z).toBeGreaterThan(0);

        const testVec = createVector3(1, 0, 0);
        const transformedVec = testVec.clone().applyMatrix4(a);

        expect(transformedVec.x).not.toBe(testVec.x);
        expect(transformedVec.length()).toBeGreaterThan(0);
    });

    test("copyPosition", () => {
        const a = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const b = createMatrix4().identity();
        b.copyPosition(a);

        const threeA = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const threeB = new ThreeMatrix4().identity();
        threeB.copyPosition(threeA);

        expect(b.elements[12]).toBe(threeB.elements[12]);
        expect(b.elements[13]).toBe(threeB.elements[13]);
        expect(b.elements[14]).toBe(threeB.elements[14]);
    });

    test("fromArray/toArray", () => {
        const array = [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        ];

        const a = createMatrix4().fromArray(array);
        const threeA = new ThreeMatrix4().fromArray(array);

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBe(threeA.elements[i]);
        }

        const outArray1 = [];
        const outArray2 = [];

        a.toArray(outArray1);
        threeA.toArray(outArray2);

        expect(outArray1).toEqual(outArray2);

        const outArray3 = [];
        const outArray4 = [];

        a.toArray(outArray3, 1);
        threeA.toArray(outArray4, 1);

        expect(outArray3).toEqual(outArray4);
    });

    test("identity", () => {
        const a = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        ).identity();
        const threeA = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        ).identity();

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBe(threeA.elements[i]);
        }
    });

    test("inv", () => {
        const a = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            0,
            0,
            0,
            1,
        ).inv();
        const threeA = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            0,
            0,
            0,
            1,
        ).invert();

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBeCloseTo(threeA.elements[i]);
        }
    });

    test("lookAt", () => {
        const eye = createVector3(0, 0, 5);
        const target = createVector3(0, 0, 0);
        const up = createVector3(0, 1, 0);

        const threeEye = new ThreeVector3(0, 0, 5);
        const threeTarget = new ThreeVector3(0, 0, 0);
        const threeUp = new ThreeVector3(0, 1, 0);

        const a = createMatrix4().lookAt(eye, target, up);
        const threeA = new ThreeMatrix4().lookAt(
            threeEye,
            threeTarget,
            threeUp,
        );

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBeCloseTo(threeA.elements[i]);
        }
    });

    test("makeOrthographic", () => {
        const size = 10;
        const aspect = 16 / 9;
        const near = 0.1;
        const far = 1000;

        const a = createMatrix4().makeOrthographic(size, aspect, near, far);
        const threeA = new ThreeMatrix4().makeOrthographic(
            -size * aspect,
            size * aspect,
            size,
            -size,
            near,
            far,
        );

        const v1 = createVector3(0, 0, -near * 2).applyMatrix4(a);
        const v2 = createVector3(0, 0, -far * 0.9).applyMatrix4(a);
        const threeV1 = new ThreeVector3(0, 0, -near * 2).applyMatrix4(threeA);
        const threeV2 = new ThreeVector3(0, 0, -far * 0.9).applyMatrix4(threeA);

        expect(v1.x).toBeCloseTo(threeV1.x);
        expect(v1.y).toBeCloseTo(threeV1.y);
        expect(v1.z).toBeCloseTo(threeV1.z);
        expect(v2.x).toBeCloseTo(threeV2.x);
        expect(v2.y).toBeCloseTo(threeV2.y);
        expect(v2.z).toBeCloseTo(threeV2.z);
    });

    test("makePerspective", () => {
        const fov = MathsUtils.QUARTER_PI;
        const aspect = 16 / 9;
        const near = 0.1;
        const far = 1000;

        const a = createMatrix4().makePerspective(fov, aspect, near, far);

        expect(a.elements[0]).not.toBe(0);
        expect(a.elements[5]).not.toBe(0);
        expect(a.elements[10]).not.toBe(0);
        expect(a.elements[11]).toBe(-1);
        expect(a.elements[14]).not.toBe(0);
        expect(a.elements[15]).toBe(0);
    });

    test("makeRotationFromQuaternion", () => {
        const q = createQuaternion().setFromAxisAngle(
            createVector3(0, 1, 0),
            MathsUtils.QUARTER_PI,
        );
        const threeQ = new ThreeQuaternion().setFromAxisAngle(
            new ThreeVector3(0, 1, 0),
            MathsUtils.QUARTER_PI,
        );

        const a = createMatrix4().makeRotationFromQuaternion(q);
        const threeA = new ThreeMatrix4().makeRotationFromQuaternion(threeQ);

        const testVec = createVector3(1, 0, 0);
        const threeTestVec = new ThreeVector3(1, 0, 0);

        const transformedVec = testVec.clone().applyMatrix4(a);
        const threeTransformedVec = threeTestVec.clone().applyMatrix4(threeA);

        expect(Math.abs(transformedVec.x)).toBeCloseTo(
            Math.abs(threeTransformedVec.x),
        );
        expect(Math.abs(transformedVec.y)).toBeCloseTo(
            Math.abs(threeTransformedVec.y),
        );
        expect(Math.abs(transformedVec.z)).toBeCloseTo(
            Math.abs(threeTransformedVec.z),
        );
    });

    test("makeRotationX", () => {
        const angle = MathsUtils.QUARTER_PI;

        const a = createMatrix4().makeRotationX(angle);
        const threeA = new ThreeMatrix4().makeRotationX(angle);

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBeCloseTo(threeA.elements[i]);
        }
    });

    test("makeRotationY", () => {
        const angle = MathsUtils.QUARTER_PI;

        const a = createMatrix4().makeRotationY(angle);
        const threeA = new ThreeMatrix4().makeRotationY(angle);

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBeCloseTo(threeA.elements[i]);
        }
    });

    test("makeRotationZ", () => {
        const angle = MathsUtils.QUARTER_PI;

        const a = createMatrix4().makeRotationZ(angle);
        const threeA = new ThreeMatrix4().makeRotationZ(angle);

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBeCloseTo(threeA.elements[i]);
        }
    });

    test("makeScale", () => {
        const a = createMatrix4().makeScale(2, 3, 4);
        const threeA = new ThreeMatrix4().makeScale(2, 3, 4);

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBe(threeA.elements[i]);
        }
    });

    test("makeShear", () => {
        const a = createMatrix4().makeShear(1, 2, 3, 4, 5, 6);
        const threeA = new ThreeMatrix4().makeShear(1, 2, 3, 4, 5, 6);

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBe(threeA.elements[i]);
        }
    });

    test("makeTranslation", () => {
        const a = createMatrix4().makeTranslation(1, 2, 3);
        const threeA = new ThreeMatrix4().makeTranslation(1, 2, 3);

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBe(threeA.elements[i]);
        }
    });

    test("mul/premul", () => {
        const a = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const b = createMatrix4().set(
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
        );
        const c = createMatrix4().copy(a).mul(b);
        const threeA = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const threeB = new ThreeMatrix4().set(
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
        );
        const threeC = new ThreeMatrix4().copy(threeA).multiply(threeB);

        for (let i = 0; i < 16; i++) {
            expect(c.elements[i]).toBeCloseTo(threeC.elements[i]);
        }

        const d = createMatrix4().copy(a).premul(b);
        const threeD = new ThreeMatrix4().copy(threeA).premultiply(threeB);

        for (let i = 0; i < 16; i++) {
            expect(d.elements[i]).toBeCloseTo(threeD.elements[i]);
        }
    });

    test("mulMatrices", () => {
        const a = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const b = createMatrix4().set(
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
        );
        const c = createMatrix4().mulMatrices(a, b);
        const threeA = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const threeB = new ThreeMatrix4().set(
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
        );
        const threeC = new ThreeMatrix4().multiplyMatrices(threeA, threeB);

        for (let i = 0; i < 16; i++) {
            expect(c.elements[i]).toBeCloseTo(threeC.elements[i]);
        }
    });

    test("mulScalar", () => {
        const a = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        ).mulScalar(2);
        const threeA = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        ).multiplyScalar(2);

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBe(threeA.elements[i]);
        }
    });

    test("set", () => {
        const a = createMatrix4();
        a.set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );

        const threeA = new ThreeMatrix4();
        threeA.set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBe(threeA.elements[i]);
        }
    });

    test("transpose", () => {
        const a = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        ).transpose();
        const threeA = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        ).transpose();

        for (let i = 0; i < 16; i++) {
            expect(a.elements[i]).toBe(threeA.elements[i]);
        }
    });
});
