import { assertEquals, assertNotStrictEquals } from "@std/assert";
import { PlaneGeometry } from "three";
import "../../src/extensions/array.extension.ts";
import { PlaneShape } from "../../src/shapes/PlaneShape.ts";

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

	const threeGeometry = new PlaneGeometry(2, 3);
	const threeVertices = threeGeometry.attributes["position"]?.array;
	if (!threeVertices) throw new Error("attribute is undefined");

	for (let i = 0; i < b.vertices.length; i++) {
		const vertex = b.vertices[i];
		const threeIndex = i * 3;
		if (vertex) {
			assertEquals(
				vertex.x,
				threeVertices[threeIndex],
				`Vertex ${i} x coordinate`,
			);
			assertEquals(
				vertex.y,
				-threeVertices.safeAt(threeIndex + 1),
				`Vertex ${i} y coordinate`,
			);
			assertEquals(
				vertex.z,
				threeVertices[threeIndex + 2],
				`Vertex ${i} z coordinate`,
			);
		}
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
