import { Mesh as ThreeMesh } from "three";
import { createCubeShape } from "../../../src/shapes/CubeShape.js";
import { createMaterial } from "../../../src/materials/Material.js";
import { createMesh } from "../../../src/objects/Mesh.js";

describe("Mesh core", () => {
    test("create / constructor", () => {
        const geometry = createCubeShape();
        const material = createMaterial();
        const ourMesh = createMesh(geometry, material);
        const threeMesh = new ThreeMesh();

        expect(ourMesh.isMesh).toBe(true);
        expect(threeMesh.isMesh).toBe(true);

        expect(ourMesh.geometry).toBe(geometry);
        expect(ourMesh.material).toBe(material);
    });

    test("copy", () => {
        const geometry = createCubeShape();
        const material = createMaterial({ colour: 0x00FF00, wireframe: true });
        
        const ourMeshA = createMesh(geometry, material);
        const ourMeshB = createMesh(createCubeShape(), createMaterial());

        ourMeshA.position.set(1, 2, 3);
        ourMeshA.scale.set(2, 2, 2);

        ourMeshB.copy(ourMeshA);

        expect(ourMeshB.geometry).toBe(geometry);
        expect(ourMeshB.material).toBe(material);
        
        expect(ourMeshB.position.x).toBe(1);
        expect(ourMeshB.position.y).toBe(2);
        expect(ourMeshB.position.z).toBe(3);
        
        expect(ourMeshB.scale.x).toBe(2);
        expect(ourMeshB.scale.y).toBe(2);
        expect(ourMeshB.scale.z).toBe(2);
    });
});
