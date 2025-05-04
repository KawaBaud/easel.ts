import type { Mesh } from "../../objects/Mesh.ts";

export class RenderList {
	readonly isRenderList: boolean = true;

	items: Mesh[] = [];

	add(object: Mesh): void {
		if (!this.items.includes(object)) {
			this.items.push(object);
		}
	}

	clear(): void {
		this.items.length = 0;
	}

	remove(object: Mesh): void {
		const index = this.items.indexOf(object);
		if (index !== -1) this.items.splice(index, 1);
	}
}
