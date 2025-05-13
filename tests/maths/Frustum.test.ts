import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import {
	Box3 as ThreeBox3,
	Frustum as ThreeFrustum,
	Matrix4 as ThreeMatrix4,
	Sphere as ThreeSphere,
	Vector3 as ThreeVector3,
} from "three";
import { Box3 } from "../../src/maths/Box3.ts";
import { Frustum } from "../../src/maths/Frustum.ts";
import { Maths } from "../../src/maths/Maths.ts";
import { Matrix4 } from "../../src/maths/Matrix4.ts";
import { Sphere } from "../../src/maths/Sphere.ts";
import { Vector3 } from "../../src/maths/Vector3.ts";
import "../../src/types.ts";

function compareFrustums(
	ourFrustum: Frustum,
	threeFrustum: ThreeFrustum,
	message: string,
): void {
	console.log(`${message}:`);

	for (let i = 0; i < 6; i++) {
		const ourPlane = ourFrustum.planes.safeAt(i);
		const threePlane = threeFrustum.planes.safeAt(i);

		console.log(`Plane ${i}:`);
		console.log(
			`  Our:   (${ourPlane.normal.x}, ${ourPlane.normal.y}, ${ourPlane.normal.z}, ${ourPlane.constant})`,
		);
		console.log(
			`  Three: (${threePlane.normal.x}, ${threePlane.normal.y}, ${threePlane.normal.z}, ${threePlane.constant})`,
		);

		assertAlmostEquals(
			ourPlane.normal.x,
			threePlane.normal.x,
			Maths.EPSILON,
			`${message} (plane ${i} normal.x)`,
		);
		assertAlmostEquals(
			ourPlane.normal.y,
			threePlane.normal.y,
			Maths.EPSILON,
			`${message} (plane ${i} normal.y)`,
		);
		assertAlmostEquals(
			ourPlane.normal.z,
			threePlane.normal.z,
			Maths.EPSILON,
			`${message} (plane ${i} normal.z)`,
		);
		assertAlmostEquals(
			ourPlane.constant,
			threePlane.constant,
			Maths.EPSILON,
			`${message} (plane ${i} constant)`,
		);
	}
}

Deno.test("Frustum: constructor", () => {
	const a = new Frustum();
	assertEquals(a.planes.length, 6, "constructor creates 6 planes");
});

Deno.test("Frustum: clone", () => {
	const a = new Frustum();

	const perspMatrix = new Matrix4().makePerspective(
		Maths.toRadians(45),
		1.0,
		0.1,
		100,
	);
	a.setFromProjectionMatrix(perspMatrix);

	const b = a.clone();

	assertNotStrictEquals(a, b, "clone creates new instance");

	for (let i = 0; i < 6; i++) {
		assertNotStrictEquals(
			a.planes.safeAt(i),
			b.planes.safeAt(i),
			`clone creates new plane instance at index ${i}`,
		);

		assertEquals(
			a.planes.safeAt(i).normal.x,
			b.planes.safeAt(i).normal.x,
			`clone preserves plane normal.x at index ${i}`,
		);
		assertEquals(
			a.planes.safeAt(i).normal.y,
			b.planes.safeAt(i).normal.y,
			`clone preserves plane normal.y at index ${i}`,
		);
		assertEquals(
			a.planes.safeAt(i).normal.z,
			b.planes.safeAt(i).normal.z,
			`clone preserves plane normal.z at index ${i}`,
		);
		assertEquals(
			a.planes.safeAt(i).constant,
			b.planes.safeAt(i).constant,
			`clone preserves plane constant at index ${i}`,
		);
	}
});

