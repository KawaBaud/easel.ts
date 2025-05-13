import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { OrthographicCamera as ThreeOrthoCamera } from "three";
import { OrthoCamera } from "../../src/cameras/OrthoCamera.ts";
import { Maths } from "../../src/maths/Maths.ts";
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
			Maths.EPSILON,
			`${message} (element ${i})`,
		);
	}
}

function compareOrthoCameras(
	ourCamera: OrthoCamera,
	threeCamera: ThreeOrthoCamera,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(`  Our left:   ${ourCamera.left}`);
	console.log(`  Three left: ${threeCamera.left}`);
	console.log(`  Our right:   ${ourCamera.right}`);
	console.log(`  Three right: ${threeCamera.right}`);
	console.log(`  Our top:   ${ourCamera.top}`);
	console.log(`  Three top: ${threeCamera.top}`);
	console.log(`  Our bottom:   ${ourCamera.bottom}`);
	console.log(`  Three bottom: ${threeCamera.bottom}`);
	console.log(`  Our near:   ${ourCamera.near}`);
	console.log(`  Three near: ${threeCamera.near}`);
	console.log(`  Our far:   ${ourCamera.far}`);
	console.log(`  Three far: ${threeCamera.far}`);

	assertEquals(ourCamera.left, threeCamera.left, "left");
	assertEquals(ourCamera.right, threeCamera.right, "right");
	assertEquals(ourCamera.top, threeCamera.top, "top");
	assertEquals(ourCamera.bottom, threeCamera.bottom, "bottom");
	assertEquals(ourCamera.near, threeCamera.near, "near");
	assertEquals(ourCamera.far, threeCamera.far, "far");

	compareMatrices(
		ourCamera.projectionMatrix,
		threeCamera.projectionMatrix,
		`${message} (projectionMatrix)`,
	);
}

Deno.test("OrthoCamera: constructor", () => {
	const a = new OrthoCamera();
	const threeA = new ThreeOrthoCamera(-1, 1, 1, -1, 0.1, 2000);
	assertEquals(a.name, "OrthoCamera");
	assertEquals(a.isCamera, true);
	compareOrthoCameras(a, threeA, "constructor");

	const b = new OrthoCamera(-2, 2, 3, -3, 1, 1000);
	const threeB = new ThreeOrthoCamera(-2, 2, 3, -3, 1, 1000);
	compareOrthoCameras(b, threeB, "constructor (w/ params)");
});

Deno.test("OrthoCamera: clone", () => {
	const a = new OrthoCamera(-2, 2, 3, -3, 1, 1000);
	const b = a.clone();
	const threeA = new ThreeOrthoCamera(-2, 2, 3, -3, 1, 1000);
	const threeB = threeA.clone();
	compareOrthoCameras(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
});

Deno.test("OrthoCamera: copy", () => {
	const a = new OrthoCamera(-2, 2, 3, -3, 1, 1000);
	const b = new OrthoCamera().copy(a);
	const threeA = new ThreeOrthoCamera(-2, 2, 3, -3, 1, 1000);
	const threeB = new ThreeOrthoCamera().copy(threeA);
	compareOrthoCameras(b, threeB, "copy");
	compareOrthoCameras(a, threeA, "copy (original unchanged)");
});

Deno.test("OrthoCamera: updateProjectionMatrix", () => {
	const a = new OrthoCamera(-2, 2, 3, -3, 1, 1000);
	a.left = -5;
	a.right = 5;
	a.top = 4;
	a.bottom = -4;
	a.near = 2;
	a.far = 500;
	a.updateProjectionMatrix();

	const threeA = new ThreeOrthoCamera(-2, 2, 3, -3, 1, 1000);
	threeA.left = -5;
	threeA.right = 5;
	threeA.top = 4;
	threeA.bottom = -4;
	threeA.near = 2;
	threeA.far = 500;
	threeA.updateProjectionMatrix();

	compareMatrices(
		a.projectionMatrix,
		threeA.projectionMatrix,
		"updateProjectionMatrix",
	);
});
