import { Euler } from "../maths/Euler.ts";
import { Matrix4 } from "../maths/Matrix4.ts";
import { Quaternion } from "../maths/Quaternion.ts";
import { Vector3 } from "../maths/Vector3.ts";
import type { Cloneable, Copyable } from "../types/interfaces.ts";

export class Object3D implements Cloneable<Object3D>, Copyable<Object3D> {
	readonly isObject3D: boolean = true;

	id: string = crypto.randomUUID();
	name = "";

	position: Vector3 = new Vector3();
	rotation: Euler = new Euler();
	quaternion: Quaternion = new Quaternion();
	scale: Vector3 = new Vector3(1, 1, 1);

	matrix: Matrix4 = new Matrix4();
	worldMatrix: Matrix4 = new Matrix4();

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

	copy(source: Object3D): this {
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

		for (const child of source.children) {
			this.add(child.clone());
		}

		return this;
	}

	getObjectById(id: string): Object3D | undefined {
		if (this.id === id) return this;

		for (const child of this.children) {
			const object = child.getObjectById(id);
			if (object) return object;
		}

		return undefined;
	}

	getObjectByName(name: string): Object3D | undefined {
		if (this.name === name) return this;

		for (const child of this.children) {
			const object = child.getObjectByName(name);
			if (object) return object;
		}

		return undefined;
	}

	lookAt(target: Vector3): this {
		const position = this.position;
		const direction = new Vector3().subVectors(target, position);
		direction.unitize();
		if (direction.lengthSq === 0) return this;

		const m = new Matrix4();
		m.lookAt(position, target, new Vector3(0, 1, 0));

		const position2 = new Vector3();
		const quaternion2 = new Quaternion();
		const scale = new Vector3();
		m.decompose(position2, quaternion2, scale);

		this.quaternion.copy(quaternion2);
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

	removeFromParent(): this {
		if (this.parent) this.parent.remove(this);
		return this;
	}

	toJSON(): Record<string, unknown> {
		const output: Record<string, unknown> = {
			id: this.id,
			name: this.name,
			type: "Object3D",
			position: [this.position.x, this.position.y, this.position.z],
			rotation: [
				this.rotation.x,
				this.rotation.y,
				this.rotation.z,
				this.rotation.order,
			],
			scale: [this.scale.x, this.scale.y, this.scale.z],
			visible: this.visible,
			userData: this.userData,
		};
		return {
			...output,
			...(this.children.length > 0
				? { children: this.children.map((child) => child.toJSON()) }
				: {}),
		};
	}

	traverse(callback: (object: Object3D) => void): void {
		callback(this);

		for (const child of this.children) {
			child.traverse(callback);
		}
	}

	traverseVisible(callback: (object: Object3D) => void): void {
		if (!this.visible) return;

		callback(this);

		for (const child of this.children) {
			child.traverseVisible(callback);
		}
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
		this.updateMatrix();

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
