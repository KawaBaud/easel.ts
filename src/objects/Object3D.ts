import { Euler } from "../maths/Euler.ts";
import { Matrix4 } from "../maths/Matrix4.ts";
import { Quaternion } from "../maths/Quaternion.ts";
import { Vector3 } from "../maths/Vector3.ts";

export class Object3D {
	id: string = crypto.randomUUID();
	name = "";

	position = new Vector3();
	rotation = new Euler();
	quaternion: Quaternion = new Quaternion();
	scale = new Vector3(1, 1, 1);

	matrix = new Matrix4();
	worldMatrix = new Matrix4();
	autoUpdateMatrix = true;

	parent: Object3D | null = null;
	children: Object3D[] = [];

	visible = true;
	userData: Record<string, unknown> = {};

	constructor() {
		this.updateMatrix();
	}

	add(object: Object3D): this {
		if (object === this) return this;

		object.parent?.remove(object);
		object.parent = this;
		this.children.push(object);

		return this;
	}

	clone(): Object3D {
		return new Object3D().copy(this);
	}

	copy(source: Object3D, recursive = true): this {
		this.id = crypto.randomUUID();
		this.name = source.name;

		this.position.copy(source.position);
		this.quaternion.copy(source.quaternion);
		this.rotation.copy(source.rotation);
		this.scale.copy(source.scale);

		this.matrix.copy(source.matrix);
		this.worldMatrix.copy(source.worldMatrix);

		this.visible = source.visible;
		this.userData = JSON.parse(JSON.stringify(source.userData));

		if (recursive) {
			for (const child of source.children) {
				this.add(child.clone());
			}
		}
		return this;
	}

	lookAt(target: Vector3): this {
		const m = new Matrix4();
		m.lookAt(this.position, target, new Vector3(0, 1, 0));

		this.quaternion.setFromRotationMatrix(m);
		this.rotation.setFromQuaternion(this.quaternion);

		return this;
	}

	remove(object: Object3D): this {
		const index = this.children.indexOf(object);
		if (index !== -1) {
			object.parent = null;
			this.children.splice(index, 1);
		}

		return this;
	}

	updateMatrix(): void {
		this.matrix.compose(
			this.position,
			this.quaternion,
			this.scale,
		);
	}

	updateWorldMatrix(updateParents = false, updateChildren = true): void {
		if (updateParents && this.parent) {
			this.parent.updateWorldMatrix(true, false);
		}

		if (this.autoUpdateMatrix) this.updateMatrix();
		this.worldMatrix = this.parent
			? this.worldMatrix.mulMatrices(this.parent.worldMatrix, this.matrix)
			: this.worldMatrix.copy(this.matrix);

		if (updateChildren) {
			for (const child of this.children) {
				child.updateWorldMatrix(false, true);
			}
		}
	}
}
