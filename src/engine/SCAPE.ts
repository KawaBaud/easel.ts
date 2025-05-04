import { Camera } from "./cameras/Camera.ts";
import { OrthoCamera } from "./cameras/OrthoCamera.ts";
import { PerspCamera } from "./cameras/PerspCamera.ts";
import { Material } from "./materials/Material.ts";
import { Euler } from "./maths/Euler.ts";
import { MathUtils } from "./maths/MathUtils.ts";
import { Matrix4 } from "./maths/Matrix4.ts";
import { Quaternion } from "./maths/Quaternion.ts";
import { Vector2 } from "./maths/Vector2.ts";
import { Vector3 } from "./maths/Vector3.ts";
import { Mesh } from "./objects/Mesh.ts";
import { Object3D } from "./objects/Object3D.ts";
import { CanvasRenderer } from "./renderers/canvas/CanvasRenderer.ts";
import { Pipeline } from "./renderers/common/Pipeline.ts";
import { Renderer } from "./renderers/Renderer.ts";
import { Scene } from "./scenes/Scene.ts";
import { CubeShape } from "./shapes/CubeShape.ts";
import { PlaneShape } from "./shapes/PlaneShape.ts";
import { Shape } from "./shapes/Shape.ts";

export const SCAPE = {
	// cameras
	Camera,
	OrthoCamera,
	PerspCamera,

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
	Pipeline,
	Renderer,

	// scenes
	Scene,

	// shapes
	CubeShape,
	PlaneShape,
	Shape,
};
