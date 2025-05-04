import type { ColorValue } from "../common/Color.ts";

export interface MaterialOptions {
	color?: ColorValue;
	wireframe?: boolean;
}

export class Material {
	color: ColorValue;
	wireframe: boolean;

	constructor(options: MaterialOptions = {}) {
		this.color = options.color ?? 0xFFFFFF;
		this.wireframe = options.wireframe ?? false;
	}

	clone(): Material {
		return new Material().copy(this);
	}

	copy(source: Material): this {
		this.color = source.color;
		this.wireframe = source.wireframe;
		return this;
	}
}
