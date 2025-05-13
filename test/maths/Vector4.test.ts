import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { Vector4 as ThreeVector4 } from "three";
import { Maths } from "../../src/maths/Maths.ts";
import { Vector4 } from "../../src/maths/Vector4.ts";

function compareVectors(
	ourVec: Vector4,
	threeVec: ThreeVector4,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(`  Our:   (${ourVec.x}, ${ourVec.y})`);
	console.log(`  Three: (${threeVec.x}, ${threeVec.y})`);

	assertAlmostEquals(
		ourVec.x,
		threeVec.x,
		Maths.EPSILON,
		`${message} (x)`,
	);
	assertAlmostEquals(
		ourVec.y,
		threeVec.y,
		Maths.EPSILON,
		`${message} (y)`,
	);
}

Deno.test("Vector4: constructor", () => {
	const a = new Vector4();
	const threeA = new ThreeVector4();
	assertEquals(a.x, 0);
	assertEquals(a.y, 0);
	compareVectors(a, threeA, "constructor");

	const b = new Vector4(1, 2, 3, 4);
	const threeB = new ThreeVector4(1, 2, 3, 4);
	assertEquals(b.x, 1);
	assertEquals(b.y, 2);
	compareVectors(b, threeB, "constructor w/ values");
});

Deno.test("Vector4: get->length", () => {
	const a = new Vector4(1, 2, 3, 4);
	const threeA = new ThreeVector4(1, 2, 3, 4);
	assertAlmostEquals(a.length, threeA.length(), Maths.EPSILON, "length");
});

Deno.test("Vector4: get->lengthSq", () => {
	const a = new Vector4(1, 2, 3, 4);
	const threeA = new ThreeVector4(1, 2, 3, 4);
	assertAlmostEquals(
		a.lengthSq,
		threeA.lengthSq(),
		Maths.EPSILON,
		"lengthSq",
	);
});

Deno.test("Vector4: clone", () => {
	const a = new Vector4(1, 2, 3, 4);
	const b = a.clone();
	const threeA = new ThreeVector4(1, 2, 3, 4);
	const threeB = threeA.clone();
	compareVectors(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("Vector4: copy", () => {
	const a = new Vector4(1, 2, 3, 4);
	const b = new Vector4().copy(a);
	const threeA = new ThreeVector4(1, 2, 3, 4);
	const threeB = new ThreeVector4().copy(threeA);
	compareVectors(b, threeB, "copy");
	compareVectors(a, threeA, "copy (original unchanged)");
});

Deno.test("Vector4: divScalar", () => {
	const a = new Vector4(1, 2, 3, 4);
	const b = a.clone().divScalar(2);
	const threeA = new ThreeVector4(1, 2, 3, 4);
	const threeB = threeA.clone().divideScalar(2);
	compareVectors(b, threeB, "divScalar");
	compareVectors(a, threeA, "divScalar (original unchanged)");
});

Deno.test("Vector4: fromArray", () => {
	const a = new Vector4().fromArray([1, 2, 3, 4]);
	const threeA = new ThreeVector4().fromArray([1, 2, 3, 4]);
	compareVectors(a, threeA, "fromArray");
});

Deno.test("Vector4: set", () => {
	const a = new Vector4().set(4, 5, 6, 7);
	const threeA = new ThreeVector4().set(4, 5, 6, 7);
	compareVectors(a, threeA, "set(x, y)");
});

Deno.test("Vector4: unitize", () => {
	const a = new Vector4(1, 2, 3, 4);
	const b = a.clone().unitize();
	const threeA = new ThreeVector4(1, 2, 3, 4);
	const threeB = threeA.clone().normalize();
	compareVectors(b, threeB, "unitize");
	compareVectors(a, threeA, "unitize (original unchanged)");
});
