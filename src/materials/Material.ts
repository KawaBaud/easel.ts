import type { ColorType } from "../common/Color.ts";
import { Side } from "../consts.ts";

export interface MaterialOptions {
	color?: ColorType;
	opacity?: number;
	dithering?: boolean;
	side?: Side;
	vertexColors?: boolean;
	visible?: boolean;
}

export class Material {
	color: ColorType;
	opacity: number;
	dithering: boolean;
	side: Side;
	vertexColors: boolean;
	visible: boolean;

	constructor(options: MaterialOptions = {}) {
		this.color = options.color ?? 0xFFFFFF;
		this.opacity = options.opacity ?? 1.0;
		this.dithering = options.dithering ?? false;
		this.side = options.side ?? Side.FRONT;
		this.vertexColors = options.vertexColors ?? false;
		this.visible = options.visible ?? true;
	}

	clone(): Material {
		return new Material().copy(this);
	}

	copy(source: Material): this {
		this.color = source.color;
		this.opacity = source.opacity;
		this.dithering = source.dithering;
		this.side = source.side;
		this.vertexColors = source.vertexColors;
		this.visible = source.visible;
		return this;
	}
}
