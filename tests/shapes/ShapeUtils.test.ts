import { assertEquals } from "@std/assert";
import { Vector3 } from "../../src/maths/Vector3.ts";
import { ShapeUtils } from "../../src/shapes/ShapeUtils.ts";
import "../../src/types.ts";

Deno.test("ShapeUtils.triangulate", () => {
	{
		const vertices = [
			new Vector3(0, 0, 0),
			new Vector3(1, 0, 0),
			new Vector3(0, 1, 0),
		];

		const indices = ShapeUtils.triangulate(vertices);
		assertEquals(indices, [0, 1, 2], "triangle");
	}

	{
		const vertices = [
			new Vector3(-0.5, 0, -0.5), // 0: bottom-left
			new Vector3(0.5, 0, -0.5), // 1: bottom-right
			new Vector3(0.5, 0, 0.5), // 2: top-right
			new Vector3(-0.5, 0, 0.5), // 3: top-left
		];

		const indices = ShapeUtils.triangulate(vertices);
		assertEquals(indices.length, 6, "square");

		const usedVertices = new Set<number>();
		for (let i = 0; i < indices.length; i++) {
			usedVertices.add(indices.safeAt(i));
		}
		assertEquals(usedVertices.size, 4);
	}

	{
		const vertices: Vector3[] = [];

		const indices = ShapeUtils.triangulate(vertices);
		assertEquals(indices, [], "empty vertices");
	}

	{
		const vertices = [
			new Vector3(0, 0, 0),
			new Vector3(1, 0, 0),
		];

		const indices = ShapeUtils.triangulate(vertices);
		assertEquals(indices, [], "insufficient vertices");
	}
});
