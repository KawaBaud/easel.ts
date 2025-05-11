import { SimpleMaterial } from "../materials/SimpleMaterial.ts";
import { Vector3 } from "../maths/Vector3.ts";
import { Mesh } from "../objects/Mesh.ts";
import { Object3D } from "../objects/Object3D.ts";
import { Shape } from "../shapes/Shape.ts";
import { Loader } from "./Loader.ts";

export class OBJLoader extends Loader {
	#positions: Vector3[] = [];
	#normals: Vector3[] = [];
	#uvs: number[][] = [];
	#vertices: Vector3[] = [];
	#indices: number[] = [];

	#vertexMap: Map<string, number> = new Map();
	#currentIndex = 0;

	parse(text: string): Object3D {
		this.#reset();

		const lines = text.split("\n");

		for (const line of lines) {
			const trimmedLine = line.trim();
			if (trimmedLine === "" || trimmedLine.startsWith("#")) {
				continue;
			}

			const parts = trimmedLine.split(/\s+/);
			const command = parts[0]?.toLowerCase();
			if (!command) continue;
			switch (command) {
				case "v":
					this.#parseVertex(parts);
					break;
				case "vn":
					this.#parseNormal(parts);
					break;
				case "vt":
					this.#parseTexture(parts);
					break;
				case "f":
					this.#parseFace(parts);
					break;
			}
		}

		const shape = new Shape();
		shape.vertices = this.#vertices;
		shape.indices = this.#indices;

		const mesh = new Mesh(shape, new SimpleMaterial());
		return new Object3D().add(mesh);
	}

	#parseFace(parts: string[]): void {
		const faceVertices: number[] = [];

		for (let i = 1; i < parts.length; i++) {
			const vertexData = parts[i];
			if (vertexData) {
				const vertexIndex = this.#processVertex(vertexData);
				faceVertices.push(vertexIndex);
			}
		}

		if (faceVertices.length === 3) {
			const v0 = faceVertices[0];
			const v1 = faceVertices[1];
			const v2 = faceVertices[2];
			if (
				v0 !== undefined &&
				v1 !== undefined &&
				v2 !== undefined
			) {
				this.#indices.push(v0, v1, v2);
			}
		} else if (faceVertices.length > 3) {
			const v0 = faceVertices[0];

			if (v0 !== undefined) {
				for (let i = 1; i < faceVertices.length - 1; i++) {
					const v1 = faceVertices[i];
					const v2 = faceVertices[i + 1];
					if (v1 !== undefined && v2 !== undefined) {
						this.#indices.push(v0, v1, v2);
					}
				}
			}
		}
	}

	#parseNormal(parts: string[]): void {
		const x = parseFloat(parts[1] ?? "0");
		const y = parseFloat(parts[2] ?? "0");
		const z = parseFloat(parts[3] ?? "0");
		this.#normals.push(new Vector3(x, y, z));
	}

	#parseTexture(parts: string[]): void {
		const u = parseFloat(parts[1] ?? "0");
		const v = parts.length > 2 ? parseFloat(parts[2] ?? "0") : 0;
		this.#uvs.push([u, v]);
	}

	#parseVertex(parts: string[]): void {
		const x = parseFloat(parts[1] ?? "0");
		const y = parseFloat(parts[2] ?? "0");
		const z = parseFloat(parts[3] ?? "0");
		this.#positions.push(new Vector3(x, y, z));
	}

	#processVertex(vertexData: string): number {
		const currentIndex = this.#vertexMap.get(vertexData);
		if (currentIndex !== undefined) return currentIndex;

		const parts = vertexData.split("/");

		const positionIndex = parseInt(parts[0] ?? "0") - 1;

		// const _texCoordIndex = parts[1] ? parseInt(parts[1]) - 1 : -1;
		// const _normalIndex = parts[2] ? parseInt(parts[2]) - 1 : -1;

		const position = this.#positions[positionIndex];
		if (!position) {
			throw new Error(`invalid vertex position index: ${positionIndex + 1}`);
		}

		const vertex = position.clone();

		this.#vertices.push(vertex);
		const index = this.#currentIndex++;
		this.#vertexMap.set(vertexData, index);
		return index;
	}

	#reset(): void {
		this.#positions = [];
		this.#normals = [];
		this.#uvs = [];
		this.#vertices = [];
		this.#indices = [];

		this.#vertexMap = new Map();
		this.#currentIndex = 0;
	}
}
