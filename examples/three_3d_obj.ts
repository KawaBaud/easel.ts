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

let currentMaterial = material;
let flatShading = false;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

let myObject: THREE.Object3D | null = null;
const loader = new OBJLoader();
loader.load(
	"https://raw.githubusercontent.com/McNopper/OpenGL/refs/heads/master/Binaries/monkey.obj",
	(object) => {
		object.scale.setScalar(0.4);
		object.traverse((child) => {
			if (child instanceof THREE.Mesh) child.material = currentMaterial;
		});
		object.position.sub(
			new THREE.Box3().setFromObject(object as unknown as THREE.Object3D)
				.getCenter(new THREE.Vector3()),
		);

		myObject = object as unknown as THREE.Group;
		scene.add(object as unknown as THREE.Group);
	},
	(xhr) => console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`),
	(error) => console.error("an error occurred:", error),
);

const keys: { [key: string]: boolean } = {};
let wireframeToggle = false;
let flatShadingToggle = false;
let rotateObject = false;

globalThis.document.addEventListener(
	"keydown",
	(event) => {
		keys[event.key.toLowerCase()] = true;
		if (event.key.toLowerCase() === "z" && !wireframeToggle) {
			currentMaterial.wireframe = !currentMaterial.wireframe;
			wireframeToggle = true;
		}
		if (event.key.toLowerCase() === "f" && !flatShadingToggle) {
			if (!currentMaterial.wireframe) {
				flatShading = !flatShading;
				updateMaterialShading();
			}
			flatShadingToggle = true;
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
		if (event.key.toLowerCase() === "f") {
			flatShadingToggle = false;
		}
	},
);

function updateMaterialShading() {
	if (currentMaterial.wireframe) return;

	const newMaterial = flatShading
		? new THREE.MeshLambertMaterial({
			color: 0x00ff00,
			flatShading: true,
		})
		: new THREE.MeshBasicMaterial({
			color: 0x00ff00,
		});

	if (myObject) {
		myObject.traverse((child) => {
			if (child instanceof THREE.Mesh) child.material = newMaterial;
		});
	}

	currentMaterial = newMaterial as typeof currentMaterial;
}

const speed = 0.05 / 2;
const rotSpeed = 0.02 / 2;
const spinSpeed = 0.005 / 2;

function animate(): void {
	globalThis.requestAnimationFrame(animate);

	const direction = new THREE.Vector3();
	if (keys["w"]) direction.z -= 1;
	if (keys["s"]) direction.z += 1;
	if (keys["a"]) direction.x -= 1;
	if (keys["d"]) direction.x += 1;
	if (keys[" "]) direction.y += 1;
	if (keys["shift"]) direction.y -= 1;
	direction.normalize().applyEuler(camera.rotation).multiplyScalar(speed);
	camera.position.add(direction);

	if (keys["q"]) camera.rotation.y += rotSpeed;
	if (keys["e"]) camera.rotation.y -= rotSpeed;

	if (rotateObject && myObject) {
		myObject.rotation.y += spinSpeed;
		myObject.rotation.x += spinSpeed * 0.7;
		myObject.rotation.z += spinSpeed * 0.3;
	}

	renderer.render(scene, camera);
}
animate();
