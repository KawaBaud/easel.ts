import { REVISION } from "./consts";

if (typeof window !== "undefined") {
	if (window.__easel__) {
		console.warn("multiple instances of Easel.js in same page");
	} else {
		window.__easel__ = REVISION;
	}
}

// biome-ignore lint/performance/noBarrelFile: library entry point
export { Camera } from "./cameras/Camera";
export { OrthoCamera } from "./cameras/OrthoCamera";
export { PerspCamera } from "./cameras/PerspCamera";

export { Clock } from "./common/Clock";
export { Color } from "./common/Color";

export { DirectionalLight } from "./lights/DirectionalLight";
export { Light } from "./lights/Light";

export { ObjLoader } from "./loaders/ObjLoader";

export { Material } from "./materials/Material";

export { Box3 } from "./maths/Box3";
export { Euler } from "./maths/Euler";
export { Frustum } from "./maths/Frustum";
export { Line3 } from "./maths/Line3";
export { MathUtils } from "./maths/MathUtils";
export { Matrix3 } from "./maths/Matrix3";
export { Matrix4 } from "./maths/Matrix4";
export { Plane } from "./maths/Plane";
export { Quaternion } from "./maths/Quaternion";
export { Sphere } from "./maths/Sphere";
export { Vector2 } from "./maths/Vector2";
export { Vector3 } from "./maths/Vector3";
export { Vector4 } from "./maths/Vector4";

export { Mesh } from "./objects/Mesh";
export { Object3D } from "./objects/Object3D";

export { CanvasRenderer } from "./renderers/CanvasRenderer";
export { CanvasUtils } from "./renderers/canvas/CanvasUtils";
export { FrustumProcessor } from "./renderers/common/FrustumProcessor";
export { Pipeline } from "./renderers/common/Pipeline";
export { Processor } from "./renderers/common/Processor";
export { RenderList } from "./renderers/common/RenderList";
export { RenderPipeline } from "./renderers/common/RenderPipeline";
export { Renderer } from "./renderers/Renderer";

export { Scene } from "./scenes/Scene";

export { CubeShape } from "./shapes/CubeShape";
export { PlaneShape } from "./shapes/PlaneShape";
export { Shape } from "./shapes/Shape";
export { ShapeUtils } from "./shapes/ShapeUtils";
