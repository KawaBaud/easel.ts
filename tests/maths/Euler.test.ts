import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Euler as ThreeEuler,
	Matrix4 as ThreeMatrix4,
	Quaternion as ThreeQuaternion,
} from "three";
import { Euler } from "../../src/maths/Euler.ts";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Matrix4 } from "../../src/maths/Matrix4.ts";
import { Quaternion } from "../../src/maths/Quaternion.ts";

function compareEulers(
	ourEuler: Euler,
	threeEuler: ThreeEuler,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our:   (${ourEuler.x}, ${ourEuler.y}, ${ourEuler.z}, ${ourEuler.order})`,
	);
	console.log(
		`  Three: (${threeEuler.x}, ${threeEuler.y}, ${threeEuler.z}, ${threeEuler.order})`,
	);

	const ourQuat = new Quaternion().setFromEuler(ourEuler);
	const threeQuat = new ThreeQuaternion().setFromEuler(threeEuler);

	const dot = (ourQuat.x * threeQuat.x) +
		(ourQuat.y * threeQuat.y) +
		(ourQuat.z * threeQuat.z) +
		(ourQuat.w * threeQuat.w);
	if (dot < 0) {
		threeQuat.x *= -1;
		threeQuat.y *= -1;
		threeQuat.z *= -1;
		threeQuat.w *= -1;
	}

	console.log(
		`  OurQuat:   (${ourQuat.x}, ${ourQuat.y}, ${ourQuat.z}, ${ourQuat.w})`,
	);
	console.log(
		`  ThreeQuat: (${threeQuat.x}, ${threeQuat.y}, ${threeQuat.z}, ${threeQuat.w})`,
	);

	assertAlmostEquals(
		Math.abs(ourQuat.x),
		Math.abs(threeQuat.x),
		MathUtils.EPSILON,
		`${message} (quaternion x)`,
	);
	assertAlmostEquals(
		Math.abs(ourQuat.y),
		Math.abs(threeQuat.y),
		MathUtils.EPSILON,
		`${message} (quaternion y)`,
	);
	assertAlmostEquals(
		Math.abs(ourQuat.z),
		Math.abs(threeQuat.z),
		MathUtils.EPSILON,
		`${message} (quaternion z)`,
	);
	assertAlmostEquals(
		Math.abs(ourQuat.w),
		Math.abs(threeQuat.w),
		MathUtils.EPSILON,
		`${message} (quaternion w)`,
	);

	assertEquals(
		ourEuler.order,
		threeEuler.order,
		`${message} (order)`,
	);
}

Deno.test("Euler: constructor", () => {
	const a = new Euler();
	const threeA = new ThreeEuler();
	assertEquals(a.x, 0);
	assertEquals(a.y, 0);
	assertEquals(a.z, 0);
	assertEquals(a.order, "XYZ");
	compareEulers(a, threeA, "constructor");

	const b = new Euler(1, 2, 3, "YXZ");
	const threeB = new ThreeEuler(1, 2, 3, "YXZ");
	assertEquals(b.x, 1);
	assertEquals(b.y, 2);
	assertEquals(b.z, 3);
	assertEquals(b.order, "YXZ");
	compareEulers(b, threeB, "constructor w/ values");
});

Deno.test("Euler: clone", () => {
	const a = new Euler(1, 2, 3, "ZXY");
	const b = a.clone();
	const threeA = new ThreeEuler(1, 2, 3, "ZXY");
	const threeB = threeA.clone();
	compareEulers(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("Euler: copy", () => {
	const a = new Euler(1, 2, 3, "YZX");
	const b = new Euler().copy(a);
	const threeA = new ThreeEuler(1, 2, 3, "YZX");
	const threeB = new ThreeEuler().copy(threeA);
	compareEulers(b, threeB, "copy");
	compareEulers(a, threeA, "copy (original unchanged)");
});

Deno.test("Euler: fromArray", () => {
	const a = new Euler().fromArray([1, 2, 3, "YZX"]);
	const threeA = new ThreeEuler().fromArray([1, 2, 3, "YZX"]);
	compareEulers(a, threeA, "fromArray");
});

Deno.test("Euler: set", () => {
	const a = new Euler();
	const threeA = new ThreeEuler();
	a.set(4, 5, 6, "ZYX");
	threeA.set(4, 5, 6, "ZYX");
	compareEulers(a, threeA, "set(x, y, z, order)");
});

Deno.test("Euler: reorder", () => {
	const euler = new Euler(
		MathUtils.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"XYZ",
	);
	const threeEuler = new ThreeEuler(
		MathUtils.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"XYZ",
	);

	const orders: Array<Euler["order"]> = ["YXZ", "ZXY", "ZYX", "YZX", "XZY"];
	for (const order of orders) {
		const a = euler.clone().reorder(order);
		const threeA = threeEuler.clone().reorder(order);
		compareEulers(a, threeA, `reorder to ${order}`);
	}
});

Deno.test("Euler: setFromQuaternion", () => {
	const q = new Quaternion().setFromEuler(
		new Euler(MathUtils.QUARTER_PI, Math.PI / 3, Math.PI / 6, "XYZ"),
	);
	const threeQ = new ThreeQuaternion().setFromEuler(
		new ThreeEuler(MathUtils.QUARTER_PI, Math.PI / 3, Math.PI / 6, "XYZ"),
	);

	const orders: Array<Euler["order"]> = [
		"XYZ",
		"YXZ",
		"ZXY",
		"ZYX",
		"YZX",
		"XZY",
	];
	for (const order of orders) {
		const a = new Euler().setFromQuaternion(q, order);
		const threeA = new ThreeEuler().setFromQuaternion(threeQ, order);
		compareEulers(a, threeA, `setFromQuaternion (${order})`);
	}
});

Deno.test("Euler: setFromRotationMatrix", () => {
	const m = new Matrix4().makeRotationFromEuler(
		new Euler(MathUtils.QUARTER_PI, Math.PI / 3, Math.PI / 6, "XYZ"),
	);
	const threeM = new ThreeMatrix4().makeRotationFromEuler(
		new ThreeEuler(MathUtils.QUARTER_PI, Math.PI / 3, Math.PI / 6, "XYZ"),
	);

	const orders: Array<Euler["order"]> = [
		"XYZ",
		"YXZ",
		"ZXY",
		"ZYX",
		"YZX",
		"XZY",
	];
	for (const order of orders) {
		const a = new Euler().setFromRotationMatrix(m, order);
		const threeA = new ThreeEuler().setFromRotationMatrix(threeM, order);
		compareEulers(a, threeA, `setFromRotationMatrix (${order})`);
	}
});
