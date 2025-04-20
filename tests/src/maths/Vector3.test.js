import { Vector3 as ThreeVector3 } from "three";
import { describe, expect, test } from "vitest";
import { createVector3 } from "../../../src/maths/Vector3.js";

describe("Vector3", () => {
    test("constructor", () => {
        const a = createVector3();
        const b = createVector3(1, 2, 3);

        expect(a.x).toBe(0);
        expect(a.y).toBe(0);
        expect(a.z).toBe(0);
        expect(b.x).toBe(1);
        expect(b.y).toBe(2);
        expect(b.z).toBe(3);

        const threeA = new ThreeVector3();
        const threeB = new ThreeVector3(1, 2, 3);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
        expect(b.x).toBe(threeB.x);
        expect(b.y).toBe(threeB.y);
        expect(b.z).toBe(threeB.z);
    });

    test("isVector3", () => {
        const vec = createVector3();
        const threeVec = new ThreeVector3();

        expect(vec.isVector3).toBe(true);
        expect(threeVec.isVector3).toBe(true);
    });

    test("length/lengthSq", () => {
        const a = createVector3(3, 4, 5);
        const threeA = new ThreeVector3(3, 4, 5);

        expect(a.length).toBeCloseTo(threeA.length());
        expect(a.lengthSq).toBeCloseTo(threeA.lengthSq());
    });

    test("add", () => {
        const a = createVector3(1, 2, 3);
        const b = createVector3(4, 5, 6);
        a.add(b);

        const threeA = new ThreeVector3(1, 2, 3);
        const threeB = new ThreeVector3(4, 5, 6);
        threeA.add(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("addScalar", () => {
        const a = createVector3(1, 2, 3).addScalar(4);
        const threeA = new ThreeVector3(1, 2, 3).addScalar(4);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("addVectors", () => {
        const a = createVector3();
        const b = createVector3(1, 2, 3);
        const c = createVector3(4, 5, 6);
        a.addVectors(b, c);

        const threeA = new ThreeVector3();
        const threeB = new ThreeVector3(1, 2, 3);
        const threeC = new ThreeVector3(4, 5, 6);
        threeA.addVectors(threeB, threeC);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("angleTo", () => {
        const a = createVector3(1, 0, 0);
        const b = createVector3(0, 1, 0);
        const threeA = new ThreeVector3(1, 0, 0);
        const threeB = new ThreeVector3(0, 1, 0);

        expect(a.angleTo(b)).toBeCloseTo(threeA.angleTo(threeB));
    });

    test("ceil", () => {
        const a = createVector3(0.1, 0.9, 1.5).ceil();
        const threeA = new ThreeVector3(0.1, 0.9, 1.5).ceil();

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("clamp", () => {
        const a = createVector3(-1, 3, 5);
        const min = createVector3(0, 0, 0);
        const max = createVector3(2, 2, 2);
        a.clamp(min, max);

        const threeA = new ThreeVector3(-1, 3, 5);
        const minThree = new ThreeVector3(0, 0, 0);
        const maxThree = new ThreeVector3(2, 2, 2);
        threeA.clamp(minThree, maxThree);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("clampScalar", () => {
        const a = createVector3(-1, 3, 5).clampScalar(0, 2);
        const threeA = new ThreeVector3(-1, 3, 5).clampScalar(0, 2);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("clone/copy", () => {
        const a = createVector3(1, 2, 3);
        const threeA = new ThreeVector3(1, 2, 3);

        const clonedA = a.clone();
        const clonedThreeA = threeA.clone();

        expect(clonedA.x).toBe(clonedThreeA.x);
        expect(clonedA.y).toBe(clonedThreeA.y);
        expect(clonedA.z).toBe(clonedThreeA.z);

        const b = createVector3().copy(a);
        const threeB = new ThreeVector3().copy(threeA);

        expect(b.x).toBe(threeB.x);
        expect(b.y).toBe(threeB.y);
        expect(b.z).toBe(threeB.z);
    });

    test("cross", () => {
        const a = createVector3(1, 0, 0);
        const b = createVector3(0, 1, 0);
        const result = a.clone().cross(b);

        const threeA = new ThreeVector3(1, 0, 0);
        const threeB = new ThreeVector3(0, 1, 0);
        const threeResult = threeA.clone().cross(threeB);

        expect(result.x).toBeCloseTo(threeResult.x);
        expect(result.y).toBeCloseTo(threeResult.y);
        expect(result.z).toBeCloseTo(threeResult.z);
    });

    test("crossVectors", () => {
        const a = createVector3();
        const b = createVector3(1, 0, 0);
        const c = createVector3(0, 1, 0);
        a.crossVectors(b, c);

        const threeA = new ThreeVector3();
        const threeB = new ThreeVector3(1, 0, 0);
        const threeC = new ThreeVector3(0, 1, 0);
        threeA.crossVectors(threeB, threeC);

        expect(a.x).toBeCloseTo(threeA.x);
        expect(a.y).toBeCloseTo(threeA.y);
        expect(a.z).toBeCloseTo(threeA.z);
    });

    test("distanceTo/distanceSqTo", () => {
        const a = createVector3(1, 2, 3);
        const b = createVector3(4, 6, 8);
        const threeA = new ThreeVector3(1, 2, 3);
        const threeB = new ThreeVector3(4, 6, 8);

        expect(a.distanceTo(b)).toBeCloseTo(
            threeA.distanceTo(threeB),
        );
        expect(a.distanceSqTo(b)).toBeCloseTo(
            threeA.distanceToSquared(threeB),
        );
    });

    test("div", () => {
        const a = createVector3(6, 8, 10);
        const b = createVector3(2, 4, 5);
        a.div(b);

        const threeA = new ThreeVector3(6, 8, 10);
        const threeB = new ThreeVector3(2, 4, 5);
        threeA.divide(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("divScalar", () => {
        const a = createVector3(6, 8, 10).divScalar(2);
        const threeA = new ThreeVector3(6, 8, 10).divideScalar(2);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("dot", () => {
        const a = createVector3(1, 2, 3);
        const b = createVector3(4, 5, 6);
        const threeA = new ThreeVector3(1, 2, 3);
        const threeB = new ThreeVector3(4, 5, 6);

        expect(a.dot(b)).toBe(threeA.dot(threeB));
    });

    test("equals", () => {
        const a = createVector3(1, 2, 3);
        const b = createVector3(1, 2, 3);
        const c = createVector3(4, 5, 6);
        const threeA = new ThreeVector3(1, 2, 3);
        const threeB = new ThreeVector3(1, 2, 3);
        const threeC = new ThreeVector3(4, 5, 6);

        expect(a.equals(b)).toBe(threeA.equals(threeB));
        expect(a.equals(c)).toBe(threeA.equals(threeC));
    });

    test("floor", () => {
        const a = createVector3(1.5, 2.5, 3.5).floor();
        const threeA = new ThreeVector3(1.5, 2.5, 3.5).floor();

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("fromArray", () => {
        const array = [1, 2, 3, 4, 5, 6];

        const a = createVector3();
        a.fromArray(array, 1);

        const threeA = new ThreeVector3();
        threeA.fromArray(array, 1);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("lerp", () => {
        const a = createVector3(1, 2, 3);
        const b = createVector3(4, 5, 6);
        a.lerp(b, 0.5);

        const threeA = new ThreeVector3(1, 2, 3);
        const threeB = new ThreeVector3(4, 5, 6);
        threeA.lerp(threeB, 0.5);

        expect(a.x).toBeCloseTo(threeA.x);
        expect(a.y).toBeCloseTo(threeA.y);
        expect(a.z).toBeCloseTo(threeA.z);
    });

    test("lerpVectors", () => {
        const a = createVector3();
        const b = createVector3(1, 2, 3);
        const c = createVector3(4, 5, 6);
        a.lerpVectors(b, c, 0.5);

        const threeA = new ThreeVector3();
        const threeB = new ThreeVector3(1, 2, 3);
        const threeC = new ThreeVector3(4, 5, 6);
        threeA.lerpVectors(threeB, threeC, 0.5);

        expect(a.x).toBeCloseTo(threeA.x);
        expect(a.y).toBeCloseTo(threeA.y);
        expect(a.z).toBeCloseTo(threeA.z);
    });

    test("max/min", () => {
        const a = createVector3(1, 2, 3);
        const b = createVector3(3, 1, 4);
        a.max(b);

        const threeA = new ThreeVector3(1, 2, 3);
        const threeB = new ThreeVector3(3, 1, 4);
        threeA.max(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);

        a.set(1, 2, 3);
        b.set(3, 1, 4);
        threeA.set(1, 2, 3);
        threeB.set(3, 1, 4);

        a.min(b);
        threeA.min(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("mul", () => {
        const a = createVector3(1, 2, 3);
        const b = createVector3(4, 5, 6);
        a.mul(b);

        const threeA = new ThreeVector3(1, 2, 3);
        const threeB = new ThreeVector3(4, 5, 6);
        threeA.multiply(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("mulScalar", () => {
        const a = createVector3(1, 2, 3).mulScalar(2);
        const threeA = new ThreeVector3(1, 2, 3).multiplyScalar(2);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("neg", () => {
        const a = createVector3(1, 2, 3).neg();
        const threeA = new ThreeVector3(1, 2, 3).negate();

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("set", () => {
        const a = createVector3().set(1, 2, 3);
        const threeA = new ThreeVector3().set(1, 2, 3);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("setScalar", () => {
        const a = createVector3().setScalar(1);
        const threeA = new ThreeVector3().setScalar(1);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("sub", () => {
        const a = createVector3(4, 5, 6);
        const b = createVector3(1, 2, 3);
        a.sub(b);

        const threeA = new ThreeVector3(4, 5, 6);
        const threeB = new ThreeVector3(1, 2, 3);
        threeA.sub(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("subScalar", () => {
        const a = createVector3(4, 5, 6).subScalar(1);
        const threeA = new ThreeVector3(4, 5, 6).subScalar(1);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("subVectors", () => {
        const a = createVector3();
        const b = createVector3(4, 5, 6);
        const c = createVector3(1, 2, 3);
        a.subVectors(b, c);

        const threeA = new ThreeVector3();
        const threeB = new ThreeVector3(4, 5, 6);
        const threeC = new ThreeVector3(1, 2, 3);
        threeA.subVectors(threeB, threeC);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(a.z).toBe(threeA.z);
    });

    test("toArray", () => {
        const array1 = [], array2 = [];
        const array3 = [], array4 = [];

        const a = createVector3(1, 2, 3);
        const threeA = new ThreeVector3(1, 2, 3);

        a.toArray(array1);
        threeA.toArray(array2);

        expect(array1).toEqual(array2);

        a.toArray(array3, 1);
        threeA.toArray(array4, 1);

        expect(array3).toEqual(array4);
    });

    test("unit", () => {
        const a = createVector3(3, 4, 5).unit();
        const threeA = new ThreeVector3(3, 4, 5).normalize();

        expect(a.x).toBeCloseTo(threeA.x);
        expect(a.y).toBeCloseTo(threeA.y);
        expect(a.z).toBeCloseTo(threeA.z);
    });
});
