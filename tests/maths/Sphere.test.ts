import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { Sphere as ThreeSphere, Vector3 as ThreeVector3 } from "three";
import { Maths } from "../../src/maths/Maths.ts";
import { Sphere } from "../../src/maths/Sphere.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";
import "../../src/types.ts";

function compareSpheres(
	ourSphere: Sphere,
	threeSphere: ThreeSphere,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our:   centre(${ourSphere.centre.x}, ${ourSphere.centre.y}, ${ourSphere.centre.z}), radius=${ourSphere.radius}`,
	);
	console.log(
		`  Three: center(${threeSphere.center.x}, ${threeSphere.center.y}, ${threeSphere.center.z}), radius=${threeSphere.radius}`,
	);

	assertAlmostEquals(
		ourSphere.centre.x,
		threeSphere.center.x,
		Maths.EPSILON,
		`${message} (centre.x)`,
	);
	assertAlmostEquals(
		ourSphere.centre.y,
		threeSphere.center.y,
		Maths.EPSILON,
		`${message} (centre.y)`,
	);
	assertAlmostEquals(
		ourSphere.centre.z,
		threeSphere.center.z,
		Maths.EPSILON,
		`${message} (centre.z)`,
	);
	assertAlmostEquals(
		ourSphere.radius,
		threeSphere.radius,
		Maths.EPSILON,
		`${message} (radius)`,
	);
}

Deno.test("Sphere: constructor", () => {
	const a = new Sphere();
	assertEquals(a.centre.x, 0);
	assertEquals(a.centre.y, 0);
	assertEquals(a.centre.z, 0);
	assertEquals(a.radius, 1);

	const centre = new Vector3(1, 2, 3);
	const radius = 5;
	const b = new Sphere(centre, radius);
	const threeB = new ThreeSphere(
		new ThreeVector3(1, 2, 3),
		5,
	);
	assertAlmostEquals(
		b.centre.x,
		threeB.center.x,
		Maths.EPSILON,
		"constructor w/ values (centre.x)",
	);
	assertAlmostEquals(
		b.centre.y,
		threeB.center.y,
		Maths.EPSILON,
		"constructor w/ values (centre.y)",
	);
	assertAlmostEquals(
		b.centre.z,
		threeB.center.z,
		Maths.EPSILON,
		"constructor w/ values (centre.z)",
	);
	assertAlmostEquals(
		b.radius,
		threeB.radius,
		Maths.EPSILON,
		"constructor w/ values (radius)",
	);
});

Deno.test("Sphere: clone", () => {
	const a = new Sphere(
		new Vector3(1, 2, 3),
		5,
	);
	const b = a.clone();
	const threeA = new ThreeSphere(
		new ThreeVector3(1, 2, 3),
		5,
	);
	const threeB = threeA.clone();

	compareSpheres(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("Sphere: containsPoint", () => {
	const a = new Sphere(
		new Vector3(1, 2, 3),
		5,
	);
	const threeA = new ThreeSphere(
		new ThreeVector3(1, 2, 3),
		5,
	);

	const point1 = new Vector3(2, 3, 4);
	const threePoint1 = new ThreeVector3(2, 3, 4);
	assertEquals(
		a.containsPoint(point1),
		threeA.containsPoint(threePoint1),
		"containsPoint (inside)",
	);

	const point2 = new Vector3(1, 2, 8);
	const threePoint2 = new ThreeVector3(1, 2, 8);
	assertEquals(
		a.containsPoint(point2),
		threeA.containsPoint(threePoint2),
		"containsPoint (on surface)",
	);

	const point3 = new Vector3(10, 10, 10);
	const threePoint3 = new ThreeVector3(10, 10, 10);
	assertEquals(
		a.containsPoint(point3),
		threeA.containsPoint(threePoint3),
		"containsPoint (outside)",
	);
});

Deno.test("Sphere: copy", () => {
	const a = new Sphere(
		new Vector3(1, 2, 3),
		5,
	);
	const b = new Sphere().copy(a);
	const threeA = new ThreeSphere(
		new ThreeVector3(1, 2, 3),
		5,
	);
	const threeB = new ThreeSphere().copy(threeA);
	compareSpheres(b, threeB, "copy");

	a.centre.set(0, 0, 0);
	a.radius = 1;
	threeA.center.set(0, 0, 0);
	threeA.radius = 1;
	compareSpheres(b, threeB, "copy (after modifying original)");
});

Deno.test("Sphere: distanceToPoint", () => {
	const a = new Sphere(
		new Vector3(1, 2, 3),
		5,
	);
	const threeA = new ThreeSphere(
		new ThreeVector3(1, 2, 3),
		5,
	);

	const point1 = new Vector3(2, 3, 4);
	const threePoint1 = new ThreeVector3(2, 3, 4);
	assertAlmostEquals(
		a.distanceToPoint(point1),
		threeA.distanceToPoint(threePoint1),
		Maths.EPSILON,
		"distanceToPoint (inside)",
	);

	const point2 = new Vector3(1, 2, 8);
	const threePoint2 = new ThreeVector3(1, 2, 8);
	assertAlmostEquals(
		a.distanceToPoint(point2),
		threeA.distanceToPoint(threePoint2),
		Maths.EPSILON,
		"distanceToPoint (on surface)",
	);

	const point3 = new Vector3(10, 10, 10);
	const threePoint3 = new ThreeVector3(10, 10, 10);
	assertAlmostEquals(
		a.distanceToPoint(point3),
		threeA.distanceToPoint(threePoint3),
		Maths.EPSILON,
		"distanceToPoint (outside)",
	);
});

Deno.test("Sphere: equals", () => {
	const a = new Sphere(
		new Vector3(1, 2, 3),
		5,
	);
	const b = new Sphere(
		new Vector3(1, 2, 3),
		5,
	);
	const c = new Sphere(
		new Vector3(1, 2, 3),
		6,
	);
	const d = new Sphere(
		new Vector3(4, 5, 6),
		5,
	);

	const threeA = new ThreeSphere(
		new ThreeVector3(1, 2, 3),
		5,
	);
	const threeB = new ThreeSphere(
		new ThreeVector3(1, 2, 3),
		5,
	);
	const threeC = new ThreeSphere(
		new ThreeVector3(1, 2, 3),
		6,
	);
	const threeD = new ThreeSphere(
		new ThreeVector3(4, 5, 6),
		5,
	);

	assertEquals(a.equals(b), threeA.equals(threeB), "equals (true)");
	assertEquals(a.equals(c), threeA.equals(threeC), "equals (different radius)");
	assertEquals(a.equals(d), threeA.equals(threeD), "equals (different centre)");
});

Deno.test("Sphere: intersectsSphere", () => {
	const a = new Sphere(
		new Vector3(0, 0, 0),
		5,
	);
	const threeA = new ThreeSphere(
		new ThreeVector3(0, 0, 0),
		5,
	);

	const b = new Sphere(
		new Vector3(8, 0, 0),
		5,
	);
	const threeB = new ThreeSphere(
		new ThreeVector3(8, 0, 0),
		5,
	);
	assertEquals(
		a.intersectsSphere(b),
		threeA.intersectsSphere(threeB),
		"intersectsSphere (intersect)",
	);

	const c = new Sphere(
		new Vector3(10, 0, 0),
		5,
	);
	const threeC = new ThreeSphere(
		new ThreeVector3(10, 0, 0),
		5,
	);
	assertEquals(
		a.intersectsSphere(c),
		threeA.intersectsSphere(threeC),
		"intersectsSphere (touch)",
	);

	const d = new Sphere(
		new Vector3(15, 0, 0),
		5,
	);
	const threeD = new ThreeSphere(
		new ThreeVector3(15, 0, 0),
		5,
	);
	assertEquals(
		a.intersectsSphere(d),
		threeA.intersectsSphere(threeD),
		"intersectsSphere (no intersection)",
	);
});

Deno.test("Sphere: translate", () => {
	const a = new Sphere(
		new Vector3(1, 2, 3),
		5,
	);
	const threeA = new ThreeSphere(
		new ThreeVector3(1, 2, 3),
		5,
	);

	const offset = new Vector3(10, 20, 30);
	const threeOffset = new ThreeVector3(10, 20, 30);

	a.translate(offset);
	threeA.translate(threeOffset);

	compareSpheres(a, threeA, "translate");
});
