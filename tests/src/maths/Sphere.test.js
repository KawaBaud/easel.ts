import { Sphere as ThreeSphere } from "three";
import { createSphere } from "../../../src/maths/Sphere.js";
import { createVector3 } from "../../../src/maths/Vector3.js";

describe("Sphere core", () => {
    test("create / constructor", () => {
        const ourSphere = createSphere();
        const threeSphere = new ThreeSphere();

        expect(ourSphere.isSphere).toBe(true);
        expect(threeSphere.isObject3D).toBe(undefined);

        expect(ourSphere.centre).toBeDefined();
        expect(ourSphere.radius).toBe(0);

        const centre = createVector3(1, 2, 3);
        const radius = 5;
        const ourSphere2 = createSphere(centre, radius);

        expect(ourSphere2.centre).toBe(centre);
        expect(ourSphere2.radius).toBe(radius);
    });

    test("containsPoint", () => {
        const centre = createVector3(0, 0, 0);
        const radius = 5;
        const sphere = createSphere(centre, radius);

        const point1 = createVector3(0, 0, 0);
        const point2 = createVector3(4, 0, 0);
        const point3 = createVector3(5, 0, 0);
        const point4 = createVector3(5.1, 0, 0);

        expect(sphere.containsPoint(point1)).toBe(true);
        expect(sphere.containsPoint(point2)).toBe(true);
        expect(sphere.containsPoint(point3)).toBe(true);
        expect(sphere.containsPoint(point4)).toBe(false);
    });

    test("containsSphere", () => {
        const sphere1 = createSphere(createVector3(0, 0, 0), 10);
        const sphere2 = createSphere(createVector3(0, 0, 0), 5);
        const sphere3 = createSphere(createVector3(0, 0, 0), 10);
        const sphere4 = createSphere(createVector3(6, 0, 0), 5);
        const sphere5 = createSphere(createVector3(16, 0, 0), 5);

        expect(sphere1.containsSphere(sphere2)).toBe(true);
        expect(sphere1.containsSphere(sphere3)).toBe(true);
        expect(sphere1.containsSphere(sphere4)).toBe(false);
        expect(sphere1.containsSphere(sphere5)).toBe(false);
    });

    test("intersectsSphere", () => {
        const sphere1 = createSphere(createVector3(0, 0, 0), 5);
        const sphere2 = createSphere(createVector3(0, 0, 0), 3);
        const sphere3 = createSphere(createVector3(8, 0, 0), 3);
        const sphere4 = createSphere(createVector3(9, 0, 0), 3);

        expect(sphere1.intersectsSphere(sphere2)).toBe(true);
        expect(sphere1.intersectsSphere(sphere3)).toBe(true);
        expect(sphere1.intersectsSphere(sphere4)).toBe(false);
    });

    test("setFromPoints", () => {
        const points = [
            createVector3(-5, 0, 0),
            createVector3(5, 0, 0),
            createVector3(0, 3, 0),
            createVector3(0, 0, 4),
        ];

        const sphere = createSphere().setFromPoints(points);

        expect(sphere.centre.x).toBeCloseTo(0, 5);
        expect(sphere.centre.y).toBeCloseTo(1.5, 5);
        expect(sphere.centre.z).toBeCloseTo(2, 5);
        expect(sphere.radius).toBeCloseTo(5.59, 2);
    });

    test("setFromVertices", () => {
        const vertices = new Float32Array([
            -5,
            0,
            0,
            5,
            0,
            0,
            0,
            3,
            0,
            0,
            0,
            4,
        ]);

        const sphere = createSphere().setFromVertices(vertices);

        expect(sphere.centre.x).toBeCloseTo(0, 5);
        expect(sphere.centre.y).toBeCloseTo(1.5, 5);
        expect(sphere.centre.z).toBeCloseTo(2, 5);
        expect(sphere.radius).toBeCloseTo(5.59, 2);
    });

    test("copy", () => {
        const sphere1 = createSphere(createVector3(1, 2, 3), 5);
        const sphere2 = createSphere().copy(sphere1);

        expect(sphere2.centre.x).toBe(1);
        expect(sphere2.centre.y).toBe(2);
        expect(sphere2.centre.z).toBe(3);
        expect(sphere2.radius).toBe(5);
    });

    test("clone", () => {
        const sphere1 = createSphere(createVector3(1, 2, 3), 5);
        const sphere2 = sphere1.clone();

        expect(sphere2.centre.x).toBe(1);
        expect(sphere2.centre.y).toBe(2);
        expect(sphere2.centre.z).toBe(3);
        expect(sphere2.radius).toBe(5);
        expect(sphere2).not.toBe(sphere1);
    });
});
