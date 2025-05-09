// deno-lint-ignore no-external-import
import * as THREE from "https://esm.sh/three";
import { OBJLoader } from "https://esm.sh/three/examples/jsm/loaders/OBJLoader.js";

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

const material = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true,
});

let dotObj: THREE.Object3D | null = null;
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
		dotObj = object as unknown as THREE.Group;
		scene.add(object as unknown as THREE.Group);
	},
	(xhr) => console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`),
	(error) => console.error("an error occurred:", error),
);

const keys: { [key: string]: boolean } = {};
let wireframeToggle = false;
let rotateObject = false;
globalThis.document.addEventListener(
	"keydown",
	(event) => {
		keys[event.key.toLowerCase()] = true;
		if (event.key.toLowerCase() === "z" && !wireframeToggle) {
			material.wireframe = !material.wireframe;
			wireframeToggle = true;
		}
		if (event.key.toLowerCase() === "r") {
			rotateObject = !rotateObject;
		}
	},
);
globalThis.document.addEventListener(
	"keyup",
	(event) => {
		keys[event.key.toLowerCase()] = false;
		if (event.key.toLowerCase() === "z") {
			wireframeToggle = false;
		}
	},
);

const speed = 0.05 / 2;
const rotSpeed = 0.02 / 2;

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

	// object rotation
	if (rotateObject && dotObj) {
		dotObj.rotation.y += rotSpeed;
		dotObj.rotation.x += rotSpeed * 0.7;
		dotObj.rotation.z += rotSpeed * 0.3;
	}

	renderer.render(scene, camera);
}
animate();
