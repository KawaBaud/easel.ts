import { Vector2 as ThreeVector2 } from "three";
import { describe, expect, test } from "vitest";
import { MathsUtils } from "../../../src/maths/MathsUtils.js";
import { createVector2 } from "../../../src/maths/Vector2.js";

describe("Vector2", () => {
    test("constructor", () => {
        const a = createVector2();
        const b = createVector2(1, 2);

        expect(a.x).toBe(0);
        expect(a.y).toBe(0);
        expect(b.x).toBe(1);
        expect(b.y).toBe(2);

        const threeA = new ThreeVector2();
        const threeB = new ThreeVector2(1, 2);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
        expect(b.x).toBe(threeB.x);
        expect(b.y).toBe(threeB.y);
    });

    test("isVector2", () => {
        const vec = createVector2();
        const threeVec = new ThreeVector2();

        expect(vec.isVector2).toBe(true);
        expect(threeVec.isVector2).toBe(true);
    });

    test("length/lengthSq", () => {
        const a = createVector2(3, 4);
        const threeA = new ThreeVector2(3, 4);

        expect(a.length).toBeCloseTo(threeA.length());
        expect(a.lengthSq).toBeCloseTo(threeA.lengthSq());
    });

    test("add", () => {
        const a = createVector2(1, 2);
        const b = createVector2(3, 4);
        a.add(b);

        const threeA = new ThreeVector2(1, 2);
        const threeB = new ThreeVector2(3, 4);
        threeA.add(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("addScalar", () => {
        const a = createVector2(1, 2).addScalar(3);
        const threeA = new ThreeVector2(1, 2).addScalar(3);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("addVectors", () => {
        const a = createVector2();
        const b = createVector2(1, 2);
        const c = createVector2(3, 4);
        a.addVectors(b, c);

        const threeA = new ThreeVector2();
        const threeB = new ThreeVector2(1, 2);
        const threeC = new ThreeVector2(3, 4);
        threeA.addVectors(threeB, threeC);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("angle", () => {
        const a = createVector2(1, 0);

        expect(a.angle()).toBeCloseTo(MathsUtils.TAU, 1);

        a.set(0, 1);

        const angle = a.angle();
        const isCloseToHalfPi = Math.abs(angle - MathsUtils.HALF_PI) < 0.1;
        const isCloseToThreeHalfPi =
            Math.abs(angle - (MathsUtils.HALF_PI * 3)) < 0.1;
        expect(isCloseToHalfPi || isCloseToThreeHalfPi).toBe(true);
    });

    test("angleTo", () => {
        const a = createVector2(1, 0);
        const b = createVector2(0, 1);
        const threeA = new ThreeVector2(1, 0);
        const threeB = new ThreeVector2(0, 1);

        expect(a.angleTo(b)).toBeCloseTo(threeA.angleTo(threeB));
    });

    test("ceil", () => {
        const a = createVector2(0.1, 0.9).ceil();
        const threeA = new ThreeVector2(0.1, 0.9).ceil();

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("clamp", () => {
        const a = createVector2(-1, 3);
        const min = createVector2(0, 0);
        const max = createVector2(2, 2);
        a.clamp(min, max);

        const threeA = new ThreeVector2(-1, 3);
        const minThree = new ThreeVector2(0, 0);
        const maxThree = new ThreeVector2(2, 2);
        threeA.clamp(minThree, maxThree);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("clampScalar", () => {
        const a = createVector2(-1, 3).clampScalar(0, 2);
        const threeA = new ThreeVector2(-1, 3).clampScalar(0, 2);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("clone/copy", () => {
        const a = createVector2(1, 2);
        const threeA = new ThreeVector2(1, 2);

        const clonedA = a.clone();
        const clonedThreeA = threeA.clone();

        expect(clonedA.x).toBe(clonedThreeA.x);
        expect(clonedA.y).toBe(clonedThreeA.y);

        const b = createVector2().copy(a);
        const threeB = new ThreeVector2().copy(threeA);

        expect(b.x).toBe(threeB.x);
        expect(b.y).toBe(threeB.y);
    });

    test("cross", () => {
        const a = createVector2(1, 2);
        const b = createVector2(3, 4);
        const threeA = new ThreeVector2(1, 2);
        const threeB = new ThreeVector2(3, 4);

        expect(a.cross(b)).toBe(threeA.cross(threeB));
    });

    test("distanceTo/distanceSqTo", () => {
        const a = createVector2(1, 2);
        const b = createVector2(4, 6);
        const threeA = new ThreeVector2(1, 2);
        const threeB = new ThreeVector2(4, 6);

        expect(a.distanceTo(b)).toBeCloseTo(
            threeA.distanceTo(threeB),
        );
        expect(a.distanceSqTo(b)).toBeCloseTo(
            threeA.distanceToSquared(threeB),
        );
    });

    test("div", () => {
        const a = createVector2(6, 8);
        const b = createVector2(2, 4);
        a.div(b);

        const threeA = new ThreeVector2(6, 8);
        const threeB = new ThreeVector2(2, 4);
        threeA.divide(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("divScalar", () => {
        const a = createVector2(6, 8).divScalar(2);
        const threeA = new ThreeVector2(6, 8).divideScalar(2);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("dot", () => {
        const a = createVector2(1, 2);
        const b = createVector2(3, 4);
        const threeA = new ThreeVector2(1, 2);
        const threeB = new ThreeVector2(3, 4);

        expect(a.dot(b)).toBe(threeA.dot(threeB));
    });

    test("equals", () => {
        const a = createVector2(1, 2);
        const b = createVector2(1, 2);
        const c = createVector2(3, 4);
        const threeA = new ThreeVector2(1, 2);
        const threeB = new ThreeVector2(1, 2);
        const threeC = new ThreeVector2(3, 4);

        expect(a.equals(b)).toBe(threeA.equals(threeB));
        expect(a.equals(c)).toBe(threeA.equals(threeC));
    });

    test("floor", () => {
        const a = createVector2(1.5, 2.5).floor();
        const threeA = new ThreeVector2(1.5, 2.5).floor();

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("fromArray", () => {
        const array = [1, 2, 3, 4];

        const a = createVector2();
        a.fromArray(array, 1);

        const threeA = new ThreeVector2();
        threeA.fromArray(array, 1);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("lerp", () => {
        const a = createVector2(1, 2);
        const b = createVector2(3, 4);
        a.lerp(b, 0.5);

        const threeA = new ThreeVector2(1, 2);
        const threeB = new ThreeVector2(3, 4);
        threeA.lerp(threeB, 0.5);

        expect(a.x).toBeCloseTo(threeA.x);
        expect(a.y).toBeCloseTo(threeA.y);
    });

    test("lerpVectors", () => {
        const a = createVector2();
        const b = createVector2(1, 2);
        const c = createVector2(3, 4);
        a.lerpVectors(b, c, 0.5);

        const threeA = new ThreeVector2();
        const threeB = new ThreeVector2(1, 2);
        const threeC = new ThreeVector2(3, 4);
        threeA.lerpVectors(threeB, threeC, 0.5);

        expect(a.x).toBeCloseTo(threeA.x);
        expect(a.y).toBeCloseTo(threeA.y);
    });

    test("max/min", () => {
        const a = createVector2(1, 2);
        const b = createVector2(3, 1);
        a.max(b);

        const threeA = new ThreeVector2(1, 2);
        const threeB = new ThreeVector2(3, 1);
        threeA.max(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);

        a.set(1, 2);
        b.set(3, 1);
        threeA.set(1, 2);
        threeB.set(3, 1);

        a.min(b);
        threeA.min(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("mul", () => {
        const a = createVector2(1, 2);
        const b = createVector2(3, 4);
        a.mul(b);

        const threeA = new ThreeVector2(1, 2);
        const threeB = new ThreeVector2(3, 4);
        threeA.multiply(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("mulScalar", () => {
        const a = createVector2(1, 2).mulScalar(3);
        const threeA = new ThreeVector2(1, 2).multiplyScalar(3);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("negate", () => {
        const a = createVector2(1, 2).negate();
        const threeA = new ThreeVector2(1, 2).negate();

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("rotate", () => {
        const a = createVector2(1, 0).rotate(MathsUtils.HALF_PI);

        /* three.js doesn't have 'rotate(angle)' */

        expect(a.x).toBeCloseTo(0);
        expect(a.y).toBeCloseTo(1);
    });

    test("rotateAround", () => {
        const a = createVector2(2, 0);
        const centre = createVector2(1, 0);
        a.rotateAround(centre, MathsUtils.HALF_PI);

        const threeA = new ThreeVector2(2, 0);
        const centreThree = new ThreeVector2(1, 0);
        threeA.rotateAround(centreThree, MathsUtils.HALF_PI);

        expect(a.x).toBeCloseTo(threeA.x);
        expect(a.y).toBeCloseTo(threeA.y);
    });

    test("set", () => {
        const a = createVector2().set(1, 2);
        const threeA = new ThreeVector2().set(1, 2);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("setScalar", () => {
        const a = createVector2().setScalar(1);
        const threeA = new ThreeVector2().setScalar(1);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("sub", () => {
        const a = createVector2(4, 5);
        const b = createVector2(1, 2);
        a.sub(b);

        const threeA = new ThreeVector2(4, 5);
        const threeB = new ThreeVector2(1, 2);
        threeA.sub(threeB);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("subScalar", () => {
        const a = createVector2(4, 5).subScalar(1);
        const threeA = new ThreeVector2(4, 5).subScalar(1);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("subVectors", () => {
        const a = createVector2();
        const b = createVector2(4, 5);
        const c = createVector2(1, 2);
        a.subVectors(b, c);

        const threeA = new ThreeVector2();
        const threeB = new ThreeVector2(4, 5);
        const threeC = new ThreeVector2(1, 2);
        threeA.subVectors(threeB, threeC);

        expect(a.x).toBe(threeA.x);
        expect(a.y).toBe(threeA.y);
    });

    test("toArray", () => {
        const array1 = [], array2 = [];
        const array3 = [], array4 = [];

        const a = createVector2(1, 2);
        const threeA = new ThreeVector2(1, 2);

        a.toArray(array1);
        threeA.toArray(array2);

        expect(array1).toEqual(array2);

        a.toArray(array3, 1);
        threeA.toArray(array4, 1);

        expect(array3).toEqual(array4);
    });

    test("unit", () => {
        const a = createVector2(3, 4).unit();
        const threeA = new ThreeVector2(3, 4).normalize();

        expect(a.x).toBeCloseTo(threeA.x);
        expect(a.y).toBeCloseTo(threeA.y);
    });
});
