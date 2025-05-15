import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Line3 as ThreeLine3,
	Matrix4 as ThreeMatrix4,
	Plane as ThreePlane,
	Vector3 as ThreeVector3,
} from "three";
import "../../src/extensions/array.extension.ts";
import { Line3 } from "../../src/maths/Line3.ts";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Matrix4 } from "../../src/maths/Matrix4.ts";
import { Plane } from "../../src/maths/Plane.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";

function comparePlanes(
	ourPlane: Plane,
	threePlane: ThreePlane,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our:   normal=(${ourPlane.normal.x}, ${ourPlane.normal.y}, ${ourPlane.normal.z}), constant=${ourPlane.constant}`,
	);
	console.log(
		`  Three: normal=(${threePlane.normal.x}, ${threePlane.normal.y}, ${threePlane.normal.z}), constant=${threePlane.constant}`,
	);

	assertAlmostEquals(
		ourPlane.normal.x,
		threePlane.normal.x,
		MathUtils.EPSILON,
		`${message} (normal.x)`,
	);
	assertAlmostEquals(
		ourPlane.normal.y,
		threePlane.normal.y,
		MathUtils.EPSILON,
		`${message} (normal.y)`,
	);
	assertAlmostEquals(
		ourPlane.normal.z,
		threePlane.normal.z,
		MathUtils.EPSILON,
		`${message} (normal.z)`,
	);
	assertAlmostEquals(
		ourPlane.constant,
		threePlane.constant,
		MathUtils.EPSILON,
		`${message} (constant)`,
	);
}

Deno.test("Plane: constructor", () => {
	const a = new Plane();
	const threeA = new ThreePlane();
	assertEquals(a.normal.x, 1);
	assertEquals(a.normal.y, 0);
	assertEquals(a.normal.z, 0);
	assertEquals(a.constant, 0);
	comparePlanes(a, threeA, "constructor");

	const normal = new Vector3(0, 1, 0);
	const threeNormal = new ThreeVector3(0, 1, 0);
	const b = new Plane(normal, 5);
	const threeB = new ThreePlane(threeNormal, 5);
	assertEquals(b.normal.x, 0);
	assertEquals(b.normal.y, 1);
	assertEquals(b.normal.z, 0);
	assertEquals(b.constant, 5);
	comparePlanes(b, threeB, "constructor w/ values");
});

Deno.test("Plane: applyMatrix4", () => {
	const a = new Plane(new Vector3(0, 1, 0), 5);
	const threeA = new ThreePlane(new ThreeVector3(0, 1, 0), 5);

	const identityMatrix = new Matrix4();
	const threeIdentityMatrix = new ThreeMatrix4();

	a.applyMatrix4(identityMatrix);
	threeA.applyMatrix4(threeIdentityMatrix);
	comparePlanes(a, threeA, "applyMatrix4 (identity)");

	const b = new Plane(new Vector3(0, 1, 0), 5);
	const threeB = new ThreePlane(new ThreeVector3(0, 1, 0), 5);

	const translationMatrix = new Matrix4().makeTranslation(10, 10, 10);
	const threeTranslationMatrix = new ThreeMatrix4().makeTranslation(10, 10, 10);

	b.applyMatrix4(translationMatrix);
	threeB.applyMatrix4(threeTranslationMatrix);
	comparePlanes(b, threeB, "applyMatrix4 (translation)");

	const c = new Plane(new Vector3(0, 1, 0), 5);
	const threeC = new ThreePlane(new ThreeVector3(0, 1, 0), 5);

	const rotationMatrix = new Matrix4().makeRotationX(MathUtils.HALF_PI);
	const threeRotationMatrix = new ThreeMatrix4().makeRotationX(
		MathUtils.HALF_PI,
	);

	c.applyMatrix4(rotationMatrix);
	threeC.applyMatrix4(threeRotationMatrix);
	comparePlanes(c, threeC, "applyMatrix4 (rotation)");
});

Deno.test("Plane: clone", () => {
	const a = new Plane(new Vector3(0, 1, 0), 5);
	const b = a.clone();
	const threeA = new ThreePlane(new ThreeVector3(0, 1, 0), 5);
	const threeB = threeA.clone();
	comparePlanes(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("Plane: copy", () => {
	const a = new Plane(new Vector3(0, 1, 0), 5);
	const b = new Plane().copy(a);
	const threeA = new ThreePlane(new ThreeVector3(0, 1, 0), 5);
	const threeB = new ThreePlane().copy(threeA);
	comparePlanes(b, threeB, "copy");
	comparePlanes(a, threeA, "copy (original unchanged)");
});

Deno.test("Plane: distanceToPoint", () => {
	const a = new Plane(new Vector3(0, 1, 0), 5);
	const threeA = new ThreePlane(new ThreeVector3(0, 1, 0), 5);

	const points = [
		new Vector3(0, 0, 0),
		new Vector3(0, 5, 0),
		new Vector3(0, 10, 0),
		new Vector3(1, 5, 1),
	];

	const threePoints = [
		new ThreeVector3(0, 0, 0),
		new ThreeVector3(0, 5, 0),
		new ThreeVector3(0, 10, 0),
		new ThreeVector3(1, 5, 1),
	];

	for (let i = 0; i < points.length; i++) {
		const distance = a.distanceToPoint(points.safeAt(i));
		const threeDistance = threeA.distanceToPoint(threePoints.safeAt(i));
		assertAlmostEquals(
			distance,
			threeDistance,
			MathUtils.EPSILON,
			`distanceToPoint case ${i}`,
		);
	}
});

Deno.test("Plane: equals", () => {
	const a = new Plane(new Vector3(0, 1, 0), 5);
	const b = new Plane(new Vector3(0, 1, 0), 5);
	const c = new Plane(new Vector3(1, 0, 0), 5);
	const d = new Plane(new Vector3(0, 1, 0), 6);

	const threeA = new ThreePlane(new ThreeVector3(0, 1, 0), 5);
	const threeB = new ThreePlane(new ThreeVector3(0, 1, 0), 5);
	const threeC = new ThreePlane(new ThreeVector3(1, 0, 0), 5);
	const threeD = new ThreePlane(new ThreeVector3(0, 1, 0), 6);

	assertEquals(a.equals(b), threeA.equals(threeB), "equals (true)");
	assertEquals(
		a.equals(c),
		threeA.equals(threeC),
		"equals (false - different normal)",
	);
	assertEquals(
		a.equals(d),
		threeA.equals(threeD),
		"equals (false - different constant)",
	);
});

Deno.test("Plane: intersectLine", () => {
	const a = new Plane(new Vector3(0, 1, 0), 0);
	const threeA = new ThreePlane(new ThreeVector3(0, 1, 0), 0);

	const line1 = new Line3(
		new Vector3(0, 5, 0),
		new Vector3(0, -5, 0),
	);
	const line2 = new Line3(
		new Vector3(0, 5, 0),
		new Vector3(0, 10, 0),
	);
	const line3 = new Line3(
		new Vector3(0, 0, 0),
		new Vector3(5, 0, 0),
	);
	const threeLine1 = new ThreeLine3(
		new ThreeVector3(0, 5, 0),
		new ThreeVector3(0, -5, 0),
	);
	const threeLine2 = new ThreeLine3(
		new ThreeVector3(0, 5, 0),
		new ThreeVector3(0, 10, 0),
	);
	const threeLine3 = new ThreeLine3(
		new ThreeVector3(0, 0, 0),
		new ThreeVector3(5, 0, 0),
	);

	const target1 = new Vector3();
	const threeTarget1 = new ThreeVector3();
	const result1 = a.intersectLine(line1, target1);
	const threeResult1 = threeA.intersectLine(threeLine1, threeTarget1);

	if (result1 && threeResult1) {
		assertAlmostEquals(
			result1.x,
			threeResult1.x,
			MathUtils.EPSILON,
			"intersectLine (x)",
		);
		assertAlmostEquals(
			result1.y,
			threeResult1.y,
			MathUtils.EPSILON,
			"intersectLine (y)",
		);
		assertAlmostEquals(
			result1.z,
			threeResult1.z,
			MathUtils.EPSILON,
			"intersectLine (z)",
		);
	} else {
		assertEquals(
			!!result1,
			!!threeResult1,
			"intersectLine (both undefined or both not undefined)",
		);
	}

	const target2 = new Vector3();
	const threeTarget2 = new ThreeVector3();
	const result2 = a.intersectLine(line2, target2);
	const threeResult2 = threeA.intersectLine(threeLine2, threeTarget2);
	assertEquals(!!result2, !!threeResult2, "intersectLine (no intersection)");

	const target3 = new Vector3();
	const threeTarget3 = new ThreeVector3();
	const result3 = a.intersectLine(line3, target3);
	const threeResult3 = threeA.intersectLine(threeLine3, threeTarget3);

	if (result3 && threeResult3) {
		assertAlmostEquals(
			result3.x,
			threeResult3.x,
			MathUtils.EPSILON,
			"intersectLine coplanar (x)",
		);
		assertAlmostEquals(
			result3.y,
			threeResult3.y,
			MathUtils.EPSILON,
			"intersectLine coplanar (y)",
		);
		assertAlmostEquals(
			result3.z,
			threeResult3.z,
			MathUtils.EPSILON,
			"intersectLine coplanar (z)",
		);
	} else {
		assertEquals(
			!!result3,
			!!threeResult3,
			"intersectLine coplanar (both undefined or both not undefined)",
		);
	}
});

Deno.test("Plane: projectPoint", () => {
	const a = new Plane(new Vector3(0, 1, 0), 0);
	const threeA = new ThreePlane(new ThreeVector3(0, 1, 0), 0);

	const point = new Vector3(1, 5, 2);
	const threePoint = new ThreeVector3(1, 5, 2);

	const target = new Vector3();
	const threeTarget = new ThreeVector3();

	const result = a.projectPoint(point, target);
	const threeResult = threeA.projectPoint(threePoint, threeTarget);

	assertAlmostEquals(
		result.x,
		threeResult.x,
		MathUtils.EPSILON,
		"projectPoint (x)",
	);
	assertAlmostEquals(
		result.y,
		threeResult.y,
		MathUtils.EPSILON,
		"projectPoint (y)",
	);
	assertAlmostEquals(
		result.z,
		threeResult.z,
		MathUtils.EPSILON,
		"projectPoint (z)",
	);
});

Deno.test("Plane: setComponents", () => {
	const a = new Plane().setComponents(1, 2, 3, 4);
	const threeA = new ThreePlane().setComponents(1, 2, 3, 4);
	comparePlanes(a, threeA, "setComponents");
});

Deno.test("Plane: setFromCoplanarPoints", () => {
	const a = new Plane();
	const threeA = new ThreePlane();

	const p1 = new Vector3(0, 0, 0);
	const p2 = new Vector3(1, 0, 0);
	const p3 = new Vector3(0, 0, 1);
	const threeP1 = new ThreeVector3(0, 0, 0);
	const threeP2 = new ThreeVector3(1, 0, 0);
	const threeP3 = new ThreeVector3(0, 0, 1);

	a.setFromCoplanarPoints(p1, p2, p3);
	threeA.setFromCoplanarPoints(threeP1, threeP2, threeP3);
	comparePlanes(a, threeA, "setFromCoplanarPoints");
});

Deno.test("Plane: setFromNormalAndCoplanarPoint", () => {
	const a = new Plane();
	const threeA = new ThreePlane();

	const normal = new Vector3(0, 1, 0);
	const point = new Vector3(0, 5, 0);
	const threeNormal = new ThreeVector3(0, 1, 0);
	const threePoint = new ThreeVector3(0, 5, 0);

	a.setFromNormalAndCoplanarPoint(normal, point);
	threeA.setFromNormalAndCoplanarPoint(threeNormal, threePoint);
	comparePlanes(a, threeA, "setFromNormalAndCoplanarPoint");
});

Deno.test("Plane: translate", () => {
	const a = new Plane(new Vector3(0, 1, 0), 5);
	const threeA = new ThreePlane(new ThreeVector3(0, 1, 0), 5);

	const offset = new Vector3(10, 10, 10);
	const threeOffset = new ThreeVector3(10, 10, 10);

	a.translate(offset);
	threeA.translate(threeOffset);
	comparePlanes(a, threeA, "translate");
});

Deno.test("Plane: unitize", () => {
	const a = new Plane(new Vector3(0, 2, 0), 10).unitize();
	const threeA = new ThreePlane(new ThreeVector3(0, 2, 0), 10).normalize();
	comparePlanes(a, threeA, "unitize");
	assertEquals(a.normal.length, 1, "unitize results in normal length 1");
});
