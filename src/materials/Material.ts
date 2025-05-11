import type { ColorType } from "../common/Color.ts";

export interface MaterialOptions {
	color?: ColorType;
	vertexColors?: boolean;
	visible?: boolean;
	opacity?: number;
}

export class Material {
	color: ColorType;
	vertexColors: boolean;
	visible: boolean;
	opacity: number;

	constructor(options: MaterialOptions = {}) {
		this.color = options.color ?? 0xFFFFFF;
		this.vertexColors = options.vertexColors ?? false;
		this.visible = options.visible ?? true;
		this.opacity = options.opacity ?? 1.0;
	}

	clone(): Material {
		return new Material().copy(this);
	}

	copy(source: Material): this {
		this.color = source.color;
		this.vertexColors = source.vertexColors;
		this.visible = source.visible;
		this.opacity = source.opacity;
		return this;
	}
}
