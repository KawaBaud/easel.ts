import { Material } from "../materials/Material";
import { Vector3 } from "../maths/Vector3";
import { Mesh } from "../objects/Mesh";
import { Object3D } from "../objects/Object3D";
import { Shape } from "../shapes/Shape";
import { Loader } from "./Loader";

const _vertexMap: Map<string, number> = new Map();
let _currentIndex = 0;

const SPLIT_REGEX = /\s+/;

export class ObjLoader extends Loader {
	#positions: Vector3[] = [];
	#normals: Vector3[] = [];
	#uvs = new Float32Array(0);
	#vertices: Vector3[] = [];
	#indices = new Uint16Array(0);

	parse(text: string): Object3D {
		this.#reset();

		const lines = text.split("\n");
		for (const line of lines) {
			const trimmedLine = line.trim();
			if (trimmedLine === "" || trimmedLine.startsWith("#")) {
				continue;
			}

			const parts = trimmedLine.split(SPLIT_REGEX);
			if (parts.length < 2) {
				continue; // skip lines with insufficient data
			}
			const command = parts[0]?.toLowerCase();
			if (!command) {
				continue;
			}
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
				default:
					console.warn(`EASEL.ObjLoader: ignoring command: ${command}`);
			}
		}

		const shape = new Shape();
		shape.vertices = this.#vertices;
		shape.indices = this.#indices;

		const mesh = new Mesh(shape, new Material());
		return new Object3D().add(mesh);
	}

	#addFaceIndices(faceVertices: number[]): void {
		if (faceVertices.length === 3) {
			this.#addTriangle(faceVertices);
		} else if (faceVertices.length > 3) {
			this.#addPolygon(faceVertices);
		}
	}

	#addPolygon(vertices: number[]): void {
		const v0 = vertices[0];
		if (v0 !== undefined) {
			for (let i = 1; i < vertices.length - 1; i++) {
				const v1 = vertices[i];
				const v2 = vertices[i + 1];
				if (v1 !== undefined && v2 !== undefined) {
					this.#indices = new Uint16Array([...this.#indices, v0, v1, v2]);
				}
			}
		}
	}

	#addTriangle(vertices: number[]): void {
		const [v0, v1, v2] = vertices;
		if (v0 !== undefined && v1 !== undefined && v2 !== undefined) {
			this.#indices = new Uint16Array([...this.#indices, v0, v1, v2]);
		}
	}

	#getFaceVertices(parts: string[]): number[] {
		const faceVertices: number[] = [];

		for (let i = 1; i < parts.length; i++) {
			const vertexData = parts[i];
			if (vertexData) {
				faceVertices.push(this.#processVertex(vertexData));
			}
		}
		return faceVertices;
	}

	#parseFace(parts: string[]): void {
		const faceVertices = this.#getFaceVertices(parts);
		this.#addFaceIndices(faceVertices);
	}

	#parseNormal(parts: string[]): void {
		const x = Number.parseFloat(parts[1] as string);
		const y = Number.parseFloat(parts[2] as string);
		const z = Number.parseFloat(parts[3] as string);
		this.#normals.push(new Vector3(x, y, z));
	}

	#parseTexture(parts: string[]): void {
		const u = Number.parseFloat(parts[1] as string);
		const v = parts.length > 2 ? Number.parseFloat(parts[2] as string) : 0;
		this.#uvs = new Float32Array([...this.#uvs, u, v]);
	}

	#parseVertex(parts: string[]): void {
		const x = Number.parseFloat(parts[1] as string);
		const y = Number.parseFloat(parts[2] as string);
		const z = Number.parseFloat(parts[3] as string);
		this.#positions.push(new Vector3(x, y, z));
	}

	#processVertex(vertexData: string): number {
		const currentIndex = _vertexMap.get(vertexData);
		if (currentIndex !== undefined) {
			return currentIndex;
		}

		const parts = vertexData.split("/");

		const positionIndex = Number.parseInt(parts[0] as string) - 1;
		// const texCoordIndex = parts[1] ? Number.parseInt(parts[1]) - 1 : -1;
		// const normalIndex = parts[2] ? Number.parseInt(parts[2]) - 1 : -1;

		const position = this.#positions[positionIndex];
		if (!position) {
			throw new Error(
				`EASEL.ObjLoader: invalid vertex position index: ${positionIndex + 1}`,
			);
		}

		const vertex = position.clone();
		this.#vertices.push(vertex);

		const index = _currentIndex++;
		_vertexMap.set(vertexData, index);
		return index;
	}

	#reset(): void {
		this.#positions = [];
		this.#normals = [];
		this.#uvs = new Float32Array(0);
		this.#vertices = [];
		this.#indices = new Uint16Array(0);

		_vertexMap.clear();
		_currentIndex = 0;
	}
}
