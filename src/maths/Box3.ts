import type { Mesh } from "../objects/Mesh";
import type { Object3D } from "../objects/Object3D";
import { MathUtils } from "./MathUtils";
import type { Sphere } from "./Sphere";
import { Vector3 } from "./Vector3";

export class Box3 {
	#min: Vector3;
	#max: Vector3;

	constructor(min?: Vector3, max?: Vector3) {
		this.#min = min
			? min.clone()
			: new Vector3(
					Number.NEGATIVE_INFINITY,
					Number.NEGATIVE_INFINITY,
					Number.NEGATIVE_INFINITY,
				);
		this.#max = max
			? max.clone()
			: new Vector3(
					-Number.NEGATIVE_INFINITY,
					-Number.NEGATIVE_INFINITY,
					-Number.NEGATIVE_INFINITY,
				);
	}

	get min(): Vector3 {
		return this.#min;
	}

	set min(value: Vector3) {
		this.#min.copy(value);
	}

	get max(): Vector3 {
		return this.#max;
	}

	set max(value: Vector3) {
		this.#max.copy(value);
	}

	get center(): Vector3 {
		return this.#min.clone().add(this.#max).mulScalar(0.5);
	}

	get size(): Vector3 {
		return this.#max.clone().sub(this.#min);
	}

	get width(): number {
		return this.#max.x - this.#min.x;
	}

	get height(): number {
		return this.#max.y - this.#min.y;
	}

	get depth(): number {
		return this.#max.z - this.#min.z;
	}

	get corners(): Vector3[] {
		const { x, y, z } = this.#min;
		const { x: x2, y: y2, z: z2 } = this.#max;

		return [
			new Vector3(x, y, z) /* 0: bottom-left-back */,
			new Vector3(x2, y, z) /* 1: bottom-right-back */,
			new Vector3(x, y2, z) /* 2: top-left-back */,
			new Vector3(x2, y2, z) /* 3: top-right-back */,
			new Vector3(x, y, z2) /* 4: bottom-left-front */,
			new Vector3(x2, y, z2) /* 5: bottom-right-front */,
			new Vector3(x, y2, z2) /* 6: top-left-front */,
			new Vector3(x2, y2, z2) /* 7: top-right-front */,
		];
	}

	get isEmpty(): boolean {
		return (
			this.#max.x < this.#min.x ||
			this.#max.y < this.#min.y ||
			this.#max.z < this.#min.z
		);
	}

