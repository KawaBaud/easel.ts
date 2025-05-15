import { Color } from "../common/Color.ts";
import { Object3D } from "../objects/Object3D.ts";
import type { ColorValue } from "../types/color.types.ts";

export class Light extends Object3D {
	#color = new Color(1, 1, 1);
	#intensity = 1;

	constructor(color?: ColorValue, intensity = 1) {
		super();

		this.name = "Light";
		this.color !== undefined ? this.color : color;
		this.intensity = intensity;
	}

	get color(): Color {
		return this.#color;
	}

	set color(value: ColorValue) {
		value instanceof Color ? this.#color.copy(value) : this.#color.parse(value);
	}

	get intensity(): number {
		return this.#intensity;
	}

	set intensity(value: number) {
		this.#intensity = value;
	}

	override clone(): Light {
		return new Light(this.color, this.intensity).copy(this);
	}

	override copy(source: Light): this {
		super.copy(source);

		this.color = source.color;
		this.intensity = source.intensity;
		return this;
	}
}
