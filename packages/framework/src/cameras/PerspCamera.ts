import { MathUtils } from "../maths/MathUtils.ts";
import { Camera } from "./Camera.ts";

export class PerspCamera extends Camera {
	constructor(
		public fov = 50,
		public aspect = 1,
		public near = 0.1,
		public far = 2000,
	) {
		super();
		this.name = "PerspCamera";
		this.updateProjectionMatrix();
	}

	override clone(): PerspCamera {
		return new PerspCamera(
			this.fov,
			this.aspect,
			this.near,
			this.far,
		);
	}

	override copy(source: PerspCamera): this {
		super.copy(source);
		this.fov = source.fov;
		this.aspect = source.aspect;
		this.near = source.near;
		this.far = source.far;
		return this;
	}

	override updateProjectionMatrix(): void {
		this.projectionMatrix.makePerspective(
			MathUtils.toRadians(this.fov),
			this.aspect,
			this.near,
			this.far,
		);
	}
}
