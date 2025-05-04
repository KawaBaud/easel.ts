import type { Cloneable, Copyable } from "../types/interfaces.ts";

export interface MaterialOptions {
	color?: number;
	wireframe?: boolean;
}

export class Material implements Cloneable<Material>, Copyable<Material> {
	readonly isMaterial: boolean = true;

	color: number;
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
