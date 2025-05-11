import { Camera } from "./Camera.ts";

export class OrthoCamera extends Camera {
	#left = -1;
	#right = 1;
	#top = 1;
	#bottom = -1;
	#near = 0.1;
	#far = 2000;

	constructor(
		left = -1,
		right = 1,
		top = 1,
		bottom = -1,
		near = 0.1,
		far = 2000,
	) {
		super();

		this.name = "OrthoCamera";
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		this.near = near;
		this.far = far;
		this.updateProjectionMatrix();
	}

	get left(): number {
		return this.#left;
	}

	set left(value: number) {
		this.#left = value;
		this.updateProjectionMatrix();
	}

	get right(): number {
		return this.#right;
	}

	set right(value: number) {
		this.#right = value;
		this.updateProjectionMatrix();
	}

	get top(): number {
		return this.#top;
	}

	set top(value: number) {
		this.#top = value;
		this.updateProjectionMatrix();
	}

	get bottom(): number {
		return this.#bottom;
	}

	set bottom(value: number) {
		this.#bottom = value;
		this.updateProjectionMatrix();
	}

	get near(): number {
		return this.#near;
	}

	set near(value: number) {
		this.#near = value;
		this.updateProjectionMatrix();
	}

	get far(): number {
		return this.#far;
	}

	set far(value: number) {
		this.#far = value;
		this.updateProjectionMatrix();
	}

	override clone(): OrthoCamera {
		return new OrthoCamera(
			this.left,
			this.right,
			this.top,
			this.bottom,
			this.near,
			this.far,
		);
	}

	override copy(source: OrthoCamera): this {
		super.copy(source);

		this.left = source.left;
		this.right = source.right;
		this.top = source.top;
		this.bottom = source.bottom;
		this.near = source.near;
		this.far = source.far;
		return this;
	}

	override updateProjectionMatrix(): void {
		this.projectionMatrix.makeOrthographic(
			this.left,
			this.right,
			this.top,
			this.bottom,
			this.near,
			this.far,
		);
	}
}
