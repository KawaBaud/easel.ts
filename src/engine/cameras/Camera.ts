import { Matrix4 } from "../maths/Matrix4.ts";
import { Object2D } from "../objects/Object2D.ts";

export class Camera extends Object2D {
	readonly isCamera = true;

	projectionMatrix: Matrix4 = new Matrix4();
	matrixWorldInverse: Matrix4 = new Matrix4();

	zoom = 1;

	constructor() {
		super();
		this.name = "Camera";
	}

	updateMatrixWorld(_force = false): void {
		super.updateWorldMatrix(false, false);
		this.matrixWorldInverse.copy(this.worldMatrix).invert();
	}

	updateProjectionMatrix(): void {}

	override clone(): Camera {
		return new Camera().copy(this);
	}

	override copy(source: Camera): this {
		super.copy(source);

		this.zoom = source.zoom;
		this.projectionMatrix.copy(source.projectionMatrix);
		this.matrixWorldInverse.copy(source.matrixWorldInverse);

		return this;
	}
}
