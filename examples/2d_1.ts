import { OUR } from "../src/mod.ts";

const scene = new OUR.Scene();
scene.background = new OUR.Color(0xEEEEEE);

const aspect = globalThis.innerWidth / 2 / globalThis.innerHeight;
const frustumSize = 20;
const camera = new OUR.OrthoCamera(
	frustumSize * aspect / -2,
	frustumSize * aspect / 2,
	frustumSize / 2,
	frustumSize / -2,
	0.1, // near
	1000, // far
);

camera.position.set(20, 20, 20);
camera.lookAt(scene.position);

const renderer = new OUR.CanvasRenderer();
renderer.setSize(globalThis.innerWidth / 2, globalThis.innerHeight);
globalThis.document.body.appendChild(renderer.domElement);

const cubeShape = new OUR.CubeShape(1, 1, 1);

const material1 = new OUR.Material({
	color: 0xFF0000,
}); // Red
const cube1 = new OUR.Mesh(cubeShape, material1);
cube1.position.set(0, 0.5, 0);
scene.add(cube1);

const material2 = new OUR.Material({
	color: 0x00FF00,
}); // Green
const cube2 = new OUR.Mesh(cubeShape, material2);
cube2.position.set(1, 0.5, 0);
scene.add(cube2);

const material3 = new OUR.Material({
	color: 0x0000FF,
}); // Blue
const cube3 = new OUR.Mesh(cubeShape, material3);
cube3.position.set(0, 0.5, 1);
scene.add(cube3);

const planeShape = new OUR.PlaneShape(10, 10);
const planeMaterial = new OUR.Material({
	color: 0xCCCCCC,
});
const plane = new OUR.Mesh(planeShape, planeMaterial);
plane.rotation.x = -OUR.MathUtils.HALF_PI;
scene.add(plane);

function animate(): void {
	globalThis.requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

globalThis.addEventListener("resize", () => {
	const aspect = globalThis.innerWidth / globalThis.innerHeight;
	camera.left = frustumSize * aspect / -2;
	camera.right = frustumSize * aspect / 2;
	camera.top = frustumSize / 2;
	camera.bottom = frustumSize / -2;
	camera.updateProjectionMatrix();
	renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
});
