// deno-lint-ignore no-external-import
import * as THREE from "https://esm.sh/three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	70,
	globalThis.innerWidth / 2 / globalThis.innerHeight,
	0.1,
	1000,
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(globalThis.innerWidth / 2, globalThis.innerHeight);
globalThis.document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const keys: { [key: string]: boolean } = {};
globalThis.document.addEventListener(
	"keydown",
	(event) => keys[event.key.toLowerCase()] = true,
);
globalThis.document.addEventListener(
	"keyup",
	(event) => keys[event.key.toLowerCase()] = false,
);

const speed = 0.05;
const rotSpeed = 0.02;

function animate(): void {
	globalThis.requestAnimationFrame(animate);

	// movement
	const direction = new THREE.Vector3();
	if (keys["w"]) direction.z -= 1;
	if (keys["s"]) direction.z += 1;
	if (keys["a"]) direction.x -= 1;
	if (keys["d"]) direction.x += 1;
	if (keys[" "]) direction.y += 1;
	if (keys["shift"]) direction.y -= 1;
	direction.normalize().applyEuler(camera.rotation).multiplyScalar(speed);
	camera.position.add(direction);

	// rotation
	if (keys["q"]) camera.rotation.y += rotSpeed;
	if (keys["e"]) camera.rotation.y -= rotSpeed;

	renderer.render(scene, camera);
}
animate();
