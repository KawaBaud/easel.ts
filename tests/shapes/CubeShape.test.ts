import { assertEquals, assertNotStrictEquals } from "@std/assert";
import { BoxGeometry } from "three";
import { CubeShape } from "../../src/shapes/CubeShape.ts";
import "../../src/types.ts";

function compareCubeShapes(
	ourShape: CubeShape,
	threeGeometry: BoxGeometry,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our: ${ourShape.vertices.length} vertices, ${ourShape.indices.length} indices`,
	);
	console.log(
		`  Three: ${threeGeometry.attributes["position"]?.count ?? 0} vertices`,
	);

	assertEquals(ourShape.vertices.length, 8, `${message} (has 8 vertices)`);
	assertEquals(ourShape.indices.length, 36, `${message} (has 36 indices)`);
}

Deno.test("CubeShape: constructor", () => {
	const a = new CubeShape();
	assertEquals(a.vertices.length, 8);
	assertEquals(a.indices.length, 36);
	compareCubeShapes(a, new BoxGeometry(), "constructor");

	const b = new CubeShape(2, 3, 4);
	assertEquals(b.vertices.length, 8);
	assertEquals(b.indices.length, 36);
	compareCubeShapes(
		b,
		new BoxGeometry(2, 3, 4),
		"constructor (dimensions)",
	);

	const halfWidth = 2 / 2;
	const halfHeight = 3 / 2;
	const halfDepth = 4 / 2;

	const frontBottomLeft = b.vertices[0];
	const backTopRight = b.vertices[6];

	if (frontBottomLeft) {
		assertEquals(frontBottomLeft.x, -halfWidth);
		assertEquals(frontBottomLeft.y, -halfHeight);
		assertEquals(frontBottomLeft.z, -halfDepth);
	}
	if (backTopRight) {
		assertEquals(backTopRight.x, halfWidth);
		assertEquals(backTopRight.y, halfHeight);
		assertEquals(backTopRight.z, halfDepth);
	}
});

Deno.test("CubeShape: clone", () => {
	const a = new CubeShape(2, 3, 4);
	const b = a.clone();

	compareCubeShapes(b, new BoxGeometry(2, 3, 4), "clone");
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
