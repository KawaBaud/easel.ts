import { type ColorValue, Side } from "../types.ts";

export interface MaterialOptions {
	color?: ColorValue;
	opacity?: number;
	dithering?: boolean;
	side?: Side;
	vertexColors?: boolean;
	visible?: boolean;
	fog?: boolean;
	wireframe?: boolean;
}

export class Material {
	color: ColorValue;
	opacity: number;
	dithering: boolean;
	side: Side;
	vertexColors: boolean;
	visible: boolean;
	fog: boolean;
	wireframe: boolean;

	constructor(options: MaterialOptions = {}) {
		this.color = options.color ?? 0xFFFFFF;
		this.opacity = options.opacity ?? 1.0;
		this.dithering = options.dithering ?? false;
		this.side = options.side ?? Side.FRONT;
		this.vertexColors = options.vertexColors ?? false;
		this.visible = options.visible ?? true;
		this.fog = options.fog ?? true;
		this.wireframe = options.wireframe ?? false;
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
		this.fog = source.fog;
		this.wireframe = source.wireframe;
		return this;
	}
}
