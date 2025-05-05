import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Matrix4 as ThreeMatrix4,
	Quaternion as ThreeQuaternion,
	Vector3 as ThreeVector3,
} from "three";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Matrix4 } from "../../src/maths/Matrix4.ts";
import { Quaternion } from "../../src/maths/Quaternion.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";

function compareVectors(
	ourVec: Vector3,
	threeVec: ThreeVector3,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(`  Our:   (${ourVec.x}, ${ourVec.y})`);
	console.log(`  Three: (${threeVec.x}, ${threeVec.y})`);

	assertAlmostEquals(
		ourVec.x,
		threeVec.x,
		MathUtils.EPSILON,
		`${message} (x)`,
	);
	assertAlmostEquals(
		ourVec.y,
		threeVec.y,
		MathUtils.EPSILON,
		`${message} (y)`,
	);
	assertAlmostEquals(
		ourVec.z,
		threeVec.z,
		MathUtils.EPSILON,
		`${message} (z)`,
	);
}

Deno.test("Vector3: constructor", () => {
	const a = new Vector3();
	const threeA = new ThreeVector3();
	assertEquals(a.x, 0);
	assertEquals(a.y, 0);
	assertEquals(a.z, 0);
	compareVectors(a, threeA, "constructor");

	const b = new Vector3(1, 2, 3);
	const threeB = new ThreeVector3(1, 2, 3);
	assertEquals(b.x, 1);
	assertEquals(b.y, 2);
	assertEquals(b.z, 3);
	compareVectors(b, threeB, "constructor w/ values");
});

Deno.test("Vector3: get->length", () => {
	const a = new Vector3(3, 4, 0);
	const threeA = new ThreeVector3(3, 4, 0);
	assertEquals(a.length, 5);
	assertAlmostEquals(a.length, threeA.length(), MathUtils.EPSILON, "length");

	const b = new Vector3(0, 0, 0);
	const threeB = new ThreeVector3(0, 0, 0);
	assertEquals(b.length, 0);
	assertAlmostEquals(
		b.length,
		threeB.length(),
		MathUtils.EPSILON,
		"length zero vector",
	);
});

Deno.test("Vector3: get->lengthSq", () => {
	const a = new Vector3(3, 4, 0);
	const threeA = new ThreeVector3(3, 4, 0);
	assertEquals(a.lengthSq, 25);
	assertAlmostEquals(
		a.lengthSq,
		threeA.lengthSq(),
		MathUtils.EPSILON,
		"lengthSq",
	);

	const b = new Vector3(1, 2, 3);
	const threeB = new ThreeVector3(1, 2, 3);
	assertEquals(b.lengthSq, 1 * 1 + 2 * 2 + 3 * 3);
	assertAlmostEquals(
		b.lengthSq,
		threeB.lengthSq(),
		MathUtils.EPSILON,
		"lengthSq non-zero z",
	);
});

