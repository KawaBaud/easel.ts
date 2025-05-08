import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Matrix3 as ThreeMatrix3,
	Matrix4 as ThreeMatrix4,
	Quaternion as ThreeQuaternion,
	Vector3 as ThreeVector3,
} from "three";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Matrix3 } from "../../src/maths/Matrix3.ts";
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

Deno.test("Vector3: add", () => {
	const a = new Vector3(1, 2, 3);
	const b = new Vector3(4, 5, 6);
	const threeA = new ThreeVector3(1, 2, 3);
	const threeB = new ThreeVector3(4, 5, 6);
	a.add(b);
	threeA.add(threeB);
	compareVectors(a, threeA, "add");
});

Deno.test("Vector3: applyMatrix3", () => {
	const v = new Vector3(1, 2, 3);
	const vThree = new ThreeVector3(1, 2, 3);

	const m = new Matrix3();
	const threeM = new ThreeMatrix3();
	v.applyMatrix3(m);
	vThree.applyMatrix3(threeM);
	compareVectors(v, vThree, "applyMatrix3 (identity)");

	const v1 = new Vector3(1, 0, 0);
	const v2 = new Vector3(0, 1, 0);
	const v3 = new Vector3(0, 0, 1);
	const threeV1 = new ThreeVector3(1, 0, 0);
	const threeV2 = new ThreeVector3(0, 1, 0);
	const threeV3 = new ThreeVector3(0, 0, 1);

	const angle = MathUtils.HALF_PI;

	const mX = new Matrix3().makeRotation(angle);
	const mY = new Matrix3().makeRotation(angle);
	const mZ = new Matrix3().makeRotation(angle);
	const threeMX = new ThreeMatrix3().makeRotation(angle);
	const threeMY = new ThreeMatrix3().makeRotation(angle);
	const threeMZ = new ThreeMatrix3().makeRotation(angle);
	v1.applyMatrix3(mX);
	v2.applyMatrix3(mY);
	v3.applyMatrix3(mZ);
	threeV1.applyMatrix3(threeMX);
	threeV2.applyMatrix3(threeMY);
	threeV3.applyMatrix3(threeMZ);
	compareVectors(v1, threeV1, "applyMatrix3 (rotation X)");
	compareVectors(v2, threeV2, "applyMatrix3 (rotation Y)");
	compareVectors(v3, threeV3, "applyMatrix3 (rotation Z)");

	const vScale = new Vector3(1, 2, 3);
	const threeVScale = new ThreeVector3(1, 2, 3);
	const mScale = new Matrix3().makeScale(2, 3);
	const threeMScale = new ThreeMatrix3().makeScale(2, 3);
	vScale.applyMatrix3(mScale);
	threeVScale.applyMatrix3(threeMScale);
	compareVectors(vScale, threeVScale, "applyMatrix3 (scale)");
});

Deno.test("Vector3: applyMatrix4", () => {
	const v = new Vector3(1, 2, 3);
	const vThree = new ThreeVector3(1, 2, 3);

	const m = new Matrix4();
	const threeM = new ThreeMatrix4();
	v.applyMatrix4(m);
	vThree.applyMatrix4(threeM);
	compareVectors(v, vThree, "applyMatrix4 (identity)");

	const vTrans = new Vector3(1, 2, 3);
	const threeVTrans = new ThreeVector3(1, 2, 3);
	const mTrans = new Matrix4().makeTranslation(5, 6, 7);
	const threeMTrans = new ThreeMatrix4().makeTranslation(5, 6, 7);
	vTrans.applyMatrix4(mTrans);
	threeVTrans.applyMatrix4(threeMTrans);
	compareVectors(vTrans, threeVTrans, "applyMatrix4 (translation)");

	const v1 = new Vector3(1, 0, 0);
	const v2 = new Vector3(0, 1, 0);
	const v3 = new Vector3(0, 0, 1);
	const threeV1 = new ThreeVector3(1, 0, 0);
	const threeV2 = new ThreeVector3(0, 1, 0);
	const threeV3 = new ThreeVector3(0, 0, 1);

	const angle = MathUtils.HALF_PI;

	const mX = new Matrix4().makeRotationX(angle);
	const mY = new Matrix4().makeRotationY(angle);
	const mZ = new Matrix4().makeRotationZ(angle);
	const threeMX = new ThreeMatrix4().makeRotationX(angle);
	const threeMY = new ThreeMatrix4().makeRotationY(angle);
	const threeMZ = new ThreeMatrix4().makeRotationZ(angle);
	v1.applyMatrix4(mX);
	v2.applyMatrix4(mY);
	v3.applyMatrix4(mZ);
	threeV1.applyMatrix4(threeMX);
	threeV2.applyMatrix4(threeMY);
	threeV3.applyMatrix4(threeMZ);
	compareVectors(v1, threeV1, "applyMatrix4 (rotation X)");
	compareVectors(v2, threeV2, "applyMatrix4 (rotation Y)");
	compareVectors(v3, threeV3, "applyMatrix4 (rotation Z)");

	const vScale = new Vector3(1, 2, 3);
	const threeVScale = new ThreeVector3(1, 2, 3);
	const mScale = new Matrix4().makeScale(2, 3, 4);
	const threeMScale = new ThreeMatrix4().makeScale(2, 3, 4);
	vScale.applyMatrix4(mScale);
	threeVScale.applyMatrix4(threeMScale);
	compareVectors(vScale, threeVScale, "applyMatrix4 (scale)");
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
	const a = new Vector3(0, 1, 0);
	const b = new Vector3(1, 0, 0).cross(a);
	const threeA = new ThreeVector3(0, 1, 0);
	const threeB = new ThreeVector3(1, 0, 0).cross(threeA);
	compareVectors(b, threeB, "cross (x cross y)");

	const c = new Vector3(5, 6, 7);
	const d = new Vector3(2, 3, 4).cross(c);
	const threeC = new ThreeVector3(5, 6, 7);
	const threeD = new ThreeVector3(2, 3, 4).cross(threeC);
	compareVectors(d, threeD, "cross");
});

