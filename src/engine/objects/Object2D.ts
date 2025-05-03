import { Matrix4 } from "../maths/Matrix4.ts";
import { Quaternion } from "../maths/Quaternion.ts";
import { Vector2 } from "../maths/Vector2.ts";
import { Vector3 } from "../maths/Vector3.ts";
import type { Cloneable, Copyable, Serializable } from "../types/interfaces.ts";
import { get } from "../utils.ts";

export class Object2D
	implements Cloneable<Object2D>, Copyable<Object2D>, Serializable {
	readonly isObject2D = true;

	id: string = crypto.randomUUID();
	name = "";

	position: Vector2 = new Vector2();
	rotation = 0;
	scale: Vector2 = new Vector2(1, 1);

	matrix: Matrix4 = new Matrix4();
	worldMatrix: Matrix4 = new Matrix4();

	parent: Object2D | null = null;
	children: Object2D[] = [];

	visible = true;
	userData: Record<string, unknown> = {};

	constructor() {
		this.updateMatrix();
	}

	add(object: Object2D): this {
		if (object === this) return this;

		object.parent?.remove(object);
		object.parent = this;
		this.children.push(object);

		return this;
	}

	clone(): Object2D {
		return new Object2D().copy(this);
	}

	copy(source: Object2D): this {
		this.id = crypto.randomUUID();
		this.name = source.name;

		this.position.copy(source.position);
		this.rotation = source.rotation;
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

	fromArray(array: number[], offset = 0): this {
		this.position.fromArray(array, offset);
		this.rotation = get(array, offset + 2);
		this.scale.fromArray(array, offset + 3);
		return this;
	}

	getObjectById(id: string): Object2D | undefined {
		if (this.id === id) return this;

		for (const child of this.children) {
			const object = child.getObjectById(id);
			if (object) return object;
		}

		return undefined;
	}

	getObjectByName(name: string): Object2D | undefined {
		if (this.name === name) return this;

		for (const child of this.children) {
			const object = child.getObjectByName(name);
			if (object) return object;
		}

		return undefined;
	}

	remove(object: Object2D): this {
		const index = this.children.indexOf(object);
		if (index !== -1) {
			object.parent = null;
			this.children.splice(index, 1);
		}

		return this;
	}

	removeFromParent(): this {
		if (this.parent) {
			this.parent.remove(this);
		}

		return this;
	}

	toArray(array: number[] = [], offset = 0): number[] {
		this.position.toArray(array, offset);
		array[offset + 2] = this.rotation;
		this.scale.toArray(array, offset + 3);
		return array;
	}

	toJSON(): Record<string, unknown> {
		const output: Record<string, unknown> = {
			id: this.id,
			name: this.name,
			type: "Object2D",
			position: [this.position.x, this.position.y],
			rotation: this.rotation,
			scale: [this.scale.x, this.scale.y],
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

	traverse(callback: (object: Object2D) => void): void {
		callback(this);

		for (const child of this.children) {
			child.traverse(callback);
		}
	}

	traverseVisible(callback: (object: Object2D) => void): void {
		if (!this.visible) return;

		callback(this);

		for (const child of this.children) {
			child.traverseVisible(callback);
		}
	}

	updateMatrix(): void {
		this.matrix.compose(
			new Vector3(this.position.x, this.position.y, 0),
			new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), this.rotation),
			new Vector3(this.scale.x, this.scale.y, 1),
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
