import { Material, type MaterialOptions } from "./Material.ts";

export interface SimpleMaterialOptions extends MaterialOptions {
	wireframe?: boolean;
	flatShading?: boolean;
}

export class SimpleMaterial extends Material {
	wireframe: boolean;
	flatShaded: boolean;

	constructor(options: SimpleMaterialOptions = {}) {
		super(options);
		this.wireframe = options.wireframe ?? false;
		this.flatShaded = options.flatShading ?? false;
	}

	override clone(): SimpleMaterial {
		return new SimpleMaterial().copy(this);
	}

	override copy(source: SimpleMaterial): this {
		super.copy(source);

		this.wireframe = source.wireframe;
		this.flatShaded = source.flatShaded;
		return this;
	}
}
