import { Vector2 as ThreeVector2 } from "three";
import { createVector2 } from "../../../src/maths/Vector2.js";

describe("Vector2 core", () => {
    test("create / constructor", () => {
        const ourVector = createVector2(1, 2);
        const threeVector = new ThreeVector2(1, 2);

        expect(ourVector.isVector2).toBe(true);
        expect(threeVector.isVector2).toBe(true);

        expect(ourVector.x).toBe(1);
        expect(ourVector.y).toBe(2);
        expect(threeVector.x).toBe(1);
        expect(threeVector.y).toBe(2);
    });

    test("length and lengthSq", () => {
        const ourVector = createVector2(3, 4);
        const threeVector = new ThreeVector2(3, 4);

        expect(ourVector.length).toBe(5);
        expect(threeVector.length()).toBe(5);

        expect(ourVector.lengthSq).toBe(25);
        expect(threeVector.lengthSq()).toBe(25);
    });

    test("add", () => {
        const ourVectorA = createVector2(1, 2);
        const ourVectorB = createVector2(3, 4);
        const threeVectorA = new ThreeVector2(1, 2);
        const threeVectorB = new ThreeVector2(3, 4);

        ourVectorA.add(ourVectorB);
        threeVectorA.add(threeVectorB);

        expect(ourVectorA.x).toBe(4);
        expect(ourVectorA.y).toBe(6);
        expect(threeVectorA.x).toBe(4);
        expect(threeVectorA.y).toBe(6);
    });

    test("cross", () => {
        const ourVectorA = createVector2(1, 2);
        const ourVectorB = createVector2(3, 4);
        const threeVectorA = new ThreeVector2(1, 2);
        const threeVectorB = new ThreeVector2(3, 4);

        const ourCross = ourVectorA.cross(ourVectorB);
        const threeCross = threeVectorA.cross(threeVectorB);

        expect(ourCross).toBe(-2);
        expect(threeCross).toBe(-2);
    });
});
