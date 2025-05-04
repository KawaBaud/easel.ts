import { Vector3 } from "../../maths/Vector3.ts";
import type { Mesh } from "../../objects/Mesh.ts";
import { get } from "../../utils.ts";

export class RenderList {
	readonly isRenderList = true;

	items: Mesh[] = [];
	#zValues = new Float32Array(128);
	#indices = new Uint16Array(128);
	#capacity = 128;
	#v1 = new Vector3();
	#v2 = new Vector3();
	#v3 = new Vector3();

	add(object: Mesh): void {
		if (!this.items.includes(object)) {
			this.items.push(object);
		}
	}

	clear(): void {
		this.items.length = 0;
	}

	depthSort(objects = this.items): void {
		const count = objects.length;
		if (count > this.#capacity) {
			this.#capacity = Math.max(count, this.#capacity * 2);
			this.#zValues = new Float32Array(this.#capacity);
			this.#indices = new Uint16Array(this.#capacity);
		}

		for (let i = 0; i < count; i++) {
			const object = objects[i];
			this.#zValues[i] = object ? this.#sortVerticesByZ(object) : 0;
			this.#indices[i] = i;
		}

		const indicesArray = Array.from(this.#indices).slice(0, count);
		indicesArray.sort((a, b) => {
			const valA = get(this.#zValues, a);
			const valB = get(this.#zValues, b);
			return valB - valA;
		});

		const sortedObjects = new Array(count);
		for (let i = 0; i < count; i++) {
			const idx = indicesArray[i];
			if (idx !== undefined) sortedObjects[i] = objects[idx];
		}
		for (let i = 0; i < count; i++) {
			if (sortedObjects[i] !== undefined) objects[i] = sortedObjects[i];
		}
	}

	remove(object: Mesh): void {
		const index = this.items.indexOf(object);
		if (index !== -1) this.items.splice(index, 1);
	}

	#sortVerticesByZ(mesh: Mesh): number {
		if (
			!mesh.shape ||
			!mesh.shape.vertices ||
			!mesh.shape.indices
		) return mesh.position.z;

		const vertices = mesh.shape.vertices;
		const indices = mesh.shape.indices;
		if (indices.length < 3) return mesh.position.z;

		const idx1 = get(indices, 0);
		const idx2 = get(indices, 1);
		const idx3 = get(indices, 2);

		const v1 = vertices[idx1];
		const v2 = vertices[idx2];
		const v3 = vertices[idx3];

		if (!v1 || !v2 || !v3) return mesh.position.z;

		this.#v1.copy(v1);
		this.#v2.copy(v2);
		this.#v3.copy(v3);

		this.#v1.applyMatrix4(mesh.worldMatrix);
		this.#v2.applyMatrix4(mesh.worldMatrix);
		this.#v3.applyMatrix4(mesh.worldMatrix);

		return (this.#v1.z + this.#v2.z + this.#v3.z) / 3;
	}
}
