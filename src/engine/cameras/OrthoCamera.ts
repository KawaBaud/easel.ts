import { Camera } from "./Camera.ts";

export class OrthoCamera extends Camera {
	readonly isOrthoCamera = true;

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

	setSize(width: number, height: number): this {
		const aspect = width / height;
		const halfHeight = 1;
		const halfWidth = halfHeight * aspect;

		this.left = -halfWidth;
		this.right = halfWidth;
		this.top = halfHeight;
		this.bottom = -halfHeight;

		this.updateProjectionMatrix();
		return this;
	}

	override clone(): OrthoCamera {
		return new OrthoCamera(
			this.left,
			this.right,
			this.top,
			this.bottom,
			this.near,
			this.far,
		).copy(this);
	}

	override copy(source: OrthoCamera): this {
		super.copy(source);

		this.left = source.left;
		this.right = source.right;
		this.top = source.top;
		this.bottom = source.bottom;
		this.near = source.near;
		this.far = source.far;
		this.zoom = source.zoom;

		this.projectionMatrix.copy(source.projectionMatrix);
		this.matrixWorldInverse.copy(source.matrixWorldInverse);

		return this;
	}

	override updateMatrixWorld(_force = false): void {
		super.updateWorldMatrix(false, false);
		this.matrixWorldInverse.copy(this.worldMatrix).invert();
	}

	override updateProjectionMatrix(): void {
		const dx = (this.right - this.left) / (2 * this.zoom);
		const dy = (this.top - this.bottom) / (2 * this.zoom);
		const cx = (this.right + this.left) / 2;
		const cy = (this.top + this.bottom) / 2;

		const left = cx - dx;
		const right = cx + dx;
		const top = cy + dy;
		const bottom = cy - dy;

		this.projectionMatrix.makeOrthographic(
			left,
			right,
			top,
			bottom,
			this.near,
			this.far,
		);
	}
}
