// deno-lint-ignore no-external-import
import * as THREE from "https://esm.sh/three";
import { OBJLoader } from "https://esm.sh/three/examples/jsm/loaders/OBJLoader.js";

const width = globalThis.innerWidth / 2;
const height = globalThis.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	70,
	width / height,
	0.1,
	1000,
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
	powerPreference: "high-performance",
});
renderer.setSize(width, height);
globalThis.document.body.appendChild(renderer.domElement);

const material = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true,
});

const loader = new OBJLoader();
loader.load(
	"https://raw.githubusercontent.com/McNopper/OpenGL/refs/heads/master/Binaries/monkey.obj",
	(object) => {
		object.scale.setScalar(0.4);
		object.traverse((child) => {
			if (child instanceof THREE.Mesh) child.material = material;
		});
		object.position.sub(
			new THREE.Box3().setFromObject(object as unknown as THREE.Object3D)
				.getCenter(new THREE.Vector3()),
		);
		scene.add(object as unknown as THREE.Object3D);
	},
	(xhr) => console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`),
	(error) => console.error("an error occurred:", error),
);

const keys: { [key: string]: boolean } = {};
let wireframeToggle = false;

globalThis.document.addEventListener("keydown", (event) => {
	keys[event.key.toLowerCase()] = true;

	if (event.key.toLowerCase() === "z" && !wireframeToggle) {
		material.wireframe = !material.wireframe;
		wireframeToggle = true;
	}
});

globalThis.document.addEventListener("keyup", (event) => {
	keys[event.key.toLowerCase()] = false;
	if (event.key.toLowerCase() === "z") wireframeToggle = false;
});

const clock = new THREE.Clock();
const fps = 1 / 30;
const speed = 1;
const rotSpeed = 0.35;

function animate(): void {
	globalThis.requestAnimationFrame(animate);

	const deltaTime = Math.min(clock.getDelta(), 0.1);
	let accumulatedTime = 0;

	while (accumulatedTime < deltaTime) {
		const direction = new THREE.Vector3();
		if (keys["w"]) direction.z -= 1;
		if (keys["s"]) direction.z += 1;
		if (keys["a"]) direction.x -= 1;
		if (keys["d"]) direction.x += 1;
		if (keys[" "]) direction.y += 1;
		if (keys["shift"]) direction.y -= 1;
		direction.normalize().applyEuler(camera.rotation).multiplyScalar(
			speed * fps,
		);
		camera.position.add(direction);

		if (keys["q"]) camera.rotation.y += rotSpeed * fps;
		if (keys["e"]) camera.rotation.y -= rotSpeed * fps;

		accumulatedTime += fps;
	}

	renderer.render(scene, camera);
}
animate();
