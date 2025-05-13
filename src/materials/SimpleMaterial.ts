import { Material, type MaterialOptions } from "./Material.ts";

export interface SimpleMaterialOptions extends MaterialOptions {
	fog?: boolean;
	wireframe?: boolean;
}

export class SimpleMaterial extends Material {
	fog: boolean;
	wireframe: boolean;

	constructor(options: SimpleMaterialOptions = {}) {
		super(options);
		this.fog = options.fog ?? true;
		this.wireframe = options.wireframe ?? false;
	}

	override clone(): SimpleMaterial {
		return new SimpleMaterial().copy(this);
	}

	override copy(source: SimpleMaterial): this {
		super.copy(source);

		this.fog = source.fog;
		this.wireframe = source.wireframe;
		return this;
	}
}
