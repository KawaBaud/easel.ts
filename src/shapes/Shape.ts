import type { Vector3 } from "../maths/Vector3";
import { ShapeUtils } from "./ShapeUtils";

export class Shape {
	vertices: Vector3[] = [];
	indices = new Uint16Array([]);
	faceNormals: Vector3[] = [];

	clone(): Shape {
		return new Shape().copy(this);
	}

	computeFaceNormals(): this {
		this.faceNormals = [];

		for (let i = 0; i < this.indices.length; i += 3) {
			const i1 = this.indices[i];
			const i2 = this.indices[i + 1];
			const i3 = this.indices[i + 2];
			if (!(i1 && i2 && i3)) {
				throw new Error(
					`EASEL.Shape: invalid index at ${i} (${i1}, ${i2}, ${i3})`,
				);
			}

			const v1 = this.vertices[i1];
			const v2 = this.vertices[i2];
			const v3 = this.vertices[i3];
			if (!(v1 && v2 && v3)) {
				continue;
			}

			this.faceNormals.push(ShapeUtils.calculateNormal(v1, v2, v3));
		}

		return this;
	}

	copy(source: this): this {
		this.vertices = source.vertices.map((v) => v.clone());
		this.indices = source.indices;
		return this;
	}
}
