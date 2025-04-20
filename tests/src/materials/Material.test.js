import { Material as ThreeMaterial } from "three";
import { createMaterial } from "../../../src/materials/Material.js";

describe("Material core", () => {
    test("create / constructor", () => {
        const ourMaterial = createMaterial();
        const threeMaterial = new ThreeMaterial();

        expect(ourMaterial.isMaterial).toBe(true);
        expect(threeMaterial.isMaterial).toBe(true);

        expect(ourMaterial.colour).toBe(0xFFFFFF);
        expect(ourMaterial.wireframe).toBe(false);
    });

    test("create with options", () => {
        const options = {
            colour: 0x00FF00,
            wireframe: true,
        };

        const ourMaterial = createMaterial(options);

        expect(ourMaterial.colour).toBe(0x00FF00);
        expect(ourMaterial.wireframe).toBe(true);
    });

    test("copy", () => {
        const ourMaterialA = createMaterial({
            colour: 0x00FF00,
            wireframe: true,
        });
        const ourMaterialB = createMaterial();

        ourMaterialB.copy(ourMaterialA);

        expect(ourMaterialB.colour).toBe(0x00FF00);
        expect(ourMaterialB.wireframe).toBe(true);
    });
});
