import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { Vector4 as ThreeVector4 } from "three";
import { MathUtils } from "../../src/maths/MathUtils.ts";
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
		MathUtils.EPSILON,
		`${message} (x)`,
	);
	assertAlmostEquals(
		ourVec.y,
		threeVec.y,
		MathUtils.EPSILON,
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

Deno.test("Vector4: set", () => {
	const a = new Vector4();
	const threeA = new ThreeVector4();
	a.set(4, 5, 6, 7);
	threeA.set(4, 5, 6, 7);
	compareVectors(a, threeA, "set(x, y)");
});
