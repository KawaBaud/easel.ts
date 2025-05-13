import { EASEL } from "../src/mod.ts";

const width = globalThis.innerWidth / 2;
const height = globalThis.innerHeight;

const scene = new EASEL.Scene();

const aspect = width / height;
const camera = new EASEL.OrthoCamera(
	-5 * aspect,
	5 * aspect,
	5,
	-5,
	0.1,
	1000,
);
camera.position.set(5, 5, 5);
camera.lookAt(scene.position);

const renderer = new EASEL.CanvasRenderer();
renderer.setSize(width, height);
globalThis.document.body.appendChild(renderer.domElement);

const planeShape = new EASEL.PlaneShape(10, 10);
const planeMaterial = new EASEL.SimpleMaterial({
	color: 0x808080,
	side: EASEL.Side.DOUBLE,
});
const plane = new EASEL.Mesh(planeShape, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

const createBlock = (x: number, y: number, z: number, color: number): void => {
	const shape = new EASEL.CubeShape(1, 1, 1);
	const material = new EASEL.SimpleMaterial({ color });
	const block = new EASEL.Mesh(shape, material);
	block.position.set(x, y, z);
	scene.add(block);
};

createBlock(-1, 0.5, -1, 0xFF0000);
createBlock(0, 0.5, 0, 0x00FF00);
createBlock(1, 0.5, 1, 0x0000FF);

function animate(): void {
	globalThis.requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

globalThis.addEventListener("resize", () => {
	const aspect = width / height;
	camera.left = -5 * aspect;
	camera.right = 5 * aspect;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
});
