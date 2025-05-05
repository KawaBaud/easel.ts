import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Euler as ThreeEuler,
	Matrix4 as ThreeMatrix4,
	Quaternion as ThreeQuaternion,
	Vector3 as ThreeVector3,
} from "three";
import { Euler } from "../../src/maths/Euler.ts";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Matrix4 } from "../../src/maths/Matrix4.ts";
import { Quaternion } from "../../src/maths/Quaternion.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";

function compareQuaternions(
	ourQuat: Quaternion,
	threeQuat: ThreeQuaternion,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our:   (${ourQuat.x}, ${ourQuat.y}, ${ourQuat.z}, ${ourQuat.w})`,
	);
	console.log(
		`  Three: (${threeQuat.x}, ${threeQuat.y}, ${threeQuat.z}, ${threeQuat.w})`,
	);

	assertAlmostEquals(
		ourQuat.x,
		threeQuat.x,
		MathUtils.EPSILON,
		`${message} (x)`,
	);
	assertAlmostEquals(
		ourQuat.y,
		threeQuat.y,
		MathUtils.EPSILON,
		`${message} (y)`,
	);
	assertAlmostEquals(
		ourQuat.z,
		threeQuat.z,
		MathUtils.EPSILON,
		`${message} (z)`,
	);
	assertAlmostEquals(
		ourQuat.w,
		threeQuat.w,
		MathUtils.EPSILON,
		`${message} (w)`,
	);
}

Deno.test("Quaternion: constructor", () => {
	const a = new Quaternion();
	const threeA = new ThreeQuaternion();
	assertEquals(a.x, 0);
	assertEquals(a.y, 0);
	assertEquals(a.z, 0);
	assertEquals(a.w, 1);
	compareQuaternions(a, threeA, "constructor");

	const b = new Quaternion(1, 2, 3, 4);
	const threeB = new ThreeQuaternion(1, 2, 3, 4);
	assertEquals(b.x, 1);
	assertEquals(b.y, 2);
	assertEquals(b.z, 3);
	assertEquals(b.w, 4);
	compareQuaternions(b, threeB, "constructor w/ values");
});

Deno.test("Quaternion: get->length", () => {
	const a = new Quaternion(1, 2, 3, 4);
	const threeA = new ThreeQuaternion(1, 2, 3, 4);
	assertEquals(a.length, Math.sqrt(30));
	assertAlmostEquals(a.length, threeA.length(), MathUtils.EPSILON, "length");
});

Deno.test("Quaternion: get->lengthSq", () => {
	const a = new Quaternion(1, 2, 3, 4);
	const threeA = new ThreeQuaternion(1, 2, 3, 4);
	assertEquals(a.lengthSq, 30);
	assertAlmostEquals(
		a.lengthSq,
		threeA.lengthSq(),
		MathUtils.EPSILON,
		"lengthSq",
	);
});

Deno.test("Quaternion: clone", () => {
	const a = new Quaternion(1, 2, 3, 4);
	const b = a.clone();
	const threeA = new ThreeQuaternion(1, 2, 3, 4);
	const threeB = threeA.clone();
	compareQuaternions(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("Quaternion: copy", () => {
	const a = new Quaternion(1, 2, 3, 4);
	const b = new Quaternion().copy(a);
	const threeA = new ThreeQuaternion(1, 2, 3, 4);
	const threeB = new ThreeQuaternion().copy(threeA);
	compareQuaternions(b, threeB, "copy");
	compareQuaternions(a, threeA, "copy (original unchanged)");
});

Deno.test("Quaternion: fromArray", () => {
	const a = new Quaternion().fromArray([1, 2, 3, 4]);
	const threeA = new ThreeQuaternion().fromArray([1, 2, 3, 4]);
	compareQuaternions(a, threeA, "fromArray");
});

Deno.test("Quaternion: invert", () => {
	const a = new Quaternion(1, 2, 3, 4).invert();
	const threeA = new ThreeQuaternion(1, 2, 3, 4).invert();
	compareQuaternions(a, threeA, "invert");
});

Deno.test("Quaternion: set", () => {
	const a = new Quaternion().set(4, 5, 6, 7);
	const threeA = new ThreeQuaternion().set(4, 5, 6, 7);
	compareQuaternions(a, threeA, "set(x, y, z, w)");
});

Deno.test("Quaternion: setFromEuler", () => {
	const eulerXYZ = new Euler(
		MathUtils.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"XYZ",
	);
	const threeEulerXYZ = new ThreeEuler(
		MathUtils.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"XYZ",
	);
	const a = new Quaternion().setFromEuler(eulerXYZ);
	const threeA = new ThreeQuaternion().setFromEuler(threeEulerXYZ);
	compareQuaternions(a, threeA, "setFromEuler (XYZ)");

	const eulerYXZ = new Euler(
		MathUtils.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"YXZ",
	);
	const threeEulerYXZ = new ThreeEuler(
		MathUtils.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"YXZ",
	);
	const b = new Quaternion().setFromEuler(eulerYXZ);
	const threeB = new ThreeQuaternion().setFromEuler(threeEulerYXZ);
	compareQuaternions(b, threeB, "setFromEuler (YXZ)");
	compareQuaternions(b, threeB, "setFromEuler (YXZ)");

	const eulerZXY = new Euler(
		MathUtils.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"ZXY",
	);
	const threeEulerZXY = new ThreeEuler(
		MathUtils.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"ZXY",
	);
	const c = new Quaternion().setFromEuler(eulerZXY);
	const threeC = new ThreeQuaternion().setFromEuler(threeEulerZXY);
	compareQuaternions(c, threeC, "setFromEuler (ZXY)");
});

Deno.test("Quaternion: setFromRotationMatrix", () => {
	const m = new Matrix4().lookAt(
		new Vector3(1, 2, 3),
		new Vector3(4, 5, 6),
		new Vector3(0, 1, 0),
	);
	const threeM = new ThreeMatrix4().lookAt(
		new ThreeVector3(1, 2, 3),
		new ThreeVector3(4, 5, 6),
		new ThreeVector3(0, 1, 0),
	);

	const a = new Quaternion().setFromRotationMatrix(m);
	const threeA = new ThreeQuaternion().setFromRotationMatrix(threeM);
	compareQuaternions(a, threeA, "setFromRotationMatrix");
});

Deno.test("Quaternion: unitize", () => {
	const a = new Quaternion(3, 4, 0, 0).unitize();
	const threeA = new ThreeQuaternion(3, 4, 0, 0).normalize();
	compareQuaternions(a, threeA, "unitize");
	assertAlmostEquals(
		a.length,
		1.0,
		MathUtils.EPSILON,
		"unitize results in length 1",
	);
});
