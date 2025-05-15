import { Camera } from "./cameras/Camera.ts";
import { OrthoCamera } from "./cameras/OrthoCamera.ts";
import { PerspCamera } from "./cameras/PerspCamera.ts";
import { Clock } from "./common/Clock.ts";
import { Color } from "./common/Color.ts";
import { DirectionalLight } from "./lights/DirectionalLight.ts";
import { Light } from "./lights/Light.ts";
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
import { CanvasUtils } from "./renderers/canvas/CanvasUtils.ts";
import { CanvasRenderer } from "./renderers/CanvasRenderer.ts";
import { FrustumProcessor } from "./renderers/common/FrustumProcessor.ts";
import { Pipeline } from "./renderers/common/Pipeline.ts";
import { Processor } from "./renderers/common/Processor.ts";
import { RenderList } from "./renderers/common/RenderList.ts";
import { RenderPipeline } from "./renderers/common/RenderPipeline.ts";
import { Renderer } from "./renderers/Renderer.ts";
import { Scene } from "./scenes/Scene.ts";
import { CubeShape } from "./shapes/CubeShape.ts";
import { PlaneShape } from "./shapes/PlaneShape.ts";
import { Shape } from "./shapes/Shape.ts";
import { ShapeUtils } from "./shapes/ShapeUtils.ts";

export * from "./types.ts";

export const EASEL = {
	/* cameras */
	Camera,
	OrthoCamera,
	PerspCamera,

	/* common */
	Clock,
	Color,

	/* lights */
	DirectionalLight,
	Light,

	/* loaders */
	OBJLoader,

	/* materials */
	Material,

	/* maths */
	Box3,
	Euler,
	Frustum,
	Line3,
	Math: MathUtils,
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
	CanvasUtils,
	FrustumProcessor,
	Pipeline,
	Processor,
	RenderList,
	RenderPipeline,
	CanvasRenderer,
	Renderer,

	/* scenes */
	Scene,

	/* shapes */
	CubeShape,
	PlaneShape,
	Shape,
	ShapeUtils,
};
