import { OBJLoader } from "../src/loaders/OBJLoader.ts";
import { EASEL } from "../src/mod.ts";

const width = globalThis.innerWidth / 2;
const height = globalThis.innerHeight;

const scene = new EASEL.Scene();
const camera = new EASEL.PerspCamera(
	70,
	width / height,
	0.1,
	1000,
);
camera.position.z = 5;

const renderer = new EASEL.CanvasRenderer();
renderer.setSize(width, height);
globalThis.document.body.appendChild(renderer.domElement);

const material = new EASEL.SimpleMaterial({
	color: 0x00ff00,
	wireframe: true,
});

const loader = new OBJLoader();
loader.load(
	"https://raw.githubusercontent.com/McNopper/OpenGL/refs/heads/master/Binaries/monkey.obj",
	(object) => {
		object.scale.setScalar(0.4);
		object.traverse((child) => {
			if (child instanceof EASEL.Mesh) child.material = material;
		});
		object.position.sub(
			new EASEL.Box3().setFromObject(object).getCentre(new EASEL.Vector3()),
		);
		scene.add(object);
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

const clock = new EASEL.Clock();
const fps = 1 / 30;
const speed = 1;
const rotSpeed = 0.35;

function animate(): void {
	globalThis.requestAnimationFrame(animate);

	const deltaTime = EASEL.Maths.fastMin(clock.delta, 0.1);
	let accumulatedTime = 0;

	while (accumulatedTime < deltaTime) {
		const direction = new EASEL.Vector3();
		if (keys["w"]) direction.z -= 1;
		if (keys["s"]) direction.z += 1;
		if (keys["a"]) direction.x -= 1;
		if (keys["d"]) direction.x += 1;
		if (keys[" "]) direction.y += 1;
		if (keys["shift"]) direction.y -= 1;
		direction.unitize().applyEuler(camera.rotation).mulScalar(speed * fps);
		camera.position.add(direction);

		if (keys["q"]) camera.rotation.y += rotSpeed * fps;
		if (keys["e"]) camera.rotation.y -= rotSpeed * fps;

		accumulatedTime += fps;
	}

	renderer.render(scene, camera);
}
animate();
