import { PerspectiveCamera as ThreePerspCamera } from "three";
import { createPerspCamera } from "../../../src/cameras/PerspCamera.js";

describe("PerspCamera core", () => {
    test("create / constructor", () => {
        const ourCamera = createPerspCamera();
        const threeCamera = new ThreePerspCamera();

        expect(ourCamera.isPerspCamera).toBe(true);
        expect(threeCamera.isPerspectiveCamera).toBe(true);

        expect(ourCamera.fov).toBe(50);
        expect(threeCamera.fov).toBe(50);

        expect(ourCamera.aspect).toBe(1);
        expect(threeCamera.aspect).toBe(1);

        expect(ourCamera.near).toBe(0.1);
        expect(threeCamera.near).toBe(0.1);

        expect(ourCamera.far).toBe(2000);
        expect(threeCamera.far).toBe(2000);
    });

    test("create - using parameters", () => {
        const fov = 75;
        const aspect = 16 / 9;
        const near = 0.5;
        const far = 1000;

        const ourCamera = createPerspCamera(fov, aspect, near, far);
        const threeCamera = new ThreePerspCamera(fov, aspect, near, far);

        expect(ourCamera.fov).toBe(fov);
        expect(threeCamera.fov).toBe(fov);

        expect(ourCamera.aspect).toBe(aspect);
        expect(threeCamera.aspect).toBe(aspect);

        expect(ourCamera.near).toBe(near);
        expect(threeCamera.near).toBe(near);

        expect(ourCamera.far).toBe(far);
        expect(threeCamera.far).toBe(far);
    });

    test("updateProjectionMatrix", () => {
        const fov = 75;
        const aspect = 16 / 9;
        const near = 0.5;
        const far = 1000;

        const ourCamera = createPerspCamera(fov, aspect, near, far);
        const threeCamera = new ThreePerspCamera(fov, aspect, near, far);

        ourCamera.updateProjectionMatrix();
        threeCamera.updateProjectionMatrix();

        // skip for now as three.js and ours
        // have different matrix formats
    });

    test("copy", () => {
        const ourCameraA = createPerspCamera(75, 16 / 9, 0.5, 1000);
        const ourCameraB = createPerspCamera();

        ourCameraA.position.set(1, 2, 3);
        ourCameraA.rotation.set(0.1, 0.2, 0.3);

        ourCameraB.copy(ourCameraA);

        expect(ourCameraB.fov).toBe(75);
        expect(ourCameraB.aspect).toBe(16 / 9);
        expect(ourCameraB.near).toBe(0.5);
        expect(ourCameraB.far).toBe(1000);

        expect(ourCameraB.position.x).toBe(1);
        expect(ourCameraB.position.y).toBe(2);
        expect(ourCameraB.position.z).toBe(3);

        // skip rotation for now
    });
});
