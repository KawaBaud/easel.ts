import { createVector3 } from "../../maths/Vector3.js";
import { createRenderList } from "./RenderList.js";
import { createVertexProcessor } from "./VertexProcessor.js";

/**
 * @typedef {import("../../cameras/Camera.js").Camera} Camera
 * @typedef {import("../../scenes/Scene.js").Scene} Scene
 * @typedef {import("./RenderTarget.js").RenderTarget} RenderTarget
 * @typedef {import("./CullingContext.js").CullingContext} CullingContext
 * @typedef {import("./RenderList.js").RenderList} RenderList
 * @typedef {Object} Pipeline
 */

/**
 * @returns {Pipeline}
 */
export function createPipeline() {
    const _processor = createVertexProcessor();
    const _renderList = createRenderList();

    const _v1 = createVector3();
    const _v2 = createVector3();
    const _v3 = createVector3();

    let _cullingContext = null;

    const _pipeline = {
        /**
         * @type {RenderList}
         */
        renderList: _renderList,

        /**
         * @param {Scene} scene
         * @param {Camera} camera
         * @param {CullingContext} cullingContext
         * @returns {Pipeline}
         */
        cull(scene, camera, cullingContext) {
            _renderList.clear();
            _cullingContext = cullingContext;

            cullingContext.updateFrustum(camera);

            scene.traverseVisible((object) => {
                if (object.isMesh && cullingContext.frustumCull(object)) {
                    _renderList.add(object);
                }
            });

            return _pipeline;
        },

        /**
         * @param {Scene} scene
         * @param {Camera} camera
         * @param {RenderTarget} target
         * @param {Function} renderFunction
         * @returns {Pipeline}
         */
        render(_scene, camera, target, renderFunction) {
            camera.updateMatrixWorld();

            _renderList.depthSort();
            for (let i = 0; i < _renderList.objects.length; i++) {
                const object = _renderList.objects[i];
                if (object.isMesh) {
                    object.updateWorldMatrix(true, false);
                    _renderMesh(object, camera, target, renderFunction);
                }
            }

            return _pipeline;
        },
    };

    /**
     * @param {Object} mesh
     * @param {Camera} camera
     * @param {RenderTarget} target
     * @param {Function} renderFunction
     */
    function _renderMesh(mesh, camera, target, renderFunction) {
        const geometry = mesh.geometry;
        const material = mesh.material;
        if (!geometry || !material) return;

        const colour = `#${material.colour.toString(16).padStart(6, "0")}`;

        if (geometry.indices) {
            const vertices = geometry.vertices;
            const indices = geometry.indices;

            for (let i = 0; i < indices.length; i += 3) {
                const idx1 = indices[i] * 3;
                const idx2 = indices[i + 1] * 3;
                const idx3 = indices[i + 2] * 3;

                _v1.set(vertices[idx1], vertices[idx1 + 1], vertices[idx1 + 2]);
                _v2.set(vertices[idx2], vertices[idx2 + 1], vertices[idx2 + 2]);
                _v3.set(vertices[idx3], vertices[idx3 + 1], vertices[idx3 + 2]);

                _v1.applyMatrix4(mesh.worldMatrix);
                _v2.applyMatrix4(mesh.worldMatrix);
                _v3.applyMatrix4(mesh.worldMatrix);

                const backfaceCulled = material.wireframe
                    ? false
                    : (_cullingContext
                        ? _cullingContext.backfaceCulled
                        : false);

                const projectedPoints = _processor.projectTriangle(
                    _v1,
                    _v2,
                    _v3,
                    camera,
                    target.width,
                    target.height,
                    backfaceCulled,
                );
                if (projectedPoints) {
                    renderFunction(
                        projectedPoints[0],
                        projectedPoints[1],
                        projectedPoints[2],
                        colour,
                    );
                }
            }
        }
    }

    return _pipeline;
}
