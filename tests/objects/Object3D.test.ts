import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { Object3D as ThreeObject3D, Vector3 as ThreeVector3 } from "three";
import { MathUtils } from "../../src/maths/MathUtils.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";
import { Object3D } from "../../src/objects/Object3D.ts";
import "../../src/types.ts";

function compareObject3D(
	ourObj: Object3D,
	threeObj: ThreeObject3D,
	message: string,
): void {
	console.log(`${message}:`);
	console.log(
		`  Our position:   (${ourObj.position.x}, ${ourObj.position.y}, ${ourObj.position.z})`,
	);
	console.log(
		`  Three position: (${threeObj.position.x}, ${threeObj.position.y}, ${threeObj.position.z})`,
	);
	console.log(
		`  Our quaternion:   (${ourObj.quaternion.x}, ${ourObj.quaternion.y}, ${ourObj.quaternion.z}, ${ourObj.quaternion.w})`,
	);
	console.log(
		`  Three quaternion: (${threeObj.quaternion.x}, ${threeObj.quaternion.y}, ${threeObj.quaternion.z}, ${threeObj.quaternion.w})`,
	);
	console.log(
		`  Our scale:   (${ourObj.scale.x}, ${ourObj.scale.y}, ${ourObj.scale.z})`,
	);
	console.log(
		`  Three scale: (${threeObj.scale.x}, ${threeObj.scale.y}, ${threeObj.scale.z})`,
	);
	console.log(`  Our children count: ${ourObj.children.length}`);
	console.log(`  Three children count: ${threeObj.children.length}`);

	assertAlmostEquals(
		ourObj.position.x,
		threeObj.position.x,
		MathUtils.EPSILON,
		`${message} (position.x)`,
	);
	assertAlmostEquals(
		ourObj.position.y,
		threeObj.position.y,
		MathUtils.EPSILON,
		`${message} (position.y)`,
	);
	assertAlmostEquals(
		ourObj.position.z,
		threeObj.position.z,
		MathUtils.EPSILON,
		`${message} (position.z)`,
	);

	assertAlmostEquals(
		ourObj.quaternion.x,
		threeObj.quaternion.x,
		MathUtils.EPSILON,
		`${message} (quaternion.x)`,
	);
	assertAlmostEquals(
		ourObj.quaternion.y,
		threeObj.quaternion.y,
		MathUtils.EPSILON,
		`${message} (quaternion.y)`,
	);
	assertAlmostEquals(
		ourObj.quaternion.z,
		threeObj.quaternion.z,
		MathUtils.EPSILON,
		`${message} (quaternion.z)`,
	);
	assertAlmostEquals(
		ourObj.quaternion.w,
		threeObj.quaternion.w,
		MathUtils.EPSILON,
		`${message} (quaternion.w)`,
	);

	assertAlmostEquals(
		ourObj.scale.x,
		threeObj.scale.x,
		MathUtils.EPSILON,
		`${message} (scale.x)`,
	);
	assertAlmostEquals(
		ourObj.scale.y,
		threeObj.scale.y,
		MathUtils.EPSILON,
		`${message} (scale.y)`,
	);
	assertAlmostEquals(
		ourObj.scale.z,
		threeObj.scale.z,
		MathUtils.EPSILON,
		`${message} (scale.z)`,
	);

	assertEquals(
		ourObj.children.length,
		threeObj.children.length,
		`${message} (children count)`,
	);
}

Deno.test("Object3D: constructor", () => {
	const a = new Object3D();
	const threeA = new ThreeObject3D();

	assertEquals(a.position.x, 0);
	assertEquals(a.position.y, 0);
	assertEquals(a.position.z, 0);

	assertEquals(a.quaternion.x, 0);
	assertEquals(a.quaternion.y, 0);
	assertEquals(a.quaternion.z, 0);
	assertEquals(a.quaternion.w, 1);

	assertEquals(a.scale.x, 1);
	assertEquals(a.scale.y, 1);
	assertEquals(a.scale.z, 1);

	assertEquals(a.children.length, 0);

	compareObject3D(a, threeA, "constructor");
});

