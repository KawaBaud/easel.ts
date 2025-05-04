import type { Vector3 } from "../maths/Vector3.ts";

export class Shape {
	vertices: Vector3[] = [];
	indices: number[] = [];

	clone(): Shape {
		return new Shape().copy(this);
	}

	copy(source: Shape): this {
		this.vertices = source.vertices.map((v) => v.clone());
		this.indices = [...source.indices];
		return this;
	}
}
