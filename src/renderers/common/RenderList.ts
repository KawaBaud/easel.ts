import type { Object3D } from "../../objects/Object3D";

export class RenderList {
	objects: Object3D[] = [];

	add(object: Object3D): this {
		if (this.objects.includes(object)) {
			return this;
		}
		this.objects.push(object);
		return this;
	}

	clear(): this {
		this.objects.length = 0;
		return this;
	}

	remove(object: Object3D): this {
		const index = this.objects.indexOf(object);
		if (index !== -1) {
			this.objects.splice(index, 1);
			return this;
		}
		return this;
	}
}