Deno.test("Object3D: add/remove", () => {
	const parent = new Object3D();
	const child = new Object3D();
	const threeParent = new ThreeObject3D();
	const threeChild = new ThreeObject3D();

	parent.add(child);
	threeParent.add(threeChild);

	compareObject3D(parent, threeParent, "parent after add");
	compareObject3D(child, threeChild, "child after add");

	assertEquals(child.parent, parent, "child.parent reference");
	assertEquals(
		parent.children.includes(child),
		true,
		"parent.children includes child",
	);

	parent.remove(child);
	threeParent.remove(threeChild);

	compareObject3D(parent, threeParent, "parent after remove");
	compareObject3D(child, threeChild, "child after remove");

	assertEquals(child.parent, null, "child.parent reference after remove");
	assertEquals(
		parent.children.includes(child),
		false,
		"parent.children doesn't include child after remove",
	);
});

Deno.test("Object3D: clone", () => {
	const a = new Object3D();
	a.position.set(1, 2, 3);
	a.quaternion.set(0.1, 0.2, 0.3, 1);
	a.scale.set(2, 3, 4);

	const child = new Object3D();
	child.position.set(5, 6, 7);
	a.add(child);

	const b = a.clone();

	const threeA = new ThreeObject3D();
	threeA.position.set(1, 2, 3);
	threeA.quaternion.set(0.1, 0.2, 0.3, 1);
	threeA.scale.set(2, 3, 4);

	const threeChild = new ThreeObject3D();
	threeChild.position.set(5, 6, 7);
	threeA.add(threeChild);

	const threeB = threeA.clone();

	compareObject3D(b, threeB, "clone");
	assertNotStrictEquals(a, b, "clone creates new instance");

	assertEquals(b.children.length, 1, "clone children count");
	assertNotStrictEquals(
		a.children[0],
		b.children[0],
		"clone creates new child instances",
	);

	if (b.children[0]) {
		assertEquals(b.children[0].position.x, 5, "clone child position.x");
		assertEquals(b.children[0].position.y, 6, "clone child position.y");
		assertEquals(b.children[0].position.z, 7, "clone child position.z");
	}
});

Deno.test("Object3D: copy", () => {
	const a = new Object3D();
	a.position.set(1, 2, 3);
	a.quaternion.set(0.1, 0.2, 0.3, 1);
	a.scale.set(2, 3, 4);

	const child = new Object3D();
	child.position.set(5, 6, 7);
	a.add(child);

	const b = new Object3D().copy(a);

	const threeA = new ThreeObject3D();
	threeA.position.set(1, 2, 3);
	threeA.quaternion.set(0.1, 0.2, 0.3, 1);
	threeA.scale.set(2, 3, 4);

	const threeChild = new ThreeObject3D();
	threeChild.position.set(5, 6, 7);
	threeA.add(threeChild);

	const threeB = new ThreeObject3D().copy(threeA);

	compareObject3D(b, threeB, "copy");
	compareObject3D(a, threeA, "copy (original unchanged)");

	assertEquals(b.children.length, 1, "copy children count");
	assertNotStrictEquals(
		a.children[0],
		b.children[0],
		"copy creates new child instances",
	);

	if (b.children[0]) {
		assertEquals(b.children[0].position.x, 5, "copy child position.x");
		assertEquals(b.children[0].position.y, 6, "copy child position.y");
		assertEquals(b.children[0].position.z, 7, "copy child position.z");
	}
});

