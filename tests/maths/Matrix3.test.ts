import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Matrix3 as ThreeMatrix3,
	Matrix4 as ThreeMatrix4,
	Vector2 as ThreeVector2,
} from "three";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Matrix3 } from "../../src/maths/Matrix3.ts";
import { Matrix4 } from "../../src/maths/Matrix4.ts";
import { Vector2 } from "../../src/maths/Vector2.ts";
import "../../src/types.ts";

function compareMatrices(
	ourMatrix: Matrix3,
	threeMatrix: ThreeMatrix3,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(`  Our:   ${ourMatrix.elements}`);
	console.log(`  Three: ${threeMatrix.elements}`);

	for (let i = 0; i < 9; i++) {
		assertAlmostEquals(
			ourMatrix.elements.safeAt(i),
			threeMatrix.elements.safeAt(i),
			MathUtils.EPSILON,
			`${message} (element ${i})`,
		);
	}
}

Deno.test("Matrix3: constructor", () => {
	const a = new Matrix3();
	const threeA = new ThreeMatrix3();
	compareMatrices(a, threeA, "constructor");

	const elements = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);

	const threeB = new ThreeMatrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);

	const threeElements = threeB.elements;
	assertEquals(elements[0], threeElements[0], "first element");
	assertEquals(elements[4], threeElements[4], "second row, second column");
});

Deno.test("Matrix3: clone", () => {
	const a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);
	const b = a.clone();
	const threeA = new ThreeMatrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);
	const threeB = threeA.clone();
	compareMatrices(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");
	assertNotStrictEquals(
		a.elements,
		b.elements,
		"clone creates new elements array",
	);
});

Deno.test("Matrix3: copy", () => {
	const a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);
	const b = new Matrix3().copy(a);
	const threeA = new ThreeMatrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);
	const threeB = new ThreeMatrix3().copy(threeA);
	compareMatrices(b, threeB, "copy");
	compareMatrices(a, threeA, "copy (original unchanged)");
});

Deno.test("Matrix3: compose", () => {
	const position = new Vector2(1, 2);
	const rotation = MathUtils.QUARTER_PI;
	const scale = new Vector2(2, 3);

	const threePosition = new ThreeVector2(1, 2);
	const threeRotation = MathUtils.QUARTER_PI;
	const threeScale = new ThreeVector2(2, 3);

	const a = new Matrix3().compose(position, rotation, scale);
	const threeA = new ThreeMatrix3().makeRotation(threeRotation);
	threeA.elements[0] *= threeScale.x;
	threeA.elements[3] *= threeScale.x;
	threeA.elements[1] *= threeScale.y;
	threeA.elements[4] *= threeScale.y;
	threeA.elements[6] = threePosition.x;
	threeA.elements[7] = threePosition.y;
	compareMatrices(a, threeA, "compose");
});

Deno.test("Matrix3: decompose", () => {
	const m = new Matrix3().set(2, 0, 0, 0, 3, 0, 1, 2, 1);
	const threeM = new ThreeMatrix3().set(2, 0, 0, 0, 3, 0, 1, 2, 1);

	const position = new Vector2();
	const rotation = { angle: 0 };
	const scale = new Vector2();
	m.decompose(position, rotation, scale);

	const threePosition = new ThreeVector2();
	threePosition.x = threeM.elements[6];
	threePosition.y = threeM.elements[7];

	const threeScale = new ThreeVector2();
	threeScale.x = Math.hypot(threeM.elements[0], threeM.elements[3]);
	threeScale.y = Math.hypot(threeM.elements[1], threeM.elements[4]);

	assertAlmostEquals(
		position.x,
		threePosition.x,
		MathUtils.EPSILON,
		"decompose position.x",
	);
	assertAlmostEquals(
		position.y,
		threePosition.y,
		MathUtils.EPSILON,
		"decompose position.y",
	);

	assertAlmostEquals(
		scale.x,
		threeScale.x,
		MathUtils.EPSILON,
		"decompose scale.x",
	);
	assertAlmostEquals(
		scale.y,
		threeScale.y,
		MathUtils.EPSILON,
		"decompose scale.y",
	);
});

Deno.test("Matrix3: determinant", () => {
	const matrices = [
		new Matrix3(), // identity
		new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9),
		new Matrix3().makeRotation(Math.PI / 3),
		new Matrix3().makeTranslation(1, 2),
	];

	const threeMatrices = [
		new ThreeMatrix3(), // identity
		new ThreeMatrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9),
		new ThreeMatrix3().makeRotation(Math.PI / 3),
		new ThreeMatrix3().makeTranslation(1, 2),
	];

	for (let i = 0; i < matrices.length; i++) {
		const det = matrices.safeAt(i).determinant();
		const threeDet = threeMatrices.safeAt(i).determinant();
		assertAlmostEquals(
			det,
			threeDet,
			MathUtils.EPSILON,
			`determinant case ${i}`,
		);
	}
});

