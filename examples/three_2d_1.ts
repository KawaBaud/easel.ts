// deno-lint-ignore no-external-import
import * as THREE from "https://esm.sh/three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEEEEEE);

const aspect = globalThis.innerWidth / 2 / globalThis.innerHeight;
const frustumSize = 20;
const camera = new THREE.OrthographicCamera(
	frustumSize * aspect / -2,
	frustumSize * aspect / 2,
	frustumSize / 2,
	frustumSize / -2,
	0.1, // near
	1000, // far
);

camera.position.set(20, 20, 20);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(globalThis.innerWidth / 2, globalThis.innerHeight);
globalThis.document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const material1 = new THREE.MeshBasicMaterial({
	color: 0xFF0000,
}); // Red
const cube1 = new THREE.Mesh(boxGeometry, material1);
cube1.position.set(0, 0.5, 0);
scene.add(cube1);

const material2 = new THREE.MeshBasicMaterial({
	color: 0x00FF00,
}); // Green
const cube2 = new THREE.Mesh(boxGeometry, material2);
cube2.position.set(1, 0.5, 0);
scene.add(cube2);

const material3 = new THREE.MeshBasicMaterial({
	color: 0x0000FF,
}); // Blue
const cube3 = new THREE.Mesh(boxGeometry, material3);
cube3.position.set(0, 0.5, 1);
scene.add(cube3);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
	color: 0xCCCCCC,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
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