Deno.test("Vector3: clone", () => {
	const a = new Vector3(1, 2, 3);
	const b = a.clone();
	const threeA = new ThreeVector3(1, 2, 3);
	const threeB = threeA.clone();
	compareVectors(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("Vector3: copy", () => {
	const a = new Vector3(1, 2, 3);
	const b = new Vector3().copy(a);
	const threeA = new ThreeVector3(1, 2, 3);
	const threeB = new ThreeVector3().copy(threeA);
	compareVectors(b, threeB, "copy");
	compareVectors(a, threeA, "copy (original unchanged)");
});

Deno.test("Vector3: cross", () => {
	const a = new Vector3(1, 0, 0);
	const b = new Vector3(0, 1, 0);
	const threeA = new ThreeVector3(1, 0, 0);
	const threeB = new ThreeVector3(0, 1, 0);

	a.cross(b);
	threeA.cross(threeB);
	compareVectors(a, threeA, "cross (x cross y)");

	const c = new Vector3(2, 3, 4);
	const d = new Vector3(5, 6, 7);
	const threeC = new ThreeVector3(2, 3, 4);
	const threeD = new ThreeVector3(5, 6, 7);
	c.cross(d);
	threeC.cross(threeD);
	compareVectors(c, threeC, "cross");
});

Deno.test("Vector3: crossVectors", () => {
	const a = new Vector3(1, 0, 0);
	const b = new Vector3(0, 1, 0);
	const c = new Vector3();
	const threeA = new ThreeVector3(1, 0, 0);
	const threeB = new ThreeVector3(0, 1, 0);
	const threeC = new ThreeVector3();

	c.crossVectors(a, b);
	threeC.crossVectors(threeA, threeB);
	compareVectors(c, threeC, "crossVectors (x cross y)");

	const d = new Vector3(2, 3, 4);
	const e = new Vector3(5, 6, 7);
	const f = new Vector3();
	const threeD = new ThreeVector3(2, 3, 4);
	const threeE = new ThreeVector3(5, 6, 7);
	const threeF = new ThreeVector3();

	f.crossVectors(d, e);
	threeF.crossVectors(threeD, threeE);
	compareVectors(f, threeF, "crossVectors");
});

Deno.test("Vector3: add", () => {
	const a = new Vector3(1, 2, 3);
	const b = new Vector3(4, 5, 6);
	const threeA = new ThreeVector3(1, 2, 3);
	const threeB = new ThreeVector3(4, 5, 6);

	a.add(b);
	threeA.add(threeB);
	compareVectors(a, threeA, "add");
});

Deno.test("Vector3: applyMatrix4", () => {
	const v = new Vector3(1, 2, 3);
	const vThree = new ThreeVector3(1, 2, 3);

	const m = new Matrix4();
	const mThree = new ThreeMatrix4();
	v.applyMatrix4(m);
	vThree.applyMatrix4(mThree);
	compareVectors(v, vThree, "applyMatrix4 (identity)");

	const tv = new Vector3(1, 2, 3);
	const tvThree = new ThreeVector3(1, 2, 3);
	const tm = new Matrix4().makeTranslation(5, 6, 7);
	const tmThree = new ThreeMatrix4().makeTranslation(5, 6, 7);
	tv.applyMatrix4(tm);
	tvThree.applyMatrix4(tmThree);
	compareVectors(tv, tvThree, "applyMatrix4 (translation)");

	const rx = new Vector3(1, 0, 0);
	const ry = new Vector3(0, 1, 0);
	const rz = new Vector3(0, 0, 1);
	const rxThree = new ThreeVector3(1, 0, 0);
	const ryThree = new ThreeVector3(0, 1, 0);
	const rzThree = new ThreeVector3(0, 0, 1);

	const angle = MathUtils.HALF_PI;

	const mrx = new Matrix4().makeRotationX(angle);
	const mry = new Matrix4().makeRotationY(angle);
	const mrz = new Matrix4().makeRotationZ(angle);
	const mrxThree = new ThreeMatrix4().makeRotationX(angle);
	const mryThree = new ThreeMatrix4().makeRotationY(angle);
	const mrzThree = new ThreeMatrix4().makeRotationZ(angle);
	rx.applyMatrix4(mrx);
	ry.applyMatrix4(mry);
	rz.applyMatrix4(mrz);
	rxThree.applyMatrix4(mrxThree);
	ryThree.applyMatrix4(mryThree);
	rzThree.applyMatrix4(mrzThree);
	compareVectors(rx, rxThree, "applyMatrix4 (rotation X)");
	compareVectors(ry, ryThree, "applyMatrix4 (rotation Y)");
	compareVectors(rz, rzThree, "applyMatrix4 (rotation Z)");

	const sv = new Vector3(1, 2, 3);
	const svThree = new ThreeVector3(1, 2, 3);
	const ms = new Matrix4().makeScale(2, 3, 4);
	const msThree = new ThreeMatrix4().makeScale(2, 3, 4);
	sv.applyMatrix4(ms);
	svThree.applyMatrix4(msThree);
	compareVectors(sv, svThree, "applyMatrix4 (scale)");
});

Deno.test("Vector3: applyQuaternion", () => {
	const v = new Vector3(1, 0, 0);
	const threeV = new ThreeVector3(1, 0, 0);

	const axis = new Vector3(0, 0, 1);
	const angle = MathUtils.HALF_PI;

	const q = new Quaternion().setFromAxisAngle(axis, angle);
	const threeQ = new ThreeQuaternion().setFromAxisAngle(
		new ThreeVector3(0, 0, 1),
		angle,
	);

	v.applyQuaternion(q);
	threeV.applyQuaternion(threeQ);
	compareVectors(
		v,
		threeV,
		"applyQuaternion (rotate (1,0,0) around Z by PI/2)",
	);
});

Deno.test("Vector3: divScalar", () => {
	const scalar = 3;

	const a = new Vector3(3, 6, 9).divScalar(scalar);
	const threeA = new ThreeVector3(3, 6, 9).divideScalar(scalar);
	compareVectors(a, threeA, "divScalar");

	const b = new Vector3(1, 1, 1).divScalar(0);
	const threeB = new ThreeVector3(1, 1, 1).divideScalar(0);
	assertEquals(b.x, Infinity, "divScalar by zero (x)");
	assertEquals(b.y, Infinity, "divScalar by zero (y)");
	assertEquals(b.z, Infinity, "divScalar by zero (z)");
	compareVectors(b, threeB, "divScalar by zero");
});

Deno.test("Vector3: mulScalar", () => {
	const scalar = 3;

	const a = new Vector3(1, 2, 3).mulScalar(scalar);
	const threeA = new ThreeVector3(1, 2, 3).multiplyScalar(scalar);
	compareVectors(a, threeA, "mulScalar");
});

Deno.test("Vector3: set", () => {
	const a = new Vector3().set(4, 5, 6);
	const threeA = new ThreeVector3().set(4, 5, 6);
	compareVectors(a, threeA, "set(x, y, z)");

	a.set(7, 8);
	assertEquals(a.x, 7, "set(x, y) - x");
	assertEquals(a.y, 8, "set(x, y) - y");
	assertEquals(a.z, 6, "set(x, y) - z (should be unchanged)");
});

Deno.test("Vector3: sub", () => {
	const b = new Vector3(1, 2, 3);
	const a = new Vector3(10, 8, 6).sub(b);
	const threeB = new ThreeVector3(1, 2, 3);
	const threeA = new ThreeVector3(10, 8, 6).sub(threeB);
	compareVectors(a, threeA, "sub");
});

Deno.test("Vector3: subVectors", () => {
	const a = new Vector3(10, 8, 6);
	const b = new Vector3(1, 2, 3);
	const c = new Vector3().subVectors(a, b);
	const threeA = new ThreeVector3(10, 8, 6);
	const threeB = new ThreeVector3(1, 2, 3);
	const threeC = new ThreeVector3().subVectors(threeA, threeB);
	compareVectors(c, threeC, "subVectors");
});

Deno.test("Vector3: unitize", () => {
	const a = new Vector3(3, 4, 0).unitize();
	const threeA = new ThreeVector3(3, 4, 0).normalize();
	compareVectors(a, threeA, "unitize");
	assertAlmostEquals(
		a.length,
		1.0,
		MathUtils.EPSILON,
		"unitize results in length 1",
	);

	const b = new Vector3(0, 0, 0).unitize();
	const threeB = new ThreeVector3(0, 0, 0).normalize();
	compareVectors(b, threeB, "unitize zero vector");
});
