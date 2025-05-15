import { MathUtils } from "../maths/MathUtils.ts";
import { Camera } from "./Camera.ts";

export class PerspCamera extends Camera {
	#fov = 50;
	#aspect = 1;
	#near = 0.1;
	#far = 2000;

	constructor(
		fov = 50,
		aspect = 1,
		near = 0.1,
		far = 2000,
	) {
		super();

		this.name = "PerspCamera";
		this.fov = fov;
		this.aspect = aspect;
		this.near = near;
		this.far = far;
		this.updateProjectionMatrix();
	}

	get fov(): number {
		return this.#fov;
	}

	set fov(value: number) {
		this.#fov = value;
		this.updateProjectionMatrix();
	}

	get aspect(): number {
		return this.#aspect;
	}

	set aspect(value: number) {
		this.#aspect = value;
		this.updateProjectionMatrix();
	}

	get near(): number {
		return this.#near;
	}

	set near(value: number) {
		this.#near = value;
	}

	get far(): number {
		return this.#far;
	}

	set far(value: number) {
		this.#far = value;
		this.updateProjectionMatrix();
	}

	override clone(): PerspCamera {
		return new PerspCamera(
			this.fov,
			this.aspect,
			this.near,
			this.far,
		);
	}

	override copy(source: PerspCamera): this {
		super.copy(source);

		this.fov = source.fov;
		this.aspect = source.aspect;
		this.near = source.near;
		this.far = source.far;
		return this;
	}

	override updateProjectionMatrix(): void {
		this.projectionMatrix.makePerspective(
			MathUtils.toRadians(this.fov),
			this.aspect,
			this.near,
			this.far,
		);
	}
}
