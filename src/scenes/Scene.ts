import { Color } from "../common/Color";
import { Object3D } from "../objects/Object3D";

export class Scene extends Object3D {
	background = new Color(0x000000);

	constructor() {
		super();
		this.name = "Scene";
	}

	clear(): this {
		for (const child of [...this.children]) {
			this.remove(child);
		}
		return this;
	}

	override copy(source: this): this {
		super.copy(source);
		if (source.background !== undefined) {
			this.background = source.background;
		}
		return this;
	}
}
