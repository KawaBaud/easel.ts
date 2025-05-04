import { Camera } from "./Camera.ts";

export class OrthoCamera extends Camera {
	readonly isOrthoCamera: boolean = true;

	constructor(
		public left = -1,
		public right = 1,
		public top = 1,
		public bottom = -1,
		public near = 0.1,
		public far = 2000,
	) {
		super();
		this.name = "OrthoCamera";
		this.updateProjectionMatrix();
	}

	override clone(): OrthoCamera {
		return new OrthoCamera(
			this.left,
			this.right,
			this.top,
			this.bottom,
			this.near,
			this.far,
		);
	}

	override copy(source: OrthoCamera): this {
		super.copy(source);
		this.left = source.left;
		this.right = source.right;
		this.top = source.top;
		this.bottom = source.bottom;
		this.near = source.near;
		this.far = source.far;
		return this;
	}

	override updateProjectionMatrix(): void {
		this.projectionMatrix.makeOrthographic(
			this.left,
			this.right,
			this.top,
			this.bottom,
			this.near,
			this.far,
		);
	}
}