Deno.test("Frustum: containsPoint", () => {
	const a = new Frustum();
	const threeA = new ThreeFrustum();

	const perspMatrix = new Matrix4().makePerspective(
		Maths.toRadians(45),
		1.0,
		0.1,
		100,
	);

	const halfHeight = 0.1 * Math.tan(Maths.toRadians(45) / 2);
	const halfWidth = halfHeight * 1.0;
	const threeMatrix = new ThreeMatrix4().makePerspective(
		-halfWidth,
		halfWidth,
		halfHeight,
		-halfHeight,
		0.1,
		100,
	);

	a.setFromProjectionMatrix(perspMatrix);
	threeA.setFromProjectionMatrix(threeMatrix);

	const insidePoint = new Vector3(0, 0, -50);
	const threeInsidePoint = new ThreeVector3(0, 0, -50);
	assertEquals(
		a.containsPoint(insidePoint),
		threeA.containsPoint(threeInsidePoint),
		"containsPoint (inside)",
	);

	const outsidePoint = new Vector3(0, 0, 1);
	const threeOutsidePoint = new ThreeVector3(0, 0, 1);
	assertEquals(
		a.containsPoint(outsidePoint),
		threeA.containsPoint(threeOutsidePoint),
		"containsPoint (outside)",
	);

	const boundaryPoint = new Vector3(0, 0, -100);
	const threeBoundaryPoint = new ThreeVector3(0, 0, -100);
	assertEquals(
		a.containsPoint(boundaryPoint),
		threeA.containsPoint(threeBoundaryPoint),
		"containsPoint (boundary)",
	);
});

Deno.test("Frustum: copy", () => {
	const perspMatrix = new Matrix4().makePerspective(
		Maths.toRadians(45),
		1.0,
		0.1,
		100,
	);

	const a = new Frustum().setFromProjectionMatrix(perspMatrix);
	const b = new Frustum().copy(a);
	assertNotStrictEquals(a, b, "copy creates new instance");

	for (let i = 0; i < 6; i++) {
		assertNotStrictEquals(
			a.planes[i],
			b.planes[i],
			`copy creates new plane instance at index ${i}`,
		);

		assertEquals(
			a.planes.safeAt(i).normal.x,
			b.planes.safeAt(i).normal.x,
			`copy preserves plane normal.x at index ${i}`,
		);
		assertEquals(
			a.planes.safeAt(i).normal.y,
			b.planes.safeAt(i).normal.y,
			`copy preserves plane normal.y at index ${i}`,
		);
		assertEquals(
			a.planes.safeAt(i).normal.z,
			b.planes.safeAt(i).normal.z,
			`copy preserves plane normal.z at index ${i}`,
		);
		assertEquals(
			a.planes.safeAt(i).constant,
			b.planes.safeAt(i).constant,
			`copy preserves plane constant at index ${i}`,
		);
	}
});

Deno.test("Frustum: intersectsBox", () => {
	const a = new Frustum();
	const threeA = new ThreeFrustum();

	const perspMatrix = new Matrix4().makePerspective(
		Maths.toRadians(45),
		1.0,
		0.1,
		100,
	);

	const halfHeight = 0.1 * Math.tan(Maths.toRadians(45) / 2);
	const halfWidth = halfHeight * 1.0;
	const threeMatrix = new ThreeMatrix4().makePerspective(
		-halfWidth,
		halfWidth,
		halfHeight,
		-halfHeight,
		0.1,
		100,
	);

	a.setFromProjectionMatrix(perspMatrix);
	threeA.setFromProjectionMatrix(threeMatrix);

	const insideMin = new Vector3(-1, -1, -10);
	const insideMax = new Vector3(1, 1, -5);
	const threeInsideMin = new ThreeVector3(-1, -1, -10);
	const threeInsideMax = new ThreeVector3(1, 1, -5);
	assertEquals(
		a.intersectsBox(new Box3(insideMin, insideMax)),
		threeA.intersectsBox(new ThreeBox3(threeInsideMin, threeInsideMax)),
	);

	const outsideMin = new Vector3(-1, -1, 5);
	const outsideMax = new Vector3(1, 1, 10);
	const threeOutsideMin = new ThreeVector3(-1, -1, 5);
	const threeOutsideMax = new ThreeVector3(1, 1, 10);
	assertEquals(
		a.intersectsBox(new Box3(outsideMin, outsideMax)),
		threeA.intersectsBox(new ThreeBox3(threeOutsideMin, threeOutsideMax)),
		"intersectsBox (outside)",
	);

	const intersectingMin = new Vector3(-1, -1, -1);
	const intersectingMax = new Vector3(1, 1, 1);
	const threeIntersectingMin = new ThreeVector3(-1, -1, -1);
	const threeIntersectingMax = new ThreeVector3(1, 1, 1);
	assertEquals(
		a.intersectsBox(new Box3(intersectingMin, intersectingMax)),
		threeA.intersectsBox(
			new ThreeBox3(threeIntersectingMin, threeIntersectingMax),
		),
		"intersectsBox (intersecting)",
	);
});