Deno.test("Object3D: lookAt", () => {
	const a = new Object3D();
	a.position.set(0, 0, 0);

	const target = new Vector3(1, 0, 0);
	a.lookAt(target);

	const threeA = new ThreeObject3D();
	threeA.position.set(0, 0, 0);

	const threeTarget = new ThreeVector3(1, 0, 0);
	threeA.lookAt(threeTarget);

	compareObject3D(a, threeA, "lookAt (x-axis)");

	const targetY = new Vector3(0, 1, 0);
	a.lookAt(targetY);

	const threeTargetY = new ThreeVector3(0, 1, 0);
	threeA.lookAt(threeTargetY);

	compareObject3D(a, threeA, "lookAt (y-axis)");

	const targetZ = new Vector3(0, 0, 1);
	a.lookAt(targetZ);

	const threeTargetZ = new ThreeVector3(0, 0, 1);
	threeA.lookAt(threeTargetZ);

	compareObject3D(a, threeA, "lookAt (z-axis)");

	const b = new Object3D();
	b.position.set(1, 2, 3);

	const targetB = new Vector3(4, 5, 6);
	b.lookAt(targetB);

	const threeB = new ThreeObject3D();
	threeB.position.set(1, 2, 3);

	const threeTargetB = new ThreeVector3(4, 5, 6);
	threeB.lookAt(threeTargetB);

	compareObject3D(b, threeB, "lookAt (from offset position)");
});

Deno.test("Object3D: updateMatrix", () => {
	const a = new Object3D();
	a.position.set(1, 2, 3);
	a.quaternion.set(0.1, 0.2, 0.3, 1).unitize();
	a.scale.set(2, 3, 4);
	a.updateMatrix();

	const threeA = new ThreeObject3D();
	threeA.position.set(1, 2, 3);
	threeA.quaternion.set(0.1, 0.2, 0.3, 1).normalize();
	threeA.scale.set(2, 3, 4);
	threeA.updateMatrix();

	const me = a.matrix.elements;
	const threeMe = threeA.matrix.elements;

	for (let i = 0; i < 16; i++) {
		assertAlmostEquals(
			me.safeAt(i),
			threeMe.safeAt(i),
			MathUtils.EPSILON,
			`updateMatrix (matrix.elements[${i}])`,
		);
	}
});

Deno.test("Object3D: updateWorldMatrix", () => {
	const parent = new Object3D();
	parent.position.set(1, 0, 0);

	const child = new Object3D();
	child.position.set(0, 1, 0);

	parent.add(child);

	const threeParent = new ThreeObject3D();
	threeParent.position.set(1, 0, 0);

	const threeChild = new ThreeObject3D();
	threeChild.position.set(0, 1, 0);

	threeParent.add(threeChild);

	parent.updateWorldMatrix(false, true);
	threeParent.updateWorldMatrix(false, true);

	const parentWe = parent.worldMatrix.elements;
	const threeParentWe = threeParent.matrixWorld.elements;

	for (let i = 0; i < 16; i++) {
		assertAlmostEquals(
			parentWe.safeAt(i),
			threeParentWe.safeAt(i),
			MathUtils.EPSILON,
			`updateWorldMatrix parent (worldMatrix.elements[${i}])`,
		);
	}

	const childWe = child.worldMatrix.elements;
	const threeChildWe = threeChild.matrixWorld.elements;

	for (let i = 0; i < 16; i++) {
		assertAlmostEquals(
			childWe.safeAt(i),
			threeChildWe.safeAt(i),
			MathUtils.EPSILON,
			`updateWorldMatrix child (worldMatrix.elements[${i}])`,
		);
	}

	const worldPos = new Vector3();
	const threeWorldPos = new ThreeVector3();

	worldPos.set(0, 0, 0).applyMatrix4(child.worldMatrix);
	threeWorldPos.set(0, 0, 0).applyMatrix4(threeChild.matrixWorld);

	assertAlmostEquals(
		worldPos.x,
		threeWorldPos.x,
		MathUtils.EPSILON,
		"child world position x",
	);
	assertAlmostEquals(
		worldPos.y,
		threeWorldPos.y,
		MathUtils.EPSILON,
		"child world position y",
	);
	assertAlmostEquals(
		worldPos.z,
		threeWorldPos.z,
		MathUtils.EPSILON,
		"child world position z",
	);
});
