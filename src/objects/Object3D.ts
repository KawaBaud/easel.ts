import { Euler } from "../maths/Euler.ts";
import { Matrix4 } from "../maths/Matrix4.ts";
import { Quaternion } from "../maths/Quaternion.ts";
import { Vector3 } from "../maths/Vector3.ts";

const _position = new Vector3();
const _m1 = new Matrix4();
const _q1 = new Quaternion();

export class Object3D {
	id: string = crypto.randomUUID();
	name = "";

	position = new Vector3();
	#rotation = new Euler();
	#quaternion = new Quaternion();
	scale = new Vector3(1, 1, 1);

	matrix = new Matrix4();
	worldMatrix = new Matrix4();
	autoUpdateMatrix = true;

	parent: Object3D | null = null;
	children: Object3D[] = [];

	visible = true;
	frustumCulled = true;
	userData: Record<string, unknown> = {};

	constructor() {
		this.#rotation.setOnChangeCallback(() => {
			this.#quaternion.setFromEuler(this.#rotation);
		});
		this.updateMatrix();
	}

	get rotation(): Euler {
		return this.#rotation;
	}

	set rotation(value: Euler) {
		this.#rotation.copy(value);
	}

	get quaternion(): Quaternion {
		return this.#quaternion;
	}

	set quaternion(value: Quaternion) {
		this.#quaternion.copy(value);
		this.#rotation.setFromQuaternion(this.#quaternion);
	}

	get isCamera(): boolean {
		return ("projectionMatrix" in this) && ("matrixWorldInverse" in this);
	}

	get isMesh(): boolean {
		return Object.getPrototypeOf(this).constructor.name === "Mesh";
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
		this.updateWorldMatrix(true, false);

		_position.setFromMatrixPosition(this.worldMatrix);

		_m1.lookAt(
			this.isCamera ? _position : target,
			this.isCamera ? target : _position,
			new Vector3(0, 1, 0),
		);

		this.quaternion.setFromRotationMatrix(_m1);

		this.parent &&
			(_m1.extractRotation(this.parent.worldMatrix),
				_q1.setFromRotationMatrix(_m1),
				this.quaternion.premul(_q1.invert()));

		this.rotation.setFromQuaternion(this.quaternion);

		return this;
	}

	remove(object: Object3D): this {
		const index = this.children.indexOf(object);
		index !== -1
			? (object.parent = null, this.children.splice(index, 1))
			: null;
		return this;
	}

	traverse(callback: (node: Object3D) => void): void {
		callback(this);
		for (const child of this.children) child.traverse(callback);
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