Deno.test("Frustum: intersectsSphere", () => {
	const a = new Frustum();
	const threeA = new ThreeFrustum();

	const perspMatrix = new Matrix4().makePerspective(
		Maths.toRadians(45),
		1.0,
		0.1,
		100,
	);

	const halfHeight = 0.1 * Math.tan(Maths.toRadians(45) / 2);
	const halfWidth = halfHeight * 1.0;
	const threeMatrix = new ThreeMatrix4().makePerspective(
		-halfWidth,
		halfWidth,
		halfHeight,
		-halfHeight,
		0.1,
		100,
	);

	a.setFromProjectionMatrix(perspMatrix);
	threeA.setFromProjectionMatrix(threeMatrix);

	const insideCentre = new Vector3(0, 0, -50);
	const threeInsideCentre = new ThreeVector3(0, 0, -50);
	const insideRadius = 1;
	assertEquals(
		a.intersectsSphere(new Sphere(insideCentre, insideRadius)),
		threeA.intersectsSphere(new ThreeSphere(threeInsideCentre, insideRadius)),
		"intersectsSphere (inside)",
	);

	const outsideCentre = new Vector3(0, 0, 10);
	const threeOutsideCentre = new ThreeVector3(0, 0, 10);
	const outsideRadius = 1;
	assertEquals(
		a.intersectsSphere(new Sphere(outsideCentre, outsideRadius)),
		threeA.intersectsSphere(new ThreeSphere(threeOutsideCentre, outsideRadius)),
		"intersectsSphere (outside)",
	);

	const intersectingCentre = new Vector3(0, 0, -0.5);
	const threeIntersectingCentre = new ThreeVector3(0, 0, -0.5);
	const intersectingRadius = 1;
	assertEquals(
		a.intersectsSphere(new Sphere(intersectingCentre, intersectingRadius)),
		threeA.intersectsSphere(
			new ThreeSphere(threeIntersectingCentre, intersectingRadius),
		),
		"intersectsSphere (intersecting)",
	);
});

Deno.test("Frustum: setFromProjectionMatrix", () => {
	const a = new Frustum();
	const threeA = new ThreeFrustum();

	const identityMatrix = new Matrix4();
	const threeIdentityMatrix = new ThreeMatrix4();

	a.setFromProjectionMatrix(identityMatrix);
	threeA.setFromProjectionMatrix(threeIdentityMatrix);
	compareFrustums(a, threeA, "setFromProjectionMatrix (identity)");

	const perspMatrix = new Matrix4().makePerspective(
		Maths.toRadians(45),
		1,
		0.1,
		100,
	);

	const halfHeight = 0.1 * Math.tan(Maths.toRadians(45) / 2);
	const halfWidth = halfHeight * 1.0;
	const threeMatrix = new ThreeMatrix4().makePerspective(
		-halfWidth,
		halfWidth,
		halfHeight,
		-halfHeight,
		0.1,
		100,
	);

	a.setFromProjectionMatrix(perspMatrix);
	threeA.setFromProjectionMatrix(threeMatrix);
	compareFrustums(a, threeA, "setFromProjectionMatrix (perspective)");
});
