import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Euler as ThreeEuler,
	Matrix4 as ThreeMatrix4,
	Quaternion as ThreeQuaternion,
	Vector3 as ThreeVector3,
} from "three";
import { Euler } from "../../src/maths/Euler.ts";
import { Maths } from "../../src/maths/Maths.ts";
import { Matrix4 } from "../../src/maths/Matrix4.ts";
import { Quaternion } from "../../src/maths/Quaternion.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";
import "../../src/types.ts";

function compareMatrices(
	ourMatrix: Matrix4,
	threeMatrix: ThreeMatrix4,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(`  Our:   ${ourMatrix.elements}`);
	console.log(`  Three: ${threeMatrix.elements}`);

	for (let i = 0; i < 16; i++) {
		assertAlmostEquals(
			ourMatrix.elements.safeAt(i),
			threeMatrix.elements.safeAt(i),
			Maths.EPSILON,
			`${message} (element ${i})`,
		);
	}
}

Deno.test("Matrix4: constructor", () => {
	const a = new Matrix4();
	const threeA = new ThreeMatrix4();
	compareMatrices(a, threeA, "constructor");

	const elements = new Float32Array([
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
	]);

	const threeB = new ThreeMatrix4().set(
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

	const threeElements = threeB.elements;
	assertEquals(elements[0], threeElements[0], "first element");
	assertEquals(elements[5], threeElements[5], "second row, second column");
});

Deno.test("Matrix4: clone", () => {
	const a = new Matrix4().set(
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
	const b = a.clone();
	const threeA = new ThreeMatrix4().set(
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
	const threeB = threeA.clone();
	compareMatrices(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
	assertNotStrictEquals(
		a.elements,
		b.elements,
		"clone creates new elements array",
	);
});

Deno.test("Matrix4: copy", () => {
	const a = new Matrix4().set(
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
	const b = new Matrix4().copy(a);
	const threeA = new ThreeMatrix4().set(
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
	const threeB = new ThreeMatrix4().copy(threeA);
	compareMatrices(b, threeB, "copy");
	compareMatrices(a, threeA, "copy (original unchanged)");
});

Deno.test("Matrix4: compose", () => {
	const position = new Vector3(1, 2, 3);
	const quaternion = new Quaternion(0.1, 0.2, 0.3, 0.4).unitize();
	const scale = new Vector3(2, 3, 4);

	const threePosition = new ThreeVector3(1, 2, 3);
	const threeQuaternion = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).normalize();
	const threeScale = new ThreeVector3(2, 3, 4);

	const a = new Matrix4().compose(position, quaternion, scale);
	const threeA = new ThreeMatrix4().compose(
		threePosition,
		threeQuaternion,
		threeScale,
	);
	compareMatrices(a, threeA, "compose");
});

Deno.test("Matrix4: decompose", () => {
	const m = new Matrix4().set(
		2,
		0,
		0,
		1,
		0,
		3,
		0,
		2,
		0,
		0,
		4,
		3,
		0,
		0,
		0,
		1,
	);
	const threeM = new ThreeMatrix4().set(
		2,
		0,
		0,
		1,
		0,
		3,
		0,
		2,
		0,
		0,
		4,
		3,
		0,
		0,
		0,
		1,
	);

	const position = new Vector3();
	const quaternion = new Quaternion();
	const scale = new Vector3();
	m.decompose(position, quaternion, scale);

	const threePosition = new ThreeVector3();
	const threeQuaternion = new ThreeQuaternion();
	const threeScale = new ThreeVector3();
	threeM.decompose(threePosition, threeQuaternion, threeScale);

	assertAlmostEquals(
		position.x,
		threePosition.x,
		Maths.EPSILON,
		"decompose position.x",
	);
	assertAlmostEquals(
		position.y,
		threePosition.y,
		Maths.EPSILON,
		"decompose position.y",
	);
	assertAlmostEquals(
		position.z,
		threePosition.z,
		Maths.EPSILON,
		"decompose position.z",
	);

	assertAlmostEquals(
		scale.x,
		threeScale.x,
		Maths.EPSILON,
		"decompose scale.x",
	);
	assertAlmostEquals(
		scale.y,
		threeScale.y,
		Maths.EPSILON,
		"decompose scale.y",
	);
	assertAlmostEquals(
		scale.z,
		threeScale.z,
		Maths.EPSILON,
		"decompose scale.z",
	);
});

Deno.test("Matrix4: determinant", () => {
	const matrices = [
		new Matrix4(),
		new Matrix4().set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
		new Matrix4().makeRotationX(Math.PI / 3),
		new Matrix4().makeTranslation(1, 2, 3),
	];

	const threeMatrices = [
		new ThreeMatrix4(),
		new ThreeMatrix4().set(
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
		),
		new ThreeMatrix4().makeRotationX(Math.PI / 3),
		new ThreeMatrix4().makeTranslation(1, 2, 3),
	];

	for (let i = 0; i < matrices.length; i++) {
		const det = matrices.safeAt(i).determinant();
		const threeDet = threeMatrices.safeAt(i).determinant();
		assertAlmostEquals(
			det,
			threeDet,
			Maths.EPSILON,
			`determinant case ${i}`,
		);
	}
});

Deno.test("Matrix4: extractPosition", () => {
	const m = new Matrix4().makeTranslation(1, 2, 3);
	const position = new Vector3();
	m.extractPosition(position);
	const threeM = new ThreeMatrix4().makeTranslation(1, 2, 3);
	const threePosition = new ThreeVector3();
	threePosition.setFromMatrixColumn(threeM, 3);
	assertAlmostEquals(
		position.x,
		threePosition.x,
		Maths.EPSILON,
		"extractPosition",
	);
	assertAlmostEquals(
		position.y,
		threePosition.y,
		Maths.EPSILON,
		"extractPosition",
	);
	assertAlmostEquals(
		position.z,
		threePosition.z,
		Maths.EPSILON,
		"extractPosition",
	);
});

Deno.test("Matrix4: extractRotation", () => {
	const m = new Matrix4().makeRotationX(Math.PI / 3);
	const rotation = new Matrix4();
	rotation.extractRotation(m);

	const threeM = new ThreeMatrix4().makeRotationX(Math.PI / 3);
	const threeRotation = new ThreeMatrix4();
	threeRotation.extractRotation(threeM);

	compareMatrices(rotation, threeRotation, "extractRotation");
});

Deno.test("Matrix4: extractScale", () => {
	const m = new Matrix4().makeScale(2, 3, 4);
	const scale = new Vector3();
	m.extractScale(scale);
	assertEquals(scale.x, 2, "extractScale x");
	assertEquals(scale.y, 3, "extractScale y");
	assertEquals(scale.z, 4, "extractScale z");
});

Deno.test("Matrix4: identity", () => {
	const a = new Matrix4().set(
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
	).identity();
	const threeA = new ThreeMatrix4().set(
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
	).identity();
	compareMatrices(a, threeA, "identity");
});

Deno.test("Matrix4: invert", () => {
	const matrices = [
		new Matrix4(),
		new Matrix4().makeRotationX(Math.PI / 3),
		new Matrix4().makeTranslation(1, 2, 3),
		new Matrix4().makeScale(2, 3, 4),
	];

	const threeMatrices = [
		new ThreeMatrix4(),
		new ThreeMatrix4().makeRotationX(Math.PI / 3),
		new ThreeMatrix4().makeTranslation(1, 2, 3),
		new ThreeMatrix4().makeScale(2, 3, 4),
	];

	for (let i = 0; i < matrices.length; i++) {
		const a = matrices.safeAt(i).clone().invert();
		const threeA = threeMatrices.safeAt(i).clone().invert();
		compareMatrices(a, threeA, `invert case ${i}`);
	}
});

Deno.test("Matrix4: lookAt", () => {
	const eye = new Vector3(1, 2, 3);
	const target = new Vector3(4, 5, 6);
	const up = new Vector3(0, 1, 0);

	const threeEye = new ThreeVector3(1, 2, 3);
	const threeTarget = new ThreeVector3(4, 5, 6);
	const threeUp = new ThreeVector3(0, 1, 0);

	const a = new Matrix4().lookAt(eye, target, up);
	const threeA = new ThreeMatrix4().lookAt(threeEye, threeTarget, threeUp);
	compareMatrices(a, threeA, "lookAt");
});

Deno.test("Matrix4: makeOrthographic", () => {
	const left = -1;
	const right = 1;
	const top = 1;
	const bottom = -1;
	const near = 0.1;
	const far = 100;

	const a = new Matrix4().makeOrthographic(left, right, top, bottom, near, far);
	const threeA = new ThreeMatrix4().makeOrthographic(
		left,
		right,
		top,
		bottom,
		near,
		far,
	);
	compareMatrices(a, threeA, "makeOrthographic");
});

Deno.test("Matrix4: makePerspective", () => {
	const fov = Maths.QUARTER_PI;
	const aspect = 16 / 9;
	const near = 0.1;
	const far = 100;

	const a = new Matrix4().makePerspective(fov, aspect, near, far);

	const tHalfFov = Math.tan(fov / 2);
	const left = -aspect * tHalfFov * near;
	const right = aspect * tHalfFov * near;
	const top = tHalfFov * near;
	const bottom = -tHalfFov * near;

	const threeA = new ThreeMatrix4().makePerspective(
		left,
		right,
		top,
		bottom,
		near,
		far,
	);
	compareMatrices(a, threeA, "makePerspective");
});

Deno.test("Matrix4: makeRotationFromEuler", () => {
	const euler = new Euler(
		Maths.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"XYZ",
	);
	const threeEuler = new ThreeEuler(
		Maths.QUARTER_PI,
		Math.PI / 3,
		Math.PI / 6,
		"XYZ",
	);

	const a = new Matrix4().makeRotationFromEuler(euler);
	const threeA = new ThreeMatrix4().makeRotationFromEuler(threeEuler);
	compareMatrices(a, threeA, "makeRotationFromEuler");
});

Deno.test("Matrix4: makeRotationFromQuaternion", () => {
	const q = new Quaternion(0.1, 0.2, 0.3, 0.4).unitize();
	const threeQ = new ThreeQuaternion(0.1, 0.2, 0.3, 0.4).normalize();

	const a = new Matrix4().makeRotationFromQuaternion(q);
	const threeA = new ThreeMatrix4().makeRotationFromQuaternion(threeQ);
	compareMatrices(a, threeA, "makeRotationFromQuaternion");
});

Deno.test("Matrix4: makeRotationX", () => {
	const angle = Maths.QUARTER_PI;
	const a = new Matrix4().makeRotationX(angle);
	const threeA = new ThreeMatrix4().makeRotationX(angle);
	compareMatrices(a, threeA, "makeRotationX");
});

Deno.test("Matrix4: makeRotationY", () => {
	const angle = Maths.QUARTER_PI;
	const a = new Matrix4().makeRotationY(angle);
	const threeA = new ThreeMatrix4().makeRotationY(angle);
	compareMatrices(a, threeA, "makeRotationY");
});

Deno.test("Matrix4: makeRotationZ", () => {
	const angle = Maths.QUARTER_PI;
	const a = new Matrix4().makeRotationZ(angle);
	const threeA = new ThreeMatrix4().makeRotationZ(angle);
	compareMatrices(a, threeA, "makeRotationZ");
});

Deno.test("Matrix4: makeScale", () => {
	const a = new Matrix4().makeScale(2, 3, 4);
	const threeA = new ThreeMatrix4().makeScale(2, 3, 4);
	compareMatrices(a, threeA, "makeScale");
});

Deno.test("Matrix4: makeTranslation", () => {
	const a = new Matrix4().makeTranslation(1, 2, 3);
	const threeA = new ThreeMatrix4().makeTranslation(1, 2, 3);
	compareMatrices(a, threeA, "makeTranslation");
});

Deno.test("Matrix4: mulMatrices", () => {
	const a = new Matrix4().makeRotationX(Maths.QUARTER_PI);
	const b = new Matrix4().makeTranslation(1, 2, 3);
	const c = new Matrix4().mulMatrices(a, b);

	const threeA = new ThreeMatrix4().makeRotationX(Maths.QUARTER_PI);
	const threeB = new ThreeMatrix4().makeTranslation(1, 2, 3);
	const threeC = new ThreeMatrix4().multiplyMatrices(threeA, threeB);

	compareMatrices(c, threeC, "mulMatrices");
});

Deno.test("Matrix4: set", () => {
	const a = new Matrix4().set(
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
	const threeA = new ThreeMatrix4().set(
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

	const te = a.elements;
	assertEquals(te[0], 1);
	assertEquals(te[1], 5);
	assertEquals(te[2], 9);
	assertEquals(te[3], 13);
	assertEquals(te[4], 2);
	assertEquals(te[5], 6);
	assertEquals(te[6], 10);
	assertEquals(te[7], 14);
	assertEquals(te[8], 3);
	assertEquals(te[9], 7);
	assertEquals(te[10], 11);
	assertEquals(te[11], 15);
	assertEquals(te[12], 4);
	assertEquals(te[13], 8);
	assertEquals(te[14], 12);
	assertEquals(te[15], 16);

	compareMatrices(a, threeA, "set");
});