	clone(): Box3 {
		return new Box3(this.#min.clone(), this.#max.clone());
	}

	containsBox(box: this): boolean {
		return (
			this.#min.x <= box.min.x &&
			this.#max.x >= box.max.x &&
			this.#min.y <= box.min.y &&
			this.#max.y >= box.max.y &&
			this.#min.z <= box.min.z &&
			this.#max.z >= box.max.z
		);
	}

	containsPoint(point: Vector3): boolean {
		return (
			point.x >= this.#min.x &&
			point.x <= this.#max.x &&
			point.y >= this.#min.y &&
			point.y <= this.#max.y &&
			point.z >= this.#min.z &&
			point.z <= this.#max.z
		);
	}

	copy(box: this): this {
		this.#min.copy(box.min);
		this.#max.copy(box.max);
		return this;
	}

	equals(box: this): boolean {
		return box.min.equals(this.#min) && box.max.equals(this.#max);
	}

	expandByPoint(point: Vector3): this {
		const { x, y, z } = this.#min;
		const { x: x2, y: y2, z: z2 } = this.#max;
		const { x: px, y: py, z: pz } = point;

		this.#min.x = MathUtils.fastMin(x, px);
		this.#min.y = MathUtils.fastMin(y, py);
		this.#min.z = MathUtils.fastMin(z, pz);
		this.#max.x = MathUtils.fastMax(x2, px);
		this.#max.y = MathUtils.fastMax(y2, py);
		this.#max.z = MathUtils.fastMax(z2, pz);
		return this;
	}

	expandByScalar(scalar: number): this {
		this.#min.x -= scalar;
		this.#min.y -= scalar;
		this.#min.z -= scalar;
		this.#max.x += scalar;
		this.#max.y += scalar;
		this.#max.z += scalar;
		return this;
	}

	expandByVector3(v: Vector3): this {
		this.#min.sub(v);
		this.#max.add(v);
		return this;
	}

	getCenter(out: Vector3): Vector3 {
		return out.copy(this.#min).add(this.#max).mulScalar(0.5);
	}

	intersectsBox(box: this): boolean {
		return (
			this.#max.x >= box.min.x &&
			this.#min.x <= box.max.x &&
			this.#max.y >= box.min.y &&
			this.#min.y <= box.max.y &&
			this.#max.z >= box.min.z &&
			this.#min.z <= box.max.z
		);
	}

	intersectsSphere(sphere: Sphere): boolean {
		const closestPoint = new Vector3();
		closestPoint.x = MathUtils.fastMin(
			MathUtils.fastMax(sphere.center.x, this.#min.x),
			this.#max.x,
		);
		closestPoint.y = MathUtils.fastMin(
			MathUtils.fastMax(sphere.center.y, this.#min.y),
			this.#max.y,
		);
		closestPoint.z = MathUtils.fastMin(
			MathUtils.fastMax(sphere.center.z, this.#min.z),
			this.#max.z,
		);
		return (
			closestPoint.clone().sub(sphere.center).lengthSq <=
			sphere.radius * sphere.radius
		);
	}

	makeEmpty(): this {
		this.#min.set(
			Number.NEGATIVE_INFINITY,
			Number.NEGATIVE_INFINITY,
			Number.NEGATIVE_INFINITY,
		);
		this.#max.set(
			-Number.NEGATIVE_INFINITY,
			-Number.NEGATIVE_INFINITY,
			-Number.NEGATIVE_INFINITY,
		);
		return this;
	}

	setFromCenterAndSize(center: Vector3, size: Vector3): this {
		const halfSize = size.clone().mulScalar(0.5);
		this.#min.copy(center).sub(halfSize);
		this.#max.copy(center).add(halfSize);
		return this;
	}

	setFromObject(object: Object3D): this {
		this.makeEmpty();

		const processObject = (object: Object3D) => {
			if (object.isMesh && (object as Mesh).shape?.vertices?.length > 0) {
				const mesh = object as unknown as Mesh;
				const vertices = mesh.shape.vertices;

				object.updateWorldMatrix(false, false);

				for (const vertex of vertices) {
					const worldVertex = vertex.clone().applyMatrix4(object.worldMatrix);
					this.expandByPoint(worldVertex);
				}
			}

			for (const child of object.children) {
				if (child.visible) {
					processObject(child);
				}
			}
		};

		object.updateWorldMatrix(true, false);
		processObject(object);
		return this;
	}

	setFromPoints(points: Vector3[]): this {
		this.makeEmpty();
		for (const point of points) {
			this.expandByPoint(point);
		}
		return this;
	}

	translate(offset: Vector3): this {
		this.#min.add(offset);
		this.#max.add(offset);
		return this;
	}

	union(box: this): this {
		const { x, y, z } = this.#min;
		const { x: x2, y: y2, z: z2 } = this.#max;
		const { x: px, y: py, z: pz } = box.min;
		const { x: px2, y: py2, z: pz2 } = box.max;

		this.#min.x = MathUtils.fastMin(x, px);
		this.#min.y = MathUtils.fastMin(y, py);
		this.#min.z = MathUtils.fastMin(z, pz);
		this.#max.x = MathUtils.fastMax(x2, px2);
		this.#max.y = MathUtils.fastMax(y2, py2);
		this.#max.z = MathUtils.fastMax(z2, pz2);
		return this;
	}
}
