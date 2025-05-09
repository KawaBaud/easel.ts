import { OBJLoader } from "../src/loaders/OBJLoader.ts";
import { EASEL } from "../src/mod.ts";
import type { Object3D } from "../src/objects/Object3D.ts";

const scene = new EASEL.Scene();
const camera = new EASEL.PerspCamera(
	70,
	globalThis.innerWidth / 2 / globalThis.innerHeight,
	0.1,
	1000,
);
camera.position.z = 5;

const renderer = new EASEL.CanvasRenderer();
renderer.setSize(globalThis.innerWidth / 2, globalThis.innerHeight);
globalThis.document.body.appendChild(renderer.domElement);

const material = new EASEL.Material({
	color: 0x00ff00,
	wireframe: true,
});

let dotObj: Object3D | null = null;
const loader = new OBJLoader();
loader.load(
	"https://raw.githubusercontent.com/McNopper/OpenGL/refs/heads/master/Binaries/monkey.obj",
	(object) => {
		object.scale.setScalar(0.4);
		object.traverse((child) => {
			if (child instanceof EASEL.Mesh) child.material = material;
		});
		object.position.sub(
			new EASEL.Box3().setFromObject(object)
				.getCentre(new EASEL.Vector3()),
		);
		scene.add(object);
		dotObj = object;
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
const spinSpeed = 0.005 / 2;

function animate(): void {
	globalThis.requestAnimationFrame(animate);

	// movement
	const direction = new EASEL.Vector3();
	if (keys["w"]) direction.z -= 1;
	if (keys["s"]) direction.z += 1;
	if (keys["a"]) direction.x -= 1;
	if (keys["d"]) direction.x += 1;
	if (keys[" "]) direction.y += 1;
	if (keys["shift"]) direction.y -= 1;
	direction.unitize().applyEuler(camera.rotation).mulScalar(speed);
	camera.position.add(direction);

	// rotation
	if (keys["q"]) camera.rotation.y += rotSpeed;
	if (keys["e"]) camera.rotation.y -= rotSpeed;

	// object rotation
	if (rotateObject && dotObj) {
		dotObj.rotation.y += spinSpeed;
		dotObj.rotation.x += spinSpeed * 0.7;
		dotObj.rotation.z += spinSpeed * 0.3;
	}

	renderer.render(scene, camera);
}
animate();