Deno.test("Vector3: crossVectors", () => {
	const a = new Vector3(1, 0, 0);
	const b = new Vector3(0, 1, 0);
	const c = new Vector3().crossVectors(a, b);
	const threeA = new ThreeVector3(1, 0, 0);
	const threeB = new ThreeVector3(0, 1, 0);
	const threeC = new ThreeVector3().crossVectors(threeA, threeB);
	compareVectors(c, threeC, "crossVectors (x cross y)");

	const d = new Vector3(2, 3, 4);
	const e = new Vector3(5, 6, 7);
	const f = new Vector3().crossVectors(d, e);
	const threeD = new ThreeVector3(2, 3, 4);
	const threeE = new ThreeVector3(5, 6, 7);
	const threeF = new ThreeVector3().crossVectors(threeD, threeE);
	compareVectors(f, threeF, "crossVectors");
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

Deno.test("Vector3: distanceTo", () => {
	const a = new Vector3(1, 2, 3);
	const b = new Vector3(4, 5, 6);
	const result = a.distanceTo(b);
	const threeA = new ThreeVector3(1, 2, 3);
	const threeB = new ThreeVector3(4, 5, 6);
	const threeResult = threeA.distanceTo(threeB);
	assertEquals(result, threeResult, "distanceTo");
});

Deno.test("Vector3: distanceSqTo", () => {
	const a = new Vector3(1, 2, 3);
	const b = new Vector3(4, 5, 6);
	const result = a.distanceSqTo(b);
	const threeA = new ThreeVector3(1, 2, 3);
	const threeB = new ThreeVector3(4, 5, 6);
	const threeResult = threeA.distanceToSquared(threeB);
	assertEquals(result, threeResult, "distanceToSq");
});

Deno.test("Vector3: dot", () => {
	const a = new Vector3(1, 2, 3);
	const b = new Vector3(4, 5, 6);
	const result = a.dot(b);
	const threeA = new ThreeVector3(1, 2, 3);
	const threeB = new ThreeVector3(4, 5, 6);
	const threeResult = threeA.dot(threeB);
	assertEquals(result, threeResult, "dot");
});

Deno.test("Vector3: equals", () => {
	const a = new Vector3(1, 2, 3);
	const b = new Vector3(1, 2, 3);
	const c = new Vector3(1, 2, 4);
	const threeA = new ThreeVector3(1, 2, 3);
	const threeB = new ThreeVector3(1, 2, 3);
	const threeC = new ThreeVector3(1, 2, 4);
	assertEquals(a.equals(b), threeA.equals(threeB), "equals (true)");
	assertEquals(a.equals(c), threeA.equals(threeC), "equals (false)");
});

Deno.test("Vector3: fromArray", () => {
	const a = new Vector3().fromArray([1, 2, 3]);
	const threeA = new ThreeVector3().fromArray([1, 2, 3]);
	compareVectors(a, threeA, "fromArray");
});

Deno.test("Vector3: lerp", () => {
	const t = 0.5;

	const a = new Vector3(1, 2, 3);
	const b = new Vector3(4, 5, 6);
	const threeA = new ThreeVector3(1, 2, 3);
	const threeB = new ThreeVector3(4, 5, 6);

	const result = a.lerp(b, t);
	const threeResult = threeA.lerp(threeB, t);
	compareVectors(result, threeResult, "lerp");
});

Deno.test("Vector3: mulScalar", () => {
	const scalar = 3;

	const a = new Vector3(1, 2, 3).mulScalar(scalar);
	const threeA = new ThreeVector3(1, 2, 3).multiplyScalar(scalar);
	compareVectors(a, threeA, "mulScalar");
});

Deno.test("Vector3: negate", () => {
	const a = new Vector3(1, 2, 3).negate();
	const threeA = new ThreeVector3(1, 2, 3).negate();
	compareVectors(a, threeA, "negate");
});

Deno.test("Vector3: set", () => {
	const a = new Vector3().set(4, 5, 6);
	const threeA = new ThreeVector3().set(4, 5, 6);
	compareVectors(a, threeA, "set(x, y, z)");
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
