import { assertEquals, assertNotStrictEquals } from "@std/assert";
import { MeshBasicMaterial as ThreeSimpleMaterial } from "three";
import { SimpleMaterial } from "../../src/materials/SimpleMaterial.ts";
import "../../src/types.ts";

function compareSimpleMaterials(
	ourMaterial: SimpleMaterial,
	threeMaterial: ThreeSimpleMaterial,
	message: string,
): void {
	console.log(`${message}:`);

	assertEquals(
		ourMaterial.wireframe,
		threeMaterial.wireframe,
		`${message} (wireframe)`,
	);
}

Deno.test("SimpleMaterial: constructor", () => {
	const a = new SimpleMaterial();
	const threeA = new ThreeSimpleMaterial();
	threeA.wireframe = false;

	assertEquals(a.color, 0xFFFFFF);
	assertEquals(a.wireframe, false);

	compareSimpleMaterials(a, threeA, "constructor");

	const b = new SimpleMaterial({ color: 0xFF0000, wireframe: true });
	const threeB = new ThreeSimpleMaterial({ color: 0xFF0000, wireframe: true });

	assertEquals(b.color, 0xFF0000);
	assertEquals(b.wireframe, true);

	compareSimpleMaterials(b, threeB, "constructor (options)");
});

Deno.test("SimpleMaterial: clone", () => {
	const a = new SimpleMaterial({ color: 0x00FF00, wireframe: true });
	const b = a.clone();

	const threeA = new ThreeSimpleMaterial({
		color: 0x00FF00,
		wireframe: true,
	});
	const threeB = threeA.clone();

	compareSimpleMaterials(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
	assertEquals(b.color, 0x00FF00);
	assertEquals(b.wireframe, true);
});

Deno.test("SimpleMaterial: copy", () => {
	const a = new SimpleMaterial({ color: 0x0000FF, wireframe: true });
	const b = new SimpleMaterial().copy(a);

	const threeA = new ThreeSimpleMaterial({ color: 0x00FF00, wireframe: true });
	const threeB = new ThreeSimpleMaterial().copy(threeA);

	compareSimpleMaterials(b, threeB, "copy");
	assertEquals(b.color, 0x0000FF);
	assertEquals(b.wireframe, true);
});
