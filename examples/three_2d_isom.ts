// deno-lint-ignore no-external-import
import * as THREE from "https://esm.sh/three";

const width = globalThis.innerWidth / 2;
const height = globalThis.innerHeight;

const scene = new THREE.Scene();

const aspect = width / height;
const camera = new THREE.OrthographicCamera(
	-5 * aspect,
	5 * aspect,
	5,
	-5,
	0.1,
	1000,
);
camera.position.set(5, 5, 5);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
globalThis.document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
	color: 0x808080,
	side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

const createBlock = (x: number, y: number, z: number, color: number): void => {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color });
	const block = new THREE.Mesh(geometry, material);
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
	(camera as THREE.OrthographicCamera).left = -5 * aspect;
	(camera as THREE.OrthographicCamera).right = 5 * aspect;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
});
