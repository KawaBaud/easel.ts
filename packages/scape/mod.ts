import { Camera } from "./src/cameras/Camera.ts";
import { OrthoCamera } from "./src/cameras/OrthoCamera.ts";
import { PerspCamera } from "./src/cameras/PerspCamera.ts";
import { Color } from "./src/common/Color.ts";
import { Material } from "./src/materials/Material.ts";
import { Euler } from "./src/maths/Euler.ts";
import { MathUtils } from "./src/maths/MathUtils.ts";
import { Matrix4 } from "./src/maths/Matrix4.ts";
import { Quaternion } from "./src/maths/Quaternion.ts";
import { Vector2 } from "./src/maths/Vector2.ts";
import { Vector3 } from "./src/maths/Vector3.ts";
import { Mesh } from "./src/objects/Mesh.ts";
import { Object3D } from "./src/objects/Object3D.ts";
import { CanvasRenderer } from "./src/renderers/canvas/CanvasRenderer.ts";
import { Scene } from "./src/scenes/Scene.ts";
import { CubeShape } from "./src/shapes/CubeShape.ts";
import { PlaneShape } from "./src/shapes/PlaneShape.ts";
import { Shape } from "./src/shapes/Shape.ts";

export const SCAPE = {
	// cameras
	Camera,
	OrthoCamera,
	PerspCamera,

	// common
	Color,

	// materials
	Material,

	// maths
	Math: MathUtils,
	Vector2,
	Vector3,
	Matrix4,
	Quaternion,
	Euler,

	// objects
	Object3D,
	Mesh,

	// renderers
	CanvasRenderer,

	// scenes
	Scene,

	// shapes
	CubeShape,
	PlaneShape,
	Shape,
};
