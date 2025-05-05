import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { Euler as ThreeEuler, Quaternion as ThreeQuaternion } from "three";
import { Euler } from "../../src/maths/Euler.ts";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Quaternion } from "../../src/maths/Quaternion.ts";

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

Deno.test("Quaternion: set", () => {
	const a = new Quaternion();
	const threeA = new ThreeQuaternion();
	a.set(4, 5, 6, 7);
	threeA.set(4, 5, 6, 7);
	compareQuaternions(a, threeA, "set(x, y, z, w)");
});

Deno.test("Quaternion: setFromEuler", () => {
	const eulerXYZ = new Euler(Math.PI / 4, Math.PI / 3, Math.PI / 6, "XYZ");
	const threeEulerXYZ = new ThreeEuler(
		Math.PI / 4,
		Math.PI / 3,
		Math.PI / 6,
		"XYZ",
	);
	const a = new Quaternion().setFromEuler(eulerXYZ);
	const threeA = new ThreeQuaternion().setFromEuler(threeEulerXYZ);
	compareQuaternions(a, threeA, "setFromEuler (XYZ)");

	const eulerYXZ = new Euler(Math.PI / 4, Math.PI / 3, Math.PI / 6, "YXZ");
	const threeEulerYXZ = new ThreeEuler(
		Math.PI / 4,
		Math.PI / 3,
		Math.PI / 6,
		"YXZ",
	);
	const b = new Quaternion().setFromEuler(eulerYXZ);
	const threeB = new ThreeQuaternion().setFromEuler(threeEulerYXZ);
	compareQuaternions(b, threeB, "setFromEuler (YXZ)");
	compareQuaternions(b, threeB, "setFromEuler (YXZ)");

	const eulerZXY = new Euler(Math.PI / 4, Math.PI / 3, Math.PI / 6, "ZXY");
	const threeEulerZXY = new ThreeEuler(
		Math.PI / 4,
		Math.PI / 3,
		Math.PI / 6,
		"ZXY",
	);
	const c = new Quaternion().setFromEuler(eulerZXY);
	const threeC = new ThreeQuaternion().setFromEuler(threeEulerZXY);
	compareQuaternions(c, threeC, "setFromEuler (ZXY)");
});
