import type { Vector3 } from "../maths/Vector3.ts";
import type { Cloneable, Copyable } from "../types/interfaces.ts";

export class Shape implements Cloneable<Shape>, Copyable<Shape> {
	readonly isShape: boolean = true;

	vertices: Vector3[] = [];
	indices: number[] = [];

	constructor() {}

	clone(): Shape {
		return new Shape().copy(this);
	}

	copy(source: Shape): this {
		this.vertices = source.vertices.map((v) => v.clone());
		this.indices = [...source.indices];
		return this;
	}
}
