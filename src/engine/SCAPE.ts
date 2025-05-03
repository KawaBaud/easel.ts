import { Camera } from "./cameras/Camera.ts";
import { IsometricCamera } from "./cameras/IsometricCamera.ts";
import { OrthoCamera } from "./cameras/OrthoCamera.ts";
import { Euler } from "./maths/Euler.ts";
import { MathUtils } from "./maths/MathUtils.ts";
import { Matrix4 } from "./maths/Matrix4.ts";
import { Quaternion } from "./maths/Quaternion.ts";
import { Vector2 } from "./maths/Vector2.ts";
import { Vector3 } from "./maths/Vector3.ts";
import { Object2D } from "./objects/Object2D.ts";
import { CanvasRenderer } from "./renderers/CanvasRenderer.ts";
import { Scene } from "./scenes/Scene.ts";

export const SCAPE = {
	// cameras
	Camera,
	IsometricCamera,
	OrthoCamera,

	// maths
	Math: MathUtils,
	Vector2,
	Vector3,
	Matrix4,
	Quaternion,
	Euler,

	// objects
	Object2D,

	// renderers
	CanvasRenderer,

	// scenes
	Scene,
};
