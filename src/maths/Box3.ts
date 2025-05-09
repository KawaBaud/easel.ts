import type { Mesh } from "../objects/Mesh.ts";
import type { Object3D } from "../objects/Object3D.ts";
import "../types.ts";
import { MathUtils } from "./MathUtils.ts";
import type { Sphere } from "./Sphere.ts";
import { Vector3 } from "./Vector3.ts";

export class Box3 {
	#min: Vector3;
	#max: Vector3;

	constructor(min?: Vector3, max?: Vector3) {
		this.#min = min ? min.clone() : new Vector3(Infinity, Infinity, Infinity);
		this.#max = max
			? max.clone()
			: new Vector3(-Infinity, -Infinity, -Infinity);
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

	get centre(): Vector3 {
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
		return [
			new Vector3(
				this.#min.x,
				this.#min.y,
				this.#min.z,
			), /* 0: bottom-left-back */
			new Vector3(
				this.#max.x,
				this.#min.y,
				this.#min.z,
			), /* 1: bottom-right-back */
			new Vector3(
				this.#min.x,
				this.#max.y,
				this.#min.z,
			), /* 2: top-left-back */
			new Vector3(
				this.#max.x,
				this.#max.y,
				this.#min.z,
			), /* 3: top-right-back */
			new Vector3(
				this.#min.x,
				this.#min.y,
				this.#max.z,
			), /* 4: bottom-left-front */
			new Vector3(
				this.#max.x,
				this.#min.y,
				this.#max.z,
			), /* 5: bottom-right-front */
			new Vector3(
				this.#min.x,
				this.#max.y,
				this.#max.z,
			), /* 6: top-left-front */
			new Vector3(
				this.#max.x,
				this.#max.y,
				this.#max.z,
			), /* 7: top-right-front */
		];
	}

	get isEmpty(): boolean {
		return (this.#max.x < this.#min.x) || (this.#max.y < this.#min.y) ||
			this.#max.z < this.#min.z;
	}

	clone(): Box3 {
		return new Box3(this.#min.clone(), this.#max.clone());
	}

	containsBox(box: Box3): boolean {
		return (
			(this.#min.x <= box.min.x) &&
			(this.#max.x >= box.max.x) &&
			(this.#min.y <= box.min.y) &&
			(this.#max.y >= box.max.y) &&
			(this.#min.z <= box.min.z) &&
			(this.#max.z >= box.max.z)
		);
	}

	containsPoint(point: Vector3): boolean {
		return (
			(point.x >= this.#min.x) &&
			(point.x <= this.#max.x) &&
			(point.y >= this.#min.y) &&
			(point.y <= this.#max.y) &&
			(point.z >= this.#min.z) &&
			(point.z <= this.#max.z)
		);
	}

	copy(box: Box3): this {
		this.#min.copy(box.min);
		this.#max.copy(box.max);
		return this;
	}

	equals(box: Box3): boolean {
		return box.min.equals(this.#min) && box.max.equals(this.#max);
	}

	expandByPoint(point: Vector3): this {
		this.#min.x = MathUtils.fastMin(this.#min.x, point.x);
		this.#min.y = MathUtils.fastMin(this.#min.y, point.y);
		this.#min.z = MathUtils.fastMin(this.#min.z, point.z);
		this.#max.x = MathUtils.fastMax(this.#max.x, point.x);
		this.#max.y = MathUtils.fastMax(this.#max.y, point.y);
		this.#max.z = MathUtils.fastMax(this.#max.z, point.z);
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

	getCentre(out: Vector3): Vector3 {
		return out.copy(this.#min).add(this.#max).mulScalar(0.5);
	}

	intersectsBox(box: Box3): boolean {
		return (
			(this.#max.x >= box.min.x) &&
			(this.#min.x <= box.max.x) &&
			(this.#max.y >= box.min.y) &&
			(this.#min.y <= box.max.y) &&
			(this.#max.z >= box.min.z) &&
			(this.#min.z <= box.max.z)
		);
	}

	intersectsSphere(sphere: Sphere): boolean {
		const closestPoint = new Vector3();
		closestPoint.x = MathUtils.clamp(sphere.centre.x, this.#min.x, this.#max.x);
		closestPoint.y = MathUtils.clamp(sphere.centre.y, this.#min.y, this.#max.y);
		closestPoint.z = MathUtils.clamp(sphere.centre.z, this.#min.z, this.#max.z);
		return closestPoint.clone().sub(sphere.centre)
			.lengthSq <= (sphere.radius * sphere.radius);
	}

	makeEmpty(): this {
		this.#min.set(Infinity, Infinity, Infinity);
		this.#max.set(-Infinity, -Infinity, -Infinity);
		return this;
	}

	setFromCentreAndSize(centre: Vector3, size: Vector3): this {
		const halfSize = size.clone().mulScalar(0.5);
		this.#min.copy(centre).sub(halfSize);
		this.#max.copy(centre).add(halfSize);
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
				if (child.visible) processObject(child);
			}
		};

		object.updateWorldMatrix(true, false);
		processObject(object);
		return this;
	}

	setFromPoints(points: Vector3[]): this {
		this.makeEmpty();
		for (const point of points) this.expandByPoint(point);
		return this;
	}

	translate(offset: Vector3): this {
		this.#min.add(offset);
		this.#max.add(offset);
		return this;
	}

	union(box: Box3): this {
		this.#min.x = MathUtils.fastMin(this.#min.x, box.min.x);
		this.#min.y = MathUtils.fastMin(this.#min.y, box.min.y);
		this.#min.z = MathUtils.fastMin(this.#min.z, box.min.z);
		this.#max.x = MathUtils.fastMax(this.#max.x, box.max.x);
		this.#max.y = MathUtils.fastMax(this.#max.y, box.max.y);
		this.#max.z = MathUtils.fastMax(this.#max.z, box.max.z);
		return this;
	}
}
