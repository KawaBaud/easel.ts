import { assertEquals, assertNotStrictEquals } from "@std/assert";
import { BufferGeometry } from "three";
import { Vector3 } from "../../src/maths/Vector3.ts";
import { Shape } from "../../src/shapes/Shape.ts";
import "../../src/types.ts";

function compareShapes(
	ourShape: Shape,
	threeGeometry: BufferGeometry,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our: ${ourShape.vertices.length} vertices, ${ourShape.indices.length} indices`,
	);
	console.log(
		`  Three: ${threeGeometry.attributes["position"]?.count ?? 0} vertices`,
	);

	assertEquals(
		Array.isArray(ourShape.vertices),
		true,
		`${message} (vertices is array)`,
	);
	assertEquals(
		Array.isArray(ourShape.indices),
		true,
		`${message} (indices is array)`,
	);
}

Deno.test("Shape: constructor", () => {
	const a = new Shape();

	assertEquals(a.vertices.length, 0);
	assertEquals(a.indices.length, 0);

	compareShapes(a, new BufferGeometry(), "constructor");
});

Deno.test("Shape: clone", () => {
	const a = new Shape();
	a.vertices = [
		new Vector3(0, 0, 0),
		new Vector3(1, 0, 0),
		new Vector3(0, 1, 0),
	];
	a.indices = [0, 1, 2];

	const b = a.clone();

	compareShapes(b, new BufferGeometry(), "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
	assertEquals(b.vertices.length, 3);
	assertEquals(b.indices.length, 3);

	for (let i = 0; i < a.vertices.length; i++) {
		const aVertex = a.vertices[i];
		const bVertex = b.vertices[i];

		if (aVertex && bVertex) {
			assertNotStrictEquals(
				aVertex,
				bVertex,
				`clone creates new vertex instance at index ${i}`,
			);
			assertEquals(
				aVertex.x,
				bVertex.x,
				`clone preserves vertex x at index ${i}`,
			);
			assertEquals(
				aVertex.y,
				bVertex.y,
				`clone preserves vertex y at index ${i}`,
			);
			assertEquals(
				aVertex.z,
				bVertex.z,
				`clone preserves vertex z at index ${i}`,
			);
		}
	}

	for (let i = 0; i < a.indices.length; i++) {
		assertEquals(
			a.indices[i],
			b.indices[i],
			`clone preserves index at position ${i}`,
		);
	}
});

Deno.test("Shape: copy", () => {
	const a = new Shape();
	a.vertices = [
		new Vector3(0, 0, 0),
		new Vector3(1, 0, 0),
		new Vector3(0, 1, 0),
	];
	a.indices = [0, 1, 2];

	const b = new Shape().copy(a);

	compareShapes(b, new BufferGeometry(), "copy");
	assertNotStrictEquals(a, b, "copy creates new instance");
	assertEquals(b.vertices.length, 3);
	assertEquals(b.indices.length, 3);

	for (let i = 0; i < a.vertices.length; i++) {
		assertNotStrictEquals(
			a.vertices[i],
			b.vertices[i],
			`copy creates new vertex instance at index ${i}`,
		);
	}
});
