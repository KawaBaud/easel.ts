import { Matrix4 } from "../maths/Matrix4.ts";
import { Object3D } from "../objects/Object3D.ts";

export class Camera extends Object3D {
	readonly isCamera = true;

	projectionMatrix = new Matrix4();
	matrixWorldInverse = new Matrix4();

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

		this.projectionMatrix.copy(source.projectionMatrix);
		this.matrixWorldInverse.copy(source.matrixWorldInverse);

		return this;
	}
}
