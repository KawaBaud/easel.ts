import { createVector3 } from "../../maths/Vector3.js";
import { createRenderList } from "./RenderList.js";
import { createVertexProcessor } from "./VertexProcessor.js";

/**
 * @typedef {import("../../cameras/Camera.js").Camera} Camera
 * @typedef {import("../../scenes/Scene.js").Scene} Scene
 * @typedef {import("./RenderTarget.js").RenderTarget} RenderTarget
 * @typedef {import("./CullingContext.js").CullingContext} CullingContext
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

    const _pipeline = {
        /**
         * @returns {import("./RenderList.js").RenderList}
         */
        get renderList() {
            return _renderList;
        },

        /**
         * @param {Scene} scene
         * @param {Camera} camera
         * @param {CullingContext} cullingContext
         * @returns {Pipeline}
         */
        cull(scene, camera, cullingContext) {
            _renderList.clear();

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
            _renderList.objects.forEach((object) => {
                if (object.isMesh) {
                    object.updateWorldMatrix(true, false);
                    _renderMesh(object, camera, target, renderFunction);
                }
            });

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

                const p1 = _processor.projectVertex(
                    _v1,
                    camera,
                    target.width,
                    target.height,
                );
                const p2 = _processor.projectVertex(
                    _v2,
                    camera,
                    target.width,
                    target.height,
                );
                const p3 = _processor.projectVertex(
                    _v3,
                    camera,
                    target.width,
                    target.height,
                );
                if (p1 && p2 && p3) renderFunction(p1, p2, p3, colour);
            }
        }
    }
    return _pipeline;
}
