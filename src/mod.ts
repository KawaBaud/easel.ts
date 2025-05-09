import { OrthoCamera } from "./cameras/OrthoCamera.ts";
import { PerspCamera } from "./cameras/PerspCamera.ts";
import { Color } from "./common/Color.ts";
import { OBJLoader } from "./loaders/OBJLoader.ts";
import { Material } from "./materials/Material.ts";
import { Box3 } from "./maths/Box3.ts";
import { Euler } from "./maths/Euler.ts";
import { Frustum } from "./maths/Frustum.ts";
import { Line3 } from "./maths/Line3.ts";
import { MathUtils } from "./maths/MathUtils.ts";
import { Matrix3 } from "./maths/Matrix3.ts";
import { Matrix4 } from "./maths/Matrix4.ts";
import { Plane } from "./maths/Plane.ts";
import { Quaternion } from "./maths/Quaternion.ts";
import { Sphere } from "./maths/Sphere.ts";
import { Vector2 } from "./maths/Vector2.ts";
import { Vector3 } from "./maths/Vector3.ts";
import { Vector4 } from "./maths/Vector4.ts";
import { Mesh } from "./objects/Mesh.ts";
import { Object3D } from "./objects/Object3D.ts";
import { CanvasRenderer } from "./renderers/CanvasRenderer.ts";
import { Scene } from "./scenes/Scene.ts";
import { CubeShape } from "./shapes/CubeShape.ts";
import { PlaneShape } from "./shapes/PlaneShape.ts";
import { Shape } from "./shapes/Shape.ts";

export const EASEL = {
	/* cameras */
	OrthoCamera,
	PerspCamera,

	/* common */
	Color,

	/* loaders */
	OBJLoader,

	/* materials */
	Material,

	/* maths */
	Box3,
	Euler,
	Frustum,
	Line3,
	MathUtils,
	Matrix3,
	Matrix4,
	Plane,
	Quaternion,
	Sphere,
	Vector2,
	Vector3,
	Vector4,

	/* objects */
	Mesh,
	Object3D,

	/* renderers */
	CanvasRenderer,

	/* scenes */
	Scene,

	/* shapes */
	CubeShape,
	PlaneShape,
	Shape,
};
