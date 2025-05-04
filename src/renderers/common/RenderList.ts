import type { Object3D } from "../../objects/Object3D.ts";

export class RenderList {
	objects: Object3D[] = [];

	add(object: Object3D): this {
		return !this.objects.includes(object)
			? (this.objects.push(object), this)
			: this;
	}

	clear(): this {
		this.objects.length = 0;
		return this;
	}

	remove(object: Object3D): this {
		return (this.objects.indexOf(object) !== -1)
			? (this.objects.splice(this.objects.indexOf(object), 1), this)
			: this;
	}
}
