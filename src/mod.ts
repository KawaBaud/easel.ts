import { OrthoCamera } from "./cameras/OrthoCamera.ts";
import { PerspCamera } from "./cameras/PerspCamera.ts";
import { Color } from "./common/Color.ts";
import { Material } from "./materials/Material.ts";
import { Euler } from "./maths/Euler.ts";
import { Matrix4 } from "./maths/Matrix4.ts";
import { Quaternion } from "./maths/Quaternion.ts";
import { Vector2 } from "./maths/Vector2.ts";
import { Vector3 } from "./maths/Vector3.ts";
import { Mesh } from "./objects/Mesh.ts";
import { CanvasRenderer } from "./renderers/CanvasRenderer.ts";
import { Scene } from "./scenes/Scene.ts";
import { CubeShape } from "./shapes/CubeShape.ts";
import { PlaneShape } from "./shapes/PlaneShape.ts";

export const SCAPE = {
	/* cameras */
	OrthoCamera,
	PerspCamera,

	/* common */
	Color,

	/* materials */
	Material,

	/* maths */
	Euler,
	Matrix4,
	Quaternion,
	Vector2,
	Vector3,

	/* objects */
	Mesh,

	/* renderers */
	CanvasRenderer,

	/* scenes */
	Scene,

	/* shapes */
	CubeShape,
	PlaneShape,
};
