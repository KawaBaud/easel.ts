import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { PerspectiveCamera as ThreePerspCamera } from "three";
import { PerspCamera } from "../../src/cameras/PerspCamera.ts";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import "../../src/types.ts";

function compareMatrices(
	ourMatrix: { elements: Float32Array },
	threeMatrix: { elements: number[] },
	message: string,
): void {
	console.log(`${message}:`);
	console.log(`  Our:   ${Array.from(ourMatrix.elements).join(",")}`);
	console.log(`  Three: ${Array.from(threeMatrix.elements).join(",")}`);

	for (let i = 0; i < 16; i++) {
		assertAlmostEquals(
			ourMatrix.elements.safeAt(i),
			threeMatrix.elements.safeAt(i),
			MathUtils.EPSILON,
			`${message} (element ${i})`,
		);
	}
}

function comparePerspCameras(
	ourCamera: PerspCamera,
	threeCamera: ThreePerspCamera,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(`  Our fov:   ${ourCamera.fov}`);
	console.log(`  Three fov: ${threeCamera.fov}`);
	console.log(`  Our aspect:   ${ourCamera.aspect}`);
	console.log(`  Three aspect: ${threeCamera.aspect}`);
	console.log(`  Our near:   ${ourCamera.near}`);
	console.log(`  Three near: ${threeCamera.near}`);
	console.log(`  Our far:   ${ourCamera.far}`);
	console.log(`  Three far: ${threeCamera.far}`);

	assertEquals(ourCamera.fov, threeCamera.fov, "fov");
	assertEquals(ourCamera.aspect, threeCamera.aspect, "aspect");
	assertEquals(ourCamera.near, threeCamera.near, "near");
	assertEquals(ourCamera.far, threeCamera.far, "far");

	compareMatrices(
		ourCamera.projectionMatrix,
		threeCamera.projectionMatrix,
		`${message} (projectionMatrix)`,
	);
}

Deno.test("PerspCamera: constructor", () => {
	const a = new PerspCamera();
	const threeA = new ThreePerspCamera(50, 1, 0.1, 2000);
	assertEquals(a.name, "PerspCamera");
	assertEquals(a.isCamera, true);
	comparePerspCameras(a, threeA, "constructor");

	const b = new PerspCamera(75, 16 / 9, 1, 1000);
	const threeB = new ThreePerspCamera(75, 16 / 9, 1, 1000);
	comparePerspCameras(b, threeB, "constructor (w/ params)");
});

Deno.test("PerspCamera: clone", () => {
	const a = new PerspCamera(75, 16 / 9, 1, 1000);
	const b = a.clone();
	const threeA = new ThreePerspCamera(75, 16 / 9, 1, 1000);
	const threeB = threeA.clone();
	comparePerspCameras(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("PerspCamera: copy", () => {
	const a = new PerspCamera(75, 16 / 9, 1, 1000);
	const b = new PerspCamera().copy(a);
	const threeA = new ThreePerspCamera(75, 16 / 9, 1, 1000);
	const threeB = new ThreePerspCamera().copy(threeA);
	comparePerspCameras(b, threeB, "copy");
	comparePerspCameras(a, threeA, "copy (original unchanged)");
});

Deno.test("PerspCamera: updateProjectionMatrix", () => {
	const a = new PerspCamera(75, 16 / 9, 1, 1000);
	a.fov = 60;
	a.aspect = 4 / 3;
	a.near = 0.5;
	a.far = 500;
	a.updateProjectionMatrix();

	const threeA = new ThreePerspCamera(75, 16 / 9, 1, 1000);
	threeA.fov = 60;
	threeA.aspect = 4 / 3;
	threeA.near = 0.5;
	threeA.far = 500;
	threeA.updateProjectionMatrix();

	compareMatrices(
		a.projectionMatrix,
		threeA.projectionMatrix,
		"updateProjectionMatrix",
	);
});
