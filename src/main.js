import { MUSI } from "./MUSI.js";

const scene = MUSI.Scene();
const camera = MUSI.PerspCamera(
    70,
    globalThis.innerWidth / globalThis.innerHeight,
    0.1,
    1000,
);
camera.position.z = 5;

const renderer = MUSI.CanvasRenderer();
globalThis.document.body.appendChild(renderer.domElement);

const shape = MUSI.CubeShape();
const material = MUSI.Material({ colour: 0x00FF00, wireframe: true });
const cube = MUSI.Mesh(shape, material);
scene.add(cube);

const keys = {};
globalThis.document.addEventListener(
    "keydown",
    (event) => keys[event.key.toLowerCase()] = true,
);
globalThis.document.addEventListener(
    "keyup",
    (event) => keys[event.key.toLowerCase()] = false,
);

const speed = 0.05;
const rotationSpeed = 0.02;

function animate() {
    requestAnimationFrame(animate);

    // movement
    const direction = MUSI.Vector3();
    if (keys["w"]) direction.z -= 1;
    if (keys["s"]) direction.z += 1;
    if (keys["a"]) direction.x -= 1;
    if (keys["d"]) direction.x += 1;
    if (keys[" "]) direction.y += 1;
    if (keys["shift"]) direction.y -= 1;
    direction.unit().applyEuler(camera.rotation).mulScalar(speed);
    camera.position.add(direction);

    // rotation
    if (keys["q"]) camera.rotation.y += rotationSpeed;
    if (keys["e"]) camera.rotation.y -= rotationSpeed;

    renderer.render(scene, camera);
}
animate();
