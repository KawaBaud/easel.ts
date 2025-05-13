import { assertEquals, assertNotStrictEquals } from "@std/assert";
import { PlaneGeometry } from "three";
import { PlaneShape } from "../../src/shapes/PlaneShape.ts";
import "../../src/types.ts";

function comparePlaneShapes(
	ourShape: PlaneShape,
	threeGeometry: PlaneGeometry,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our: ${ourShape.vertices.length} vertices, ${ourShape.indices.length} indices`,
	);
	console.log(
		`  Three: ${threeGeometry.attributes["position"]?.count ?? 0} vertices`,
	);

	assertEquals(ourShape.vertices.length, 4, `${message} (has 4 vertices)`);
	assertEquals(ourShape.indices.length, 6, `${message} (has 6 indices)`);
}

Deno.test("PlaneShape: constructor", () => {
	const a = new PlaneShape();
	assertEquals(a.vertices.length, 4);
	assertEquals(a.indices.length, 6);
	comparePlaneShapes(a, new PlaneGeometry(), "constructor");

	const b = new PlaneShape(2, 3);
	assertEquals(b.vertices.length, 4);
	assertEquals(b.indices.length, 6);
	comparePlaneShapes(
		b,
		new PlaneGeometry(2, 3),
		"constructor (dimensions)",
	);

	const halfWidth = 2 / 2;
	const halfHeight = 3 / 2;

	const bottomLeft = b.vertices[0];
	const bottomRight = b.vertices[1];
	const topRight = b.vertices[2];
	const topLeft = b.vertices[3];

	if (bottomLeft) {
		assertEquals(bottomLeft.x, -halfWidth);
		assertEquals(bottomLeft.y, 0);
		assertEquals(bottomLeft.z, -halfHeight);
	}
	if (bottomRight) {
		assertEquals(bottomRight.x, halfWidth);
		assertEquals(bottomRight.y, 0);
		assertEquals(bottomRight.z, -halfHeight);
	}
	if (topRight) {
		assertEquals(topRight.x, halfWidth);
		assertEquals(topRight.y, 0);
		assertEquals(topRight.z, halfHeight);
	}
	if (topLeft) {
		assertEquals(topLeft.x, -halfWidth);
		assertEquals(topLeft.y, 0);
		assertEquals(topLeft.z, halfHeight);
	}
});

Deno.test("PlaneShape: clone", () => {
	const a = new PlaneShape(2, 3);
	const b = a.clone();
	comparePlaneShapes(b, new PlaneGeometry(2, 3), "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");

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
});
