import {
	assertAlmostEquals,
	assertEquals,
	assertNotStrictEquals,
} from "@std/assert";
import { Color as ThreeColor, Scene as ThreeScene } from "three";
import "../../extensions/array.extension.ts";
import { Color } from "../../src/common/Color.ts";
import { Object3D } from "../../src/objects/Object3D.ts";
import { Scene } from "../../src/scenes/Scene.ts";

function compareScenes(
	ourScene: Scene,
	threeScene: ThreeScene,
	message: string,
): void {
	console.log(`${message}:`);

	const ourColor = ourScene.background instanceof Color
		? ourScene.background
		: new Color(0x000000);
	const threeColor = threeScene.background instanceof ThreeColor
		? threeScene.background
		: new ThreeColor(0x000000);

	assertAlmostEquals(
		ourColor.r,
		threeColor.r,
		0.01,
		`${message} (background.r)`,
	);
	assertAlmostEquals(
		ourColor.g,
		threeColor.g,
		0.01,
		`${message} (background.g)`,
	);
	assertAlmostEquals(
		ourColor.b,
		threeColor.b,
		0.01,
		`${message} (background.b)`,
	);

	assertEquals(
		ourScene.children.length,
		threeScene.children.length,
		`${message} (children.length)`,
	);
}

Deno.test("Scene: constructor", () => {
	const a = new Scene();
	const threeA = new ThreeScene();

	assertEquals(a.name, "Scene");
	assertEquals(a.children.length, 0);
	assertEquals(a.background instanceof Color, true);
	assertEquals(a.background.hex, 0x000000);

	compareScenes(a, threeA, "constructor");
});

Deno.test("Scene: copy", () => {
	const a = new Scene();
	a.background = new Color(0xFF0000);

	const b = new Scene().copy(a);

	const threeA = new ThreeScene();
	threeA.background = new ThreeColor(0xFF0000);

	const threeB = new ThreeScene().copy(threeA);

	compareScenes(b, threeB, "copy");
	assertNotStrictEquals(a, b, "copy creates new instance");
	assertEquals(b.background instanceof Color, true);
	assertEquals(b.background.hex, 0xFF0000);
});

Deno.test("Scene: clear", () => {
	const a = new Scene();
	const obj1 = new Object3D();
	const obj2 = new Object3D();

	a.add(obj1);
	a.add(obj2);

	assertEquals(a.children.length, 2);

	a.clear();

	assertEquals(a.children.length, 0);
});
