import { createPerspCamera } from "./cameras/PerspCamera.js";
import { createMaterial } from "./materials/Material.js";
import { createEuler } from "./maths/Euler.js";
import { MathsUtils } from "./maths/MathsUtils.js";
import { createMatrix4 } from "./maths/Matrix4.js";
import { createQuaternion } from "./maths/Quaternion.js";
import { createSphere } from "./maths/Sphere.js";
import { createVector3 } from "./maths/Vector3.js";
import { createMesh } from "./objects/Mesh.js";
import { createObject3D } from "./objects/Object3D.js";
import { createQuadMesh } from "./objects/QuadMesh.js";
import { createCanvasRenderer } from "./renderers/canvas/CanvasRenderer.js";
import { createScene } from "./scenes/Scene.js";
import { createCubeShape } from "./shapes/CubeShape.js";
import { createRectangleShape } from "./shapes/RectangleShape.js";
import { createShape } from "./shapes/Shape.js";
import { ShapeUtils } from "./shapes/ShapeUtils.js";

export const MUSI = Object.freeze({
    /* cameras */
    PerspCamera: createPerspCamera,

    /* maths */
    Euler: createEuler,
    Maths: MathsUtils,
    Matrix4: createMatrix4,
    Quaternion: createQuaternion,
    Vector3: createVector3,
    Sphere: createSphere,

    /* materials */
    Material: createMaterial,

    /* objects */
    Mesh: createMesh,
    Object3D: createObject3D,
    QuadMesh: createQuadMesh,

    /* renderers */
    CanvasRenderer: createCanvasRenderer,

    /* scenes */
    Scene: createScene,

    /* shapes */
    CubeShape: createCubeShape,
    RectangleShape: createRectangleShape,
    Shape: createShape,
    ShapeUtils: ShapeUtils,
});
