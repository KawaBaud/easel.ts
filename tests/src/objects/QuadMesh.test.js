import { createMaterial } from "../../../src/materials/Material.js";
import { createQuadMesh } from "../../../src/objects/QuadMesh.js";

describe("QuadMesh core", () => {
    test("create / constructor", () => {
        const material = createMaterial({ colour: 0xFF0000 });
        const quadMesh = createQuadMesh(2, 3, material);

        expect(quadMesh.isQuadMesh).toBe(true);
        expect(quadMesh.isMesh).toBe(true);
        expect(quadMesh.isObject3D).toBe(true);

        expect(quadMesh.geometry).toBeDefined();
        expect(quadMesh.material).toBe(material);
        
        expect(quadMesh.geometry.vertices).toBeInstanceOf(Float32Array);
        expect(quadMesh.geometry.normals).toBeInstanceOf(Float32Array);
        expect(quadMesh.geometry.uvs).toBeInstanceOf(Float32Array);
        expect(quadMesh.geometry.indices).toBeInstanceOf(Uint16Array);
        
        expect(quadMesh.geometry.indices.length).toBe(6); // 2 triangles * 3 indices
    });

    test("triangulation", () => {
        const quadMesh = createQuadMesh();
        
        // Check that indices form two triangles
        expect(quadMesh.geometry.indices.length).toBe(6);
        
        // First triangle: 0, 1, 2
        expect(quadMesh.geometry.indices[0]).toBe(0);
        expect(quadMesh.geometry.indices[1]).toBe(1);
        expect(quadMesh.geometry.indices[2]).toBe(2);
        
        // Second triangle: 0, 2, 3
        expect(quadMesh.geometry.indices[3]).toBe(0);
        expect(quadMesh.geometry.indices[4]).toBe(2);
        expect(quadMesh.geometry.indices[5]).toBe(3);
    });

    test("copy", () => {
        const material = createMaterial({ colour: 0x00FF00 });
        const quadMeshA = createQuadMesh(2, 3, material);
        const quadMeshB = createQuadMesh(1, 1);
        
        quadMeshA.position.set(1, 2, 3);
        quadMeshA.scale.set(2, 2, 2);
        
        quadMeshB.copy(quadMeshA);
        
        expect(quadMeshB.material).toBe(material);
        expect(quadMeshB.position.x).toBe(1);
        expect(quadMeshB.position.y).toBe(2);
        expect(quadMeshB.position.z).toBe(3);
        expect(quadMeshB.scale.x).toBe(2);
        expect(quadMeshB.scale.y).toBe(2);
        expect(quadMeshB.scale.z).toBe(2);
    });
});
