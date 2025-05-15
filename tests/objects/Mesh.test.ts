import { assertEquals, assertNotStrictEquals } from "@std/assert";
import { Mesh as ThreeMesh } from "three";
import "../../src/extensions/array.extension.ts";
import { Material } from "../../src/materials/Material.ts";
import { Mesh } from "../../src/objects/Mesh.ts";
import { Shape } from "../../src/shapes/Shape.ts";

function compareMeshes(
	ourMesh: Mesh,
	_threeMesh: ThreeMesh,
	message: string,
): void {
	console.log(`${message}:`);

	assertEquals(
		ourMesh.shape instanceof Shape,
		true,
		`${message} (shape is Shape)`,
	);
	assertEquals(
		ourMesh.material instanceof Material,
		true,
		`${message} (material is Material)`,
	);
}

Deno.test("Mesh: constructor", () => {
	const shape = new Shape();
	const material = new Material();

	const a = new Mesh(shape, material);

	assertEquals(a.shape, shape);
	assertEquals(a.material, material);
});

Deno.test("Mesh: clone", () => {
	const shape = new Shape();
	const material = new Material();

	const a = new Mesh(shape, material);
	const b = a.clone();

	compareMeshes(b, new ThreeMesh(), "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
	assertNotStrictEquals(a.shape, b.shape, "clone creates new shape instance");
	assertNotStrictEquals(
		a.material,
		b.material,
		"clone creates new material instance",
	);
});

Deno.test("Mesh: copy", () => {
	const shapeA = new Shape();
	const materialA = new Material();
	const a = new Mesh(shapeA, materialA);

	const shapeB = new Shape();
	const materialB = new Material();
	const b = new Mesh(shapeB, materialB);

	b.copy(a);

	assertNotStrictEquals(b.shape, a.shape, "copy creates new shape instance");
	assertNotStrictEquals(
		b.material,
		a.material,
		"copy creates new material instance",
	);
});
