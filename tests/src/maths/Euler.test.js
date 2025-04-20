import {
    Euler as ThreeEuler,
    Matrix4 as ThreeMatrix4,
    Quaternion as ThreeQuaternion,
    Vector3 as ThreeVector3,
} from "three";
import { createEuler } from "../../../src/maths/Euler.js";
import { MathsUtils } from "../../../src/maths/MathsUtils.js";
import { createMatrix4 } from "../../../src/maths/Matrix4.js";
import { createQuaternion } from "../../../src/maths/Quaternion.js";
import { createVector3 } from "../../../src/maths/Vector3.js";

const compareEulers = (ourEuler, threeEuler, epsilon = MathsUtils.EPSILON) => {
    expect(ourEuler.x).toBeCloseTo(threeEuler.x, epsilon);
    expect(ourEuler.y).toBeCloseTo(threeEuler.y, epsilon);
    expect(ourEuler.z).toBeCloseTo(threeEuler.z, epsilon);
    expect(ourEuler.order).toBe(threeEuler.order);
};

describe("Euler core", () => {
    test("create / constructor", () => {
        const ourEuler = createEuler();
        const threeEuler = new ThreeEuler();
        compareEulers(ourEuler, threeEuler);

        const x = 0.1, y = 0.2, z = 0.3, order = "ZYX";

        const ourEuler2 = createEuler(x, y, z, order);
        const threeEuler2 = new ThreeEuler(x, y, z, order);
        compareEulers(ourEuler2, threeEuler2);
    });

    test("set", () => {
        const x = 0.1, y = 0.2, z = 0.3, order = "ZYX";

        const ourEuler = createEuler().set(x, y, z, order);
        const threeEuler = new ThreeEuler().set(x, y, z, order);
        compareEulers(ourEuler, threeEuler);
    });

    test("clone and copy", () => {
        const x = 0.1, y = 0.2, z = 0.3, order = "ZYX";

        const ourEuler1 = createEuler(x, y, z, order);
        const threeEuler1 = new ThreeEuler(x, y, z, order);

        const ourEuler2 = ourEuler1.clone();
        const threeEuler2 = threeEuler1.clone();
        compareEulers(ourEuler2, threeEuler2);

        const ourEuler3 = createEuler().copy(ourEuler1);
        const threeEuler3 = new ThreeEuler().copy(threeEuler1);
        compareEulers(ourEuler3, threeEuler3);
    });

    test("fromArray and toArray", () => {
        const array = [0.1, 0.2, 0.3, "ZYX"];

        const ourEuler = createEuler().fromArray(array);
        const threeEuler = new ThreeEuler().fromArray(array);

        expect(ourEuler.x).toBeCloseTo(0.1);
        expect(ourEuler.y).toBeCloseTo(0.2);
        expect(ourEuler.z).toBeCloseTo(0.3);
        expect(ourEuler.order).toBe("ZYX");

        const ourArray = [];
        const threeArray = [];
        ourEuler.toArray(ourArray);
        threeEuler.toArray(threeArray);

        expect(ourArray[0]).toBeCloseTo(threeArray[0]);
        expect(ourArray[1]).toBeCloseTo(threeArray[1]);
        expect(ourArray[2]).toBeCloseTo(threeArray[2]);
        expect(ourArray[3]).toBe(threeArray[3]);

        const offsetArray = [9, 9, ...array];
        const ourEulerOffset = createEuler().fromArray(offsetArray, 2);

        expect(ourEulerOffset.x).toBeCloseTo(0.1);
        expect(ourEulerOffset.y).toBeCloseTo(0.2);
        expect(ourEulerOffset.z).toBeCloseTo(0.3);
        expect(ourEulerOffset.order).toBe("ZYX");
    });

    test("equals", () => {
        const e1 = createEuler(0.1, 0.2, 0.3, "XYZ");
        const e2 = createEuler(0.1, 0.2, 0.3, "XYZ");
        const e3 = createEuler(0.4, 0.5, 0.6, "XYZ");
        const e4 = createEuler(0.1, 0.2, 0.3, "ZYX");

        expect(e1.equals(e2)).toBe(true);
        expect(e1.equals(e3)).toBe(false);
        expect(e1.equals(e4)).toBe(false);
    });

    test("toVector3", () => {
        const e = createEuler(0.1, 0.2, 0.3);
        const v = createVector3();

        e.toVector3(v);

        expect(v.x).toBeCloseTo(e.x);
        expect(v.y).toBeCloseTo(e.y);
        expect(v.z).toBeCloseTo(e.z);
    });
});

describe("Euler conversions", () => {
    test("setFromRotationMatrix", () => {
        const x = 0, y = 0, z = 0, order = "XYZ";

        const ourQuat = createQuaternion().setFromEuler({ x, y, z, order });
        const threeQuat = new ThreeQuaternion().setFromEuler(
            new ThreeEuler(x, y, z, order),
        );

        const ourMat = createMatrix4().makeRotationFromQuaternion(ourQuat);
        const threeMat = new ThreeMatrix4().makeRotationFromQuaternion(
            threeQuat,
        );

        const ourEuler = createEuler().setFromRotationMatrix(ourMat, order);
        const threeEuler = new ThreeEuler().setFromRotationMatrix(
            threeMat,
            order,
        );

        expect(ourEuler.x).toBeCloseTo(threeEuler.x, 5);
        expect(ourEuler.y).toBeCloseTo(threeEuler.y, 5);
        expect(ourEuler.z).toBeCloseTo(threeEuler.z, 5);
        expect(ourEuler.order).toBe(threeEuler.order);
    });

    test("setFromQuaternion", () => {
        const x = 0, y = 0, z = 0, order = "XYZ";

        const ourQuat = createQuaternion().setFromEuler({ x, y, z, order });
        const threeQuat = new ThreeQuaternion().setFromEuler(
            new ThreeEuler(x, y, z, order),
        );

        const ourEuler = createEuler().setFromQuaternion(ourQuat, order);
        const threeEuler = new ThreeEuler().setFromQuaternion(threeQuat, order);

        expect(ourEuler.x).toBeCloseTo(threeEuler.x, 5);
        expect(ourEuler.y).toBeCloseTo(threeEuler.y, 5);
        expect(ourEuler.z).toBeCloseTo(threeEuler.z, 5);
        expect(ourEuler.order).toBe(threeEuler.order);
    });

    test("setFromVector3", () => {
        const x = 0.1, y = 0.2, z = 0.3, order = "XYZ";

        const ourVec = createVector3(x, y, z);
        const threeVec = new ThreeVector3(x, y, z);

        const ourEuler = createEuler().setFromVector3(ourVec, order);
        const threeEuler = new ThreeEuler().setFromVector3(threeVec, order);

        expect(ourEuler.x).toBeCloseTo(threeEuler.x, 5);
        expect(ourEuler.y).toBeCloseTo(threeEuler.y, 5);
        expect(ourEuler.z).toBeCloseTo(threeEuler.z, 5);
        expect(ourEuler.order).toBe(threeEuler.order);
    });

    test("reorder", () => {
        const x = 0, y = 0, z = 0, order = "XYZ";
        const newOrder = "ZYX";

        const ourEuler = createEuler(x, y, z, order).reorder(newOrder);
        const threeEuler = new ThreeEuler(x, y, z, order).reorder(newOrder);

        expect(ourEuler.x).toBeCloseTo(threeEuler.x, 5);
        expect(ourEuler.y).toBeCloseTo(threeEuler.y, 5);
        expect(ourEuler.z).toBeCloseTo(threeEuler.z, 5);
        expect(ourEuler.order).toBe(threeEuler.order);
    });
});
