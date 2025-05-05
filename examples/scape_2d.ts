import { SCAPE } from "../src/mod.ts";

const scene = new SCAPE.Scene();
scene.background = new SCAPE.Color(0xEEEEEE);

const aspect = globalThis.innerWidth / globalThis.innerHeight;
const frustumSize = 20;
const camera = new SCAPE.OrthoCamera(
	frustumSize * aspect / -2,
	frustumSize * aspect / 2,
	frustumSize / 2,
	frustumSize / -2,
	0.1, // near
	1000, // far
);

camera.position.set(20, 20, 20);
camera.lookAt(scene.position);

const renderer = new SCAPE.CanvasRenderer();
renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
globalThis.document.body.appendChild(renderer.domElement);

const cubeShape = new SCAPE.CubeShape(1, 1, 1);

const material1 = new SCAPE.Material({
	color: 0xFF0000,
}); // Red
const cube1 = new SCAPE.Mesh(cubeShape, material1);
cube1.position.set(0, 0.5, 0);
scene.add(cube1);

const material2 = new SCAPE.Material({
	color: 0x00FF00,
}); // Green
const cube2 = new SCAPE.Mesh(cubeShape, material2);
cube2.position.set(1, 0.5, 0);
scene.add(cube2);

const material3 = new SCAPE.Material({
	color: 0x0000FF,
}); // Blue
const cube3 = new SCAPE.Mesh(cubeShape, material3);
cube3.position.set(0, 0.5, 1);
scene.add(cube3);

const planeShape = new SCAPE.PlaneShape(10, 10);
const planeMaterial = new SCAPE.Material({
	color: 0xCCCCCC,
});
const plane = new SCAPE.Mesh(planeShape, planeMaterial);
plane.rotation.x = -SCAPE.MathUtils.HALF_PI;
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
