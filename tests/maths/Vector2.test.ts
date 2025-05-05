import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { Vector2 as ThreeVector2 } from "three";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Vector2 } from "../../src/maths/Vector2.ts";

function compareVectors(
	ourVec: Vector2,
	threeVec: ThreeVector2,
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

Deno.test("Vector2: constructor", () => {
	const a = new Vector2();
	const threeA = new ThreeVector2();
	assertEquals(a.x, 0);
	assertEquals(a.y, 0);
	compareVectors(a, threeA, "constructor");

	const b = new Vector2(1, 2);
	const threeB = new ThreeVector2(1, 2);
	assertEquals(b.x, 1);
	assertEquals(b.y, 2);
	compareVectors(b, threeB, "constructor w/ values");
});

Deno.test("Vector2: clone", () => {
	const a = new Vector2(1, 2);
	const b = a.clone();
	const threeA = new ThreeVector2(1, 2);
	const threeB = threeA.clone();
	compareVectors(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("Vector2: copy", () => {
	const a = new Vector2(1, 2);
	const b = new Vector2().copy(a);
	const threeA = new ThreeVector2(1, 2);
	const threeB = new ThreeVector2().copy(threeA);
	compareVectors(b, threeB, "copy");
	compareVectors(a, threeA, "copy (original unchanged)");
});

Deno.test("Vector2: fromArray", () => {
	const a = new Vector2().fromArray([1, 2]);
	const threeA = new ThreeVector2(1, 2);
	compareVectors(a, threeA, "fromArray");
});

Deno.test("Vector2: set", () => {
	const a = new Vector2().set(4, 5);
	const threeA = new ThreeVector2().set(4, 5);
	compareVectors(a, threeA, "set(x, y)");
});
