import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Line3 as ThreeLine3,
	Matrix4 as ThreeMatrix4,
	Vector3 as ThreeVector3,
} from "three";
import "../../extensions/array.extension.ts";
import { Line3 } from "../../src/maths/Line3.ts";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Matrix4 } from "../../src/maths/Matrix4.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";

function compareLines(
	ourLine: Line3,
	threeLine: ThreeLine3,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our:   start(${ourLine.start.x}, ${ourLine.start.y}, ${ourLine.start.z}), end(${ourLine.end.x}, ${ourLine.end.y}, ${ourLine.end.z})`,
	);
	console.log(
		`  Three: start(${threeLine.start.x}, ${threeLine.start.y}, ${threeLine.start.z}), end(${threeLine.end.x}, ${threeLine.end.y}, ${threeLine.end.z})`,
	);

	assertAlmostEquals(
		ourLine.start.x,
		threeLine.start.x,
		MathUtils.EPSILON,
		`${message} (start.x)`,
	);
	assertAlmostEquals(
		ourLine.start.y,
		threeLine.start.y,
		MathUtils.EPSILON,
		`${message} (start.y)`,
	);
	assertAlmostEquals(
		ourLine.start.z,
		threeLine.start.z,
		MathUtils.EPSILON,
		`${message} (start.z)`,
	);
	assertAlmostEquals(
		ourLine.end.x,
		threeLine.end.x,
		MathUtils.EPSILON,
		`${message} (end.x)`,
	);
	assertAlmostEquals(
		ourLine.end.y,
		threeLine.end.y,
		MathUtils.EPSILON,
		`${message} (end.y)`,
	);
	assertAlmostEquals(
		ourLine.end.z,
		threeLine.end.z,
		MathUtils.EPSILON,
		`${message} (end.z)`,
	);
}

Deno.test("Line3: constructor", () => {
	const a = new Line3();
	const threeA = new ThreeLine3();
	assertEquals(a.start.x, 0);
	assertEquals(a.start.y, 0);
	assertEquals(a.start.z, 0);
	assertEquals(a.end.x, 0);
	assertEquals(a.end.y, 0);
	assertEquals(a.end.z, 0);
	compareLines(a, threeA, "constructor");

	const start = new Vector3(1, 2, 3);
	const end = new Vector3(4, 5, 6);
	const b = new Line3(start, end);
	const threeB = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	compareLines(b, threeB, "constructor w/ values");
});

Deno.test("Line3: get->delta", () => {
	const a = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	const delta = a.delta;
	const threeDelta = new ThreeVector3();
	threeA.delta(threeDelta);

	assertAlmostEquals(delta.x, threeDelta.x, MathUtils.EPSILON, "delta.x");
	assertAlmostEquals(delta.y, threeDelta.y, MathUtils.EPSILON, "delta.y");
	assertAlmostEquals(delta.z, threeDelta.z, MathUtils.EPSILON, "delta.z");
});

Deno.test("Line3: get->length", () => {
	const a = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	assertAlmostEquals(a.length, threeA.distance(), MathUtils.EPSILON, "length");
});

Deno.test("Line3: get->lengthSq", () => {
	const a = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	assertAlmostEquals(
		a.lengthSq,
		threeA.distanceSq(),
		MathUtils.EPSILON,
		"lengthSq",
	);
});

Deno.test("Line3: applyMatrix4", () => {
	const a = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const m = new Matrix4().makeTranslation(2, 3, 4);
	const threeM = new ThreeMatrix4().makeTranslation(2, 3, 4);

	a.applyMatrix4(m);
	threeA.applyMatrix4(threeM);
	compareLines(a, threeA, "applyMatrix4 (translation)");

	const b = new Line3(
		new Vector3(1, 0, 0),
		new Vector3(0, 1, 0),
	);
	const threeB = new ThreeLine3(
		new ThreeVector3(1, 0, 0),
		new ThreeVector3(0, 1, 0),
	);

	const rotM = new Matrix4().makeRotationZ(MathUtils.HALF_PI);
	const threeRotM = new ThreeMatrix4().makeRotationZ(MathUtils.HALF_PI);

	b.applyMatrix4(rotM);
	threeB.applyMatrix4(threeRotM);
	compareLines(b, threeB, "applyMatrix4 (rotation)");
});

Deno.test("Line3: at", () => {
	const a = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const threeA = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);

	const target = new Vector3();
	const threeTarget = new ThreeVector3();

	a.at(0, target);
	threeA.at(0, threeTarget);
	assertAlmostEquals(target.x, threeTarget.x, MathUtils.EPSILON, "at(0).x");
	assertAlmostEquals(target.y, threeTarget.y, MathUtils.EPSILON, "at(0).y");
	assertAlmostEquals(target.z, threeTarget.z, MathUtils.EPSILON, "at(0).z");

	a.at(0.5, target);
	threeA.at(0.5, threeTarget);
	assertAlmostEquals(target.x, threeTarget.x, MathUtils.EPSILON, "at(0.5).x");
	assertAlmostEquals(target.y, threeTarget.y, MathUtils.EPSILON, "at(0.5).y");
	assertAlmostEquals(target.z, threeTarget.z, MathUtils.EPSILON, "at(0.5).z");

	a.at(1, target);
	threeA.at(1, threeTarget);
	assertAlmostEquals(target.x, threeTarget.x, MathUtils.EPSILON, "at(1).x");
	assertAlmostEquals(target.y, threeTarget.y, MathUtils.EPSILON, "at(1).y");
	assertAlmostEquals(target.z, threeTarget.z, MathUtils.EPSILON, "at(1).z");
});

Deno.test("Line3: clone", () => {
	const a = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const b = a.clone();
	const threeA = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	const threeB = threeA.clone();
	compareLines(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("Line3: closestPointToPointParameter", () => {
	const a = new Line3(
		new Vector3(0, 0, 0),
		new Vector3(1, 0, 0),
	);
	const threeA = new ThreeLine3(
		new ThreeVector3(0, 0, 0),
		new ThreeVector3(1, 0, 0),
	);

	const point1 = new Vector3(0.5, 0, 0);
	const threePoint1 = new ThreeVector3(0.5, 0, 0);
	const t1 = a.closestPointToPointParameter(point1, true);
	const threeT1 = threeA.closestPointToPointParameter(threePoint1, true);
	assertAlmostEquals(
		t1,
		threeT1,
		MathUtils.EPSILON,
		"closestPointToPointParameter (on line)",
	);

	const point2 = new Vector3(0.5, 1, 0);
	const threePoint2 = new ThreeVector3(0.5, 1, 0);
	const t2 = a.closestPointToPointParameter(point2, true);
	const threeT2 = threeA.closestPointToPointParameter(threePoint2, true);
	assertAlmostEquals(
		t2,
		threeT2,
		MathUtils.EPSILON,
		"closestPointToPointParameter (off line)",
	);

	const point3 = new Vector3(2, 0, 0);
	const threePoint3 = new ThreeVector3(2, 0, 0);
	const t3 = a.closestPointToPointParameter(point3, true);
	const threeT3 = threeA.closestPointToPointParameter(threePoint3, true);
	assertAlmostEquals(
		t3,
		threeT3,
		MathUtils.EPSILON,
		"closestPointToPointParameter (beyond line, clamped)",
	);

	const t4 = a.closestPointToPointParameter(point3, false);
	const threeT4 = threeA.closestPointToPointParameter(threePoint3, false);
	assertAlmostEquals(
		t4,
		threeT4,
		MathUtils.EPSILON,
		"closestPointToPointParameter (beyond line, unclamped)",
	);
});

Deno.test("Line3: closestPointToPoint", () => {
	const a = new Line3(
		new Vector3(0, 0, 0),
		new Vector3(1, 0, 0),
	);
	const threeA = new ThreeLine3(
		new ThreeVector3(0, 0, 0),
		new ThreeVector3(1, 0, 0),
	);

	const target = new Vector3();
	const threeTarget = new ThreeVector3();

	const point1 = new Vector3(0.5, 0, 0);
	const threePoint1 = new ThreeVector3(0.5, 0, 0);
	a.closestPointToPoint(point1, true, target);
	threeA.closestPointToPoint(threePoint1, true, threeTarget);
	assertAlmostEquals(
		target.x,
		threeTarget.x,
		MathUtils.EPSILON,
		"closestPointToPoint (on line).x",
	);
	assertAlmostEquals(
		target.y,
		threeTarget.y,
		MathUtils.EPSILON,
		"closestPointToPoint (on line).y",
	);
	assertAlmostEquals(
		target.z,
		threeTarget.z,
		MathUtils.EPSILON,
		"closestPointToPoint (on line).z",
	);

	const point2 = new Vector3(0.5, 1, 0);
	const threePoint2 = new ThreeVector3(0.5, 1, 0);
	a.closestPointToPoint(point2, true, target);
	threeA.closestPointToPoint(threePoint2, true, threeTarget);
	assertAlmostEquals(
		target.x,
		threeTarget.x,
		MathUtils.EPSILON,
		"closestPointToPoint (off line).x",
	);
	assertAlmostEquals(
		target.y,
		threeTarget.y,
		MathUtils.EPSILON,
		"closestPointToPoint (off line).y",
	);
	assertAlmostEquals(
		target.z,
		threeTarget.z,
		MathUtils.EPSILON,
		"closestPointToPoint (off line).z",
	);
});

Deno.test("Line3: copy", () => {
	const a = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const b = new Line3().copy(a);
	const threeA = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	const threeB = new ThreeLine3().copy(threeA);
	compareLines(b, threeB, "copy");
	compareLines(a, threeA, "copy (original unchanged)");
});

Deno.test("Line3: equals", () => {
	const a = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const b = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
	);
	const c = new Line3(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 7),
	);

	const threeA = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	const threeB = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
	);
	const threeC = new ThreeLine3(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 7),
	);

	assertEquals(a.equals(b), threeA.equals(threeB), "equals (true)");
	assertEquals(a.equals(c), threeA.equals(threeC), "equals (false)");
});

Deno.test("Line3: getCenter", () => {
	const a = new Line3(
		new Vector3(0, 0, 0),
		new Vector3(2, 4, 6),
	);
	const threeA = new ThreeLine3(
		new ThreeVector3(0, 0, 0),
		new ThreeVector3(2, 4, 6),
	);

	const target = new Vector3();
	const threeTarget = new ThreeVector3();

	a.getCenter(target);
	threeA.getCenter(threeTarget);

	assertAlmostEquals(target.x, threeTarget.x, MathUtils.EPSILON, "getCenter.x");
	assertAlmostEquals(target.y, threeTarget.y, MathUtils.EPSILON, "getCenter.y");
	assertAlmostEquals(target.z, threeTarget.z, MathUtils.EPSILON, "getCenter.z");
});

Deno.test("Line3: set", () => {
	const a = new Line3();
	const threeA = new ThreeLine3();
	a.set(new Vector3(1, 2, 3), new Vector3(4, 5, 6));
	threeA.set(new ThreeVector3(1, 2, 3), new ThreeVector3(4, 5, 6));
	compareLines(a, threeA, "set");
});
