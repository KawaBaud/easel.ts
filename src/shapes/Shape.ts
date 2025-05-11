import type { Vector3 } from "../maths/Vector3.ts";
import { ShapeUtils } from "./ShapeUtils.ts";

export class Shape {
	vertices: Vector3[] = [];
	indices: number[] = [];
	faceNormals: Vector3[] = [];

	clone(): Shape {
		return new Shape().copy(this);
	}

	computeFaceNormals(): this {
		this.faceNormals = [];

		for (let i = 0; i < this.indices.length; i += 3) {
			const i1 = this.indices.safeAt(i);
			const i2 = this.indices.safeAt(i + 1);
			const i3 = this.indices.safeAt(i + 2);

			const v1 = this.vertices[i1];
			const v2 = this.vertices[i2];
			const v3 = this.vertices[i3];
			if (!v1 || !v2 || !v3) continue;

			this.faceNormals.push(ShapeUtils.calculateNormal(v1, v2, v3));
		}

		return this;
	}

	copy(source: Shape): this {
		this.vertices = source.vertices.map((v) => v.clone());
		this.indices = [...source.indices];
		return this;
	}
}
