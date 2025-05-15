import { assertEquals, assertNotStrictEquals } from "@std/assert";
import { MeshBasicMaterial as ThreeMaterial } from "three";
import "../../extensions/array.extension.ts";
import { Material } from "../../src/materials/Material.ts";

function compareMaterials(
	ourMaterial: Material,
	threeMaterial: ThreeMaterial,
	message: string,
): void {
	console.log(`${message}:`);

	assertEquals(
		ourMaterial.wireframe,
		threeMaterial.wireframe,
		`${message} (wireframe)`,
	);
}

Deno.test("Material: constructor", () => {
	const a = new Material();
	const threeA = new ThreeMaterial();
	threeA.wireframe = false;

	assertEquals(a.color, 0xFFFFFF);
	assertEquals(a.wireframe, false);

	compareMaterials(a, threeA, "constructor");

	const b = new Material({ color: 0xFF0000, wireframe: true });
	const threeB = new ThreeMaterial({ color: 0xFF0000, wireframe: true });

	assertEquals(b.color, 0xFF0000);
	assertEquals(b.wireframe, true);

	compareMaterials(b, threeB, "constructor (options)");
});

Deno.test("Material: clone", () => {
	const a = new Material({ color: 0x00FF00, wireframe: true });
	const b = a.clone();

	const threeA = new ThreeMaterial({
		color: 0x00FF00,
		wireframe: true,
	});
	const threeB = threeA.clone();

	compareMaterials(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
	assertEquals(b.color, 0x00FF00);
	assertEquals(b.wireframe, true);
});

Deno.test("Material: copy", () => {
	const a = new Material({ color: 0x0000FF, wireframe: true });
	const b = new Material().copy(a);

	const threeA = new ThreeMaterial({ color: 0x00FF00, wireframe: true });
	const threeB = new ThreeMaterial().copy(threeA);

	compareMaterials(b, threeB, "copy");
	assertEquals(b.color, 0x0000FF);
	assertEquals(b.wireframe, true);
});
