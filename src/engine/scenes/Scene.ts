import { Object3D } from "../objects/Object3D.ts";

export class Scene extends Object3D {
	readonly isScene = true;

	background: string | number | null = null;

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

	override copy(source: Scene): this {
		super.copy(source);

		if (source.background !== null) {
			this.background = source.background;
		}

		return this;
	}

	override toJSON(): Record<string, unknown> {
		const json = super.toJSON();
		json["type"] = "Scene";
		if (this.background !== null) json["background"] = this.background;
		return json;
	}
}
