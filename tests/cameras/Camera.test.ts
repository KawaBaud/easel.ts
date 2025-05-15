import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { Camera as ThreeCamera } from "three";
import "../../extensions/array.extension.ts";
import { Camera } from "../../src/cameras/Camera.ts";
import { MathUtils } from "../../src/maths/MathUtils.ts";

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

function compareCameras(
	ourCamera: Camera,
	threeCamera: ThreeCamera,
	message: string,
): void {
	console.log(`${message}:`);
	compareMatrices(
		ourCamera.projectionMatrix,
		threeCamera.projectionMatrix,
		`${message} (projectionMatrix)`,
	);
	compareMatrices(
		ourCamera.matrixWorldInverse,
		threeCamera.matrixWorldInverse,
		`${message} (matrixWorldInverse)`,
	);
}

Deno.test("Camera: constructor", () => {
	const a = new Camera();
	const threeA = new ThreeCamera();

	assertEquals(a.name, "Camera");
	assertEquals(a.isCamera, true);

	compareMatrices(
		a.projectionMatrix,
		threeA.projectionMatrix,
		"constructor (projectionMatrix)",
	);
	compareMatrices(
		a.matrixWorldInverse,
		threeA.matrixWorldInverse,
		"constructor (matrixWorldInverse)",
	);
});

Deno.test("Camera: clone", () => {
	const a = new Camera();
	a.projectionMatrix.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
	a.matrixWorldInverse.set(
		16,
		15,
		14,
		13,
		12,
		11,
		10,
		9,
		8,
		7,
		6,
		5,
		4,
		3,
		2,
		1,
	);

	const b = a.clone();

	const threeA = new ThreeCamera();
	threeA.projectionMatrix.set(
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
	);
	threeA.matrixWorldInverse.set(
		16,
		15,
		14,
		13,
		12,
		11,
		10,
		9,
		8,
		7,
		6,
		5,
		4,
		3,
		2,
		1,
	);

	const threeB = threeA.clone();

	compareCameras(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
	assertNotStrictEquals(
		a.projectionMatrix,
		b.projectionMatrix,
		"clone creates new projectionMatrix",
	);
	assertNotStrictEquals(
		a.matrixWorldInverse,
		b.matrixWorldInverse,
		"clone creates new matrixWorldInverse",
	);
});

Deno.test("Camera: copy", () => {
	const a = new Camera();
	a.projectionMatrix.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
	a.matrixWorldInverse.set(
		16,
		15,
		14,
		13,
		12,
		11,
		10,
		9,
		8,
		7,
		6,
		5,
		4,
		3,
		2,
		1,
	);

	const b = new Camera().copy(a);

	const threeA = new ThreeCamera();
	threeA.projectionMatrix.set(
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
	);
	threeA.matrixWorldInverse.set(
		16,
		15,
		14,
		13,
		12,
		11,
		10,
		9,
		8,
		7,
		6,
		5,
		4,
		3,
		2,
		1,
	);

	const threeB = new ThreeCamera().copy(threeA);

	compareCameras(b, threeB, "copy");
	compareCameras(a, threeA, "copy (original unchanged)");
});

Deno.test("Camera: updateMatrixWorld", () => {
	const a = new Camera();
	a.position.set(1, 2, 3);
	a.updateMatrixWorld();

	const threeA = new ThreeCamera();
	threeA.position.set(1, 2, 3);
	threeA.updateMatrixWorld();

	compareMatrices(
		a.matrixWorldInverse,
		threeA.matrixWorldInverse,
		"updateMatrixWorld",
	);
});