Deno.test("Matrix3: extractPosition", () => {
	const m = new Matrix3().makeTranslation(1, 2);
	const position = new Vector2();
	m.extractPosition(position);
	const threeM = new ThreeMatrix3().makeTranslation(1, 2);
	const threePosition = new ThreeVector2();
	threePosition.x = threeM.elements[6];
	threePosition.y = threeM.elements[7];
	assertAlmostEquals(
		position.x,
		threePosition.x,
		MathUtils.EPSILON,
		"extractPosition x",
	);
	assertAlmostEquals(
		position.y,
		threePosition.y,
		MathUtils.EPSILON,
		"extractPosition y",
	);
});

Deno.test("Matrix3: extractRotation", () => {
	const m = new Matrix3().makeRotation(Math.PI / 3);
	const rotation = new Matrix3();
	rotation.extractRotation(m);
	const threeM = new ThreeMatrix3().makeRotation(Math.PI / 3);
	const threeRotation = new ThreeMatrix3();
	threeRotation.copy(threeM);
	compareMatrices(rotation, threeRotation, "extractRotation");
});

Deno.test("Matrix3: extractScale", () => {
	const m = new Matrix3().makeScale(2, 3);
	const scale = new Vector2();
	m.extractScale(scale);
	assertEquals(scale.x, 2, "extractScale x");
	assertEquals(scale.y, 3, "extractScale y");
});

Deno.test("Matrix3: identity", () => {
	const a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).identity();
	const threeA = new ThreeMatrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).identity();
	compareMatrices(a, threeA, "identity");
});

Deno.test("Matrix3: invert", () => {
	const matrices = [
		new Matrix3(), // identity
		new Matrix3().makeRotation(Math.PI / 3),
		new Matrix3().makeTranslation(1, 2),
		new Matrix3().makeScale(2, 3),
	];
	const threeMatrices = [
		new ThreeMatrix3(), // identity
		new ThreeMatrix3().makeRotation(Math.PI / 3),
		new ThreeMatrix3().makeTranslation(1, 2),
		new ThreeMatrix3().makeScale(2, 3),
	];

	for (let i = 0; i < matrices.length; i++) {
		const a = matrices.safeAt(i).clone().invert();
		const threeA = threeMatrices.safeAt(i).clone().invert();
		compareMatrices(a, threeA, `invert case ${i}`);
	}
});

Deno.test("Matrix3: getNormalMatrix", () => {
	const m4 = new Matrix4().makeRotationX(Math.PI / 3);
	const m3 = new Matrix3().getNormalMatrix(m4);
	const threeM4 = new ThreeMatrix4().makeRotationX(Math.PI / 3);
	const threeM3 = new ThreeMatrix3().getNormalMatrix(threeM4);
	compareMatrices(m3, threeM3, "getNormalMatrix");
});

Deno.test("Matrix3: makeRotation", () => {
	const angle = MathUtils.QUARTER_PI;

	const a = new Matrix3().makeRotation(angle);
	const threeA = new ThreeMatrix3().makeRotation(angle);
	compareMatrices(a, threeA, "makeRotation");
});

Deno.test("Matrix3: makeScale", () => {
	const a = new Matrix3().makeScale(2, 3);
	const threeA = new ThreeMatrix3().makeScale(2, 3);
	compareMatrices(a, threeA, "makeScale");
});

Deno.test("Matrix3: makeTranslation", () => {
	const a = new Matrix3().makeTranslation(1, 2);
	const threeA = new ThreeMatrix3().makeTranslation(1, 2);
	compareMatrices(a, threeA, "makeTranslation");
});

Deno.test("Matrix3: mulMatrices", () => {
	const a = new Matrix3().makeRotation(MathUtils.QUARTER_PI);
	const b = new Matrix3().makeTranslation(1, 2);
	const c = new Matrix3().mulMatrices(a, b);

	const threeA = new ThreeMatrix3().makeRotation(MathUtils.QUARTER_PI);
	const threeB = new ThreeMatrix3().makeTranslation(1, 2);
	const threeC = new ThreeMatrix3().multiplyMatrices(threeA, threeB);

	compareMatrices(c, threeC, "mulMatrices");
});

Deno.test("Matrix3: set", () => {
	const a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);
	const threeA = new ThreeMatrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);

	const te = a.elements;
	assertEquals(te[0], 1);
	assertEquals(te[1], 4);
	assertEquals(te[2], 7);
	assertEquals(te[3], 2);
	assertEquals(te[4], 5);
	assertEquals(te[5], 8);
	assertEquals(te[6], 3);
	assertEquals(te[7], 6);
	assertEquals(te[8], 9);

	compareMatrices(a, threeA, "set");
});

Deno.test("Matrix3: setFromMatrix4", () => {
	const m4 = new Matrix4().makeRotationX(Math.PI / 3);
	const m3 = new Matrix3().setFromMatrix4(m4);
	const threeM4 = new ThreeMatrix4().makeRotationX(Math.PI / 3);
	const threeM3 = new ThreeMatrix3().setFromMatrix4(threeM4);
	compareMatrices(m3, threeM3, "setFromMatrix4");
});

Deno.test("Matrix3: transpose", () => {
	const a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).transpose();
	const threeA = new ThreeMatrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).transpose();
	compareMatrices(a, threeA, "transpose");
});
