import { assertEquals } from "@std/assert";
import "../../src/extensions/array.extension.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";
import { ShapeUtils } from "../../src/shapes/ShapeUtils.ts";

Deno.test("ShapeUtils.triangulate", () => {
	{
		const v0 = new Vector3(0, 0, 0);
		const v1 = new Vector3(1, 0, 0);
		const v2 = new Vector3(0.5, 0, 1);

		const counterClockwise = ShapeUtils.isCounterClockwise(v0, v1, v2);
		assertEquals(
			counterClockwise,
			true,
			"triangle should be counter-clockwise",
		);

		const vertices = [v0, v1, v2];
		const indices = ShapeUtils.triangulate(vertices);
		assertEquals(indices.length, 3, "triangle should have 3 indices");
	}

	{
		const vertices = [
			new Vector3(-0.5, 0, -0.5),
			new Vector3(0.5, 0, -0.5),
			new Vector3(0.5, 0, 0.5),
			new Vector3(-0.5, 0, 0.5),
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
		assertEquals(indices, new Uint16Array(0), "empty vertices");
	}

	{
		const vertices = [
			new Vector3(0, 0, 0),
			new Vector3(1, 0, 0),
		];

		const indices = ShapeUtils.triangulate(vertices);
		assertEquals(indices, new Uint16Array(0), "insufficient vertices");
	}
});
