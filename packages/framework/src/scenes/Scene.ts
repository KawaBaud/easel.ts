import { Color } from "../common/Color.ts";
import { Object3D } from "../objects/Object3D.ts";

export class Scene extends Object3D {
	background = new Color(0x000000);

	constructor() {
		super();
		this.name = "Scene";
	}

	override copy(source: Scene): this {
		super.copy(source);

		if (source.background !== null) this.background = source.background;

		return this;
	}

	clear(): this {
		for (const child of [...this.children]) this.remove(child);
		return this;
	}
}
