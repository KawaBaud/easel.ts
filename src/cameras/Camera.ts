import { Matrix4 } from "../maths/Matrix4";
import { Object3D } from "../objects/Object3D";

export class Camera extends Object3D {
	projectionMatrix = new Matrix4();
	matrixWorldInverse = new Matrix4();

	constructor() {
		super();
		this.name = "Camera";
	}

	updateMatrixWorld(force = false): void {
		super.updateWorldMatrix(force, false);

		this.matrixWorldInverse.copy(this.worldMatrix).invert();
	}

	updateProjectionMatrix(): void {
		throw new Error("EASEL.Camera: must be implemented in subclass");
	}

	override clone(): Camera {
		return new Camera().copy(this);
	}

	override copy(source: this): this {
		super.copy(source);

		this.projectionMatrix.copy(source.projectionMatrix);
		this.matrixWorldInverse.copy(source.matrixWorldInverse);
		return this;
	}
}
