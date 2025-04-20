import { Camera as ThreeCamera } from "three";
import { createCamera } from "../../../src/cameras/Camera.js";

describe("Camera core", () => {
    test("create / constructor", () => {
        const ourCamera = createCamera();
        const threeCamera = new ThreeCamera();

        expect(ourCamera.isCamera).toBe(true);
        expect(threeCamera.isCamera).toBe(true);

        expect(ourCamera.position.x).toBe(0);
        expect(ourCamera.position.y).toBe(0);
        expect(ourCamera.position.z).toBe(0);

        expect(ourCamera.rotation.x).toBe(0);
        expect(ourCamera.rotation.y).toBe(0);
        expect(ourCamera.rotation.z).toBe(0);
        expect(ourCamera.rotation.order).toBe("XYZ");
    });

    test("updateMatrixWorld", () => {
        const ourCamera = createCamera();
        const threeCamera = new ThreeCamera();

        ourCamera.position.set(1, 2, 3);
        threeCamera.position.set(1, 2, 3);

        ourCamera.updateMatrixWorld();
        threeCamera.updateMatrixWorld();

        const ourElements = ourCamera.matrixWorldInverse.elements;
        const threeElements = threeCamera.matrixWorldInverse.elements;

        for (let i = 0; i < 16; i++) {
            expect(ourElements[i]).toBeCloseTo(threeElements[i], 1e-5);
        }
    });

    test("copy", () => {
        const ourCameraA = createCamera();
        const ourCameraB = createCamera();

        ourCameraA.position.set(1, 2, 3);
        ourCameraA.rotation.set(0.1, 0.2, 0.3);
        ourCameraA.projectionMatrix.makeOrthographic(1, 1, 0.1, 100);

        ourCameraB.copy(ourCameraA);

        expect(ourCameraB.position.x).toBe(1);
        expect(ourCameraB.position.y).toBe(2);
        expect(ourCameraB.position.z).toBe(3);

        expect(ourCameraB.rotation.x).toBe(0.1);
        expect(ourCameraB.rotation.y).toBe(0.2);
        expect(ourCameraB.rotation.z).toBe(0.3);

        const matA = ourCameraA.projectionMatrix.elements;
        const matB = ourCameraB.projectionMatrix.elements;
        for (let i = 0; i < 16; i++) {
            expect(matB[i]).toBeCloseTo(matA[i], 1e-5);
        }
    });
});
