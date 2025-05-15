import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Box3 as ThreeBox3,
	Sphere as ThreeSphere,
	Vector3 as ThreeVector3,
} from "three";
import "../../extensions/array.extension.ts";
import { Box3 } from "../../src/maths/Box3.ts";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Sphere } from "../../src/maths/Sphere.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";

function compareBoxes(
	ourBox: Box3,
	threeBox: ThreeBox3,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our:   min(${ourBox.min.x}, ${ourBox.min.y}, ${ourBox.min.z}), max(${ourBox.max.x}, ${ourBox.max.y}, ${ourBox.max.z})`,
	);
	console.log(
		`  Three: min(${threeBox.min.x}, ${threeBox.min.y}, ${threeBox.min.z}), max(${threeBox.max.x}, ${threeBox.max.y}, ${threeBox.max.z})`,
	);

	assertAlmostEquals(
		ourBox.min.x,
		threeBox.min.x,
		MathUtils.EPSILON,
		`${message} (min.x)`,
	);
	assertAlmostEquals(
		ourBox.min.y,
		threeBox.min.y,
		MathUtils.EPSILON,
		`${message} (min.y)`,
	);
	assertAlmostEquals(
		ourBox.min.z,
		threeBox.min.z,
		MathUtils.EPSILON,
		`${message} (min.z)`,
	);
	assertAlmostEquals(
		ourBox.max.x,
		threeBox.max.x,
		MathUtils.EPSILON,
		`${message} (max.x)`,
	);
	assertAlmostEquals(
		ourBox.max.y,
		threeBox.max.y,
		MathUtils.EPSILON,
		`${message} (max.y)`,
	);
	assertAlmostEquals(
		ourBox.max.z,
		threeBox.max.z,
		MathUtils.EPSILON,
		`${message} (max.z)`,
	);
}

Deno.test("Box3: constructor", () => {
	const a = new Box3();
	assertEquals(a.min.x, Infinity);
	assertEquals(a.min.y, Infinity);
	assertEquals(a.min.z, Infinity);
	assertEquals(a.max.x, -Infinity);
	assertEquals(a.max.y, -Infinity);
	assertEquals(a.max.z, -Infinity);

	const min = new Vector3(1, 2, 3);
	const max = new Vector3(4, 5, 6);
	const b = new Box3(min, max);
	const threeB = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	compareBoxes(b, threeB, "constructor w/values");
});

Deno.test("Box3: get->centre", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const centre = a.centre;
	const threeCentre = new ThreeVector3();
	threeA.getCenter(threeCentre);

	assertAlmostEquals(centre.x, threeCentre.x, MathUtils.EPSILON, "centre.x");
	assertAlmostEquals(centre.y, threeCentre.y, MathUtils.EPSILON, "centre.y");
	assertAlmostEquals(centre.z, threeCentre.z, MathUtils.EPSILON, "centre.z");
});

Deno.test("Box3: get->size", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const size = a.size;
	const threeSize = new ThreeVector3();
	threeA.getSize(threeSize);

	assertAlmostEquals(size.x, threeSize.x, MathUtils.EPSILON, "size.x");
	assertAlmostEquals(size.y, threeSize.y, MathUtils.EPSILON, "size.y");
	assertAlmostEquals(size.z, threeSize.z, MathUtils.EPSILON, "size.z");
});

Deno.test("Box3: get->width", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const width = a.width;
	const threeWidth = threeA.max.x - threeA.min.x;

	assertAlmostEquals(width, threeWidth, MathUtils.EPSILON, "width");
});

Deno.test("Box3: get->height", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const height = a.height;
	const threeHeight = threeA.max.y - threeA.min.y;

	assertAlmostEquals(height, threeHeight, MathUtils.EPSILON, "height");
});

Deno.test("Box3: get->depth", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const depth = a.depth;
	const threeDepth = threeA.max.z - threeA.min.z;

	assertAlmostEquals(depth, threeDepth, MathUtils.EPSILON, "depth");
});

Deno.test("Box3: get->isEmpty", () => {
	const a = new Box3();
	const threeA = new ThreeBox3();
	assertEquals(a.isEmpty, threeA.isEmpty(), "isEmpty (empty box)");

	const b = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeB = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	assertEquals(b.isEmpty, threeB.isEmpty(), "isEmpty (non-empty box)");

	const c = new Box3(
		new Vector3(4, 5, 6),
		new Vector3(1, 2, 3),
	);
	const threeC = new ThreeBox3(
		new ThreeVector3(4, 5, 6),
		new ThreeVector3(1, 2, 3),
	);
	assertEquals(c.isEmpty, threeC.isEmpty(), "isEmpty (min > max)");
});

Deno.test("Box3: clone", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const b = a.clone();
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	const threeB = threeA.clone();

	compareBoxes(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("Box3: containsBox", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	assertEquals(
		a.containsBox(a),
		threeA.containsBox(threeA),
		"containsBox (self)",
	);

	const b = new Box3(
		new Vector3(2, 3, 4),
		new Vector3(3, 4, 5),
	);
	const threeB = new ThreeBox3(
		new ThreeVector3(2, 3, 4),
		new ThreeVector3(3, 4, 5),
	);
	assertEquals(
		a.containsBox(b),
		threeA.containsBox(threeB),
		"containsBox (smaller)",
	);

	const c = new Box3(
		new Vector3(0, 1, 2),
		new Vector3(5, 6, 7),
	);
	const threeC = new ThreeBox3(
		new ThreeVector3(0, 1, 2),
		new ThreeVector3(5, 6, 7),
	);
	assertEquals(
		a.containsBox(c),
		threeA.containsBox(threeC),
		"containsBox (larger)",
	);

	const d = new Box3(
		new Vector3(3, 4, 5),
		new Vector3(6, 7, 8),
	);
	const threeD = new ThreeBox3(
		new ThreeVector3(3, 4, 5),
		new ThreeVector3(6, 7, 8),
	);
	assertEquals(
		a.containsBox(d),
		threeA.containsBox(threeD),
		"containsBox (overlapping)",
	);
});

Deno.test("Box3: containsPoint", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const point1 = new Vector3(2, 3, 4);
	const threePoint1 = new ThreeVector3(2, 3, 4);
	assertEquals(
		a.containsPoint(point1),
		threeA.containsPoint(threePoint1),
		"containsPoint (inside)",
	);

	const point2 = new Vector3(1, 2, 3);
	const threePoint2 = new ThreeVector3(1, 2, 3);
	assertEquals(
		a.containsPoint(point2),
		threeA.containsPoint(threePoint2),
		"containsPoint (on boundary)",
	);

	const point3 = new Vector3(0, 0, 0);
	const threePoint3 = new ThreeVector3(0, 0, 0);
	assertEquals(
		a.containsPoint(point3),
		threeA.containsPoint(threePoint3),
		"containsPoint (outside)",
	);
});

Deno.test("Box3: copy", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const b = new Box3().copy(a);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	const threeB = new ThreeBox3().copy(threeA);
	compareBoxes(b, threeB, "copy");

	a.min.set(0, 0, 0);
	a.max.set(1, 1, 1);

	threeA.min.set(0, 0, 0);
	threeA.max.set(1, 1, 1);
	compareBoxes(b, threeB, "copy (after modifying original)");
});

Deno.test("Box3: equals", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const b = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const c = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 7),
	);
	const d = new Box3(
		new Vector3(0, 2, 3),
		new Vector3(4, 5, 6),
	);

	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	const threeB = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	const threeC = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 7),
	);
	const threeD = new ThreeBox3(
		new ThreeVector3(0, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	assertEquals(a.equals(b), threeA.equals(threeB), "equals (true)");
	assertEquals(a.equals(c), threeA.equals(threeC), "equals (different max)");
	assertEquals(a.equals(d), threeA.equals(threeD), "equals (different min)");
});

Deno.test("Box3: expandByPoint", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const point1 = new Vector3(2, 3, 4);
	const threePoint1 = new ThreeVector3(2, 3, 4);
	a.expandByPoint(point1);
	threeA.expandByPoint(threePoint1);
	compareBoxes(a, threeA, "expandByPoint (inside)");

	const point2 = new Vector3(0, 0, 0);
	const threePoint2 = new ThreeVector3(0, 0, 0);
	a.expandByPoint(point2);
	threeA.expandByPoint(threePoint2);
	compareBoxes(a, threeA, "expandByPoint (outside)");
});

Deno.test("Box3: expandByScalar", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	a.expandByScalar(2);
	threeA.expandByScalar(2);
	compareBoxes(a, threeA, "expandByScalar");
});

Deno.test("Box3: expandByVector3", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const v = new Vector3(2, 3, 4);
	const threeV = new ThreeVector3(2, 3, 4);

	a.expandByVector3(v);
	threeA.expandByVector(threeV);
	compareBoxes(a, threeA, "expandByVector3");
});

Deno.test("Box3: intersectsBox", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const b = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeB = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	assertEquals(
		a.intersectsBox(b),
		threeA.intersectsBox(threeB),
		"intersectsBox (self)",
	);

	const c = new Box3(
		new Vector3(3, 4, 5),
		new Vector3(6, 7, 8),
	);
	const threeC = new ThreeBox3(
		new ThreeVector3(3, 4, 5),
		new ThreeVector3(6, 7, 8),
	);
	assertEquals(
		a.intersectsBox(c),
		threeA.intersectsBox(threeC),
		"intersectsBox (overlapping)",
	);

	const d = new Box3(
		new Vector3(10, 11, 12),
		new Vector3(13, 14, 15),
	);
	const threeD = new ThreeBox3(
		new ThreeVector3(10, 11, 12),
		new ThreeVector3(13, 14, 15),
	);
	assertEquals(
		a.intersectsBox(d),
		threeA.intersectsBox(threeD),
		"intersectsBox (non-overlapping)",
	);
});

Deno.test("Box3: intersectsSphere", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const sphere1 = new Sphere(new Vector3(2, 3, 4), 1);
	const threeSphere1 = new ThreeSphere(new ThreeVector3(2, 3, 4), 1);
	assertEquals(
		a.intersectsSphere(sphere1),
		threeA.intersectsSphere(threeSphere1),
		"intersectsSphere (inside)",
	);

	const sphere2 = new Sphere(new Vector3(0, 1, 2), 2);
	const threeSphere2 = new ThreeSphere(new ThreeVector3(0, 1, 2), 2);
	assertEquals(
		a.intersectsSphere(sphere2),
		threeA.intersectsSphere(threeSphere2),
		"intersectsSphere (intersecting)",
	);

	const sphere3 = new Sphere(new Vector3(10, 10, 10), 1);
	const threeSphere3 = new ThreeSphere(new ThreeVector3(10, 10, 10), 1);
	assertEquals(
		a.intersectsSphere(sphere3),
		threeA.intersectsSphere(threeSphere3),
		"intersectsSphere (non-intersecting)",
	);
});

Deno.test("Box3: makeEmpty", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	a.makeEmpty();
	threeA.makeEmpty();

	assertEquals(a.isEmpty, threeA.isEmpty(), "makeEmpty (isEmpty)");
	compareBoxes(a, threeA, "makeEmpty");
});

Deno.test("Box3: setFromCentreAndSize", () => {
	const a = new Box3();
	const threeA = new ThreeBox3();

	const centre = new Vector3(1, 2, 3);
	const size = new Vector3(4, 6, 8);
	const threeCentre = new ThreeVector3(1, 2, 3);
	const threeSize = new ThreeVector3(4, 6, 8);

	a.setFromCentreAndSize(centre, size);
	threeA.setFromCenterAndSize(threeCentre, threeSize);

	compareBoxes(a, threeA, "setFromCentreAndSize");
});

Deno.test("Box3: setFromPoints", () => {
	const a = new Box3();
	const threeA = new ThreeBox3();

	const points = [
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
		new Vector3(-1, -2, -3),
	];
	const threePoints = [
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
		new ThreeVector3(-1, -2, -3),
	];

	a.setFromPoints(points);
	threeA.setFromPoints(threePoints);

	compareBoxes(a, threeA, "setFromPoints");
});

Deno.test("Box3: translate", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const offset = new Vector3(10, 20, 30);
	const threeOffset = new ThreeVector3(10, 20, 30);

	a.translate(offset);
	threeA.translate(threeOffset);

	compareBoxes(a, threeA, "translate");
});

Deno.test("Box3: union", () => {
	const a = new Box3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeBox3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const b = new Box3(
		new Vector3(-1, -2, -3),
		new Vector3(2, 3, 4),
	);
	const threeB = new ThreeBox3(
		new ThreeVector3(-1, -2, -3),
		new ThreeVector3(2, 3, 4),
	);

	a.union(b);
	threeA.union(threeB);

	compareBoxes(a, threeA, "union");
});
