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

		source.background !== null ? this.background = source.background : null;
		return this;
	}

	clear(): this {
		for (const child of [...this.children]) this.remove(child);
		return this;
	}
}
