import { Mesh, PerspectiveCamera, Scene, WebGLRenderer, Clock } from "three";
import { PointerLockControls } from "../../node_modules/three/examples/jsm/controls/PointerLockControls";
import { setupScene } from "./scene-setup";

export enum MoveDirection {
  X = "x",
  Y = "y",
  Z = "z",
}

export enum InitialMoveDirection {
  Minus,
  Plus,
}

export interface MovingObjects {
  mesh: Mesh;
  initialPosition: { x: number; y: number; z: number };
  moveDirection: MoveDirection;
  initialMoveDirection: InitialMoveDirection;
  moveBetweenRelative: { min: number; max: number };
  moveSpeed: number;
  rotationDirection: MoveDirection;
  rotationSpeed: number;
  isMovingPositive?: boolean;
}

export const initRender = () => {
  window.addEventListener("resize", handleWindowResize);
  animate();
  return renderer.domElement;
};

const movingObjects: MovingObjects[] = [];
const scene = new Scene();
setupScene(scene, movingObjects);
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const clock = new Clock();

// calculate move direction for every moving object
movingObjects.forEach((object) => {
  object.isMovingPositive = Boolean(object.initialMoveDirection);
});

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new PointerLockControls(camera, renderer.domElement);
controls.movementSpeed = 10;
// controls.dragToLook = true;
camera.position.set(0, 5, 10);

renderer.domElement.addEventListener("click", function () {
  controls.lock();
});

const animate = () => {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const deltaMovement = delta * 100;

  movingObjects.forEach((object) => {
    if (object.isMovingPositive) {
      object.mesh.position[object.moveDirection] += object.moveSpeed * deltaMovement;
      object.isMovingPositive = object.mesh.position[object.moveDirection] < object.initialPosition[object.moveDirection] + object.moveBetweenRelative.max;
    } else {
      object.mesh.position[object.moveDirection] -= object.moveSpeed * deltaMovement;
      object.isMovingPositive = object.mesh.position[object.moveDirection] < object.initialPosition[object.moveDirection] + object.moveBetweenRelative.min;
    }

    object.mesh.rotation[object.rotationDirection] += object.rotationSpeed * deltaMovement;
  });

  controls.update(delta);

  renderer.render(scene, camera);
};

const handleWindowResize = () => {
  const HEIGHT = window.innerHeight;
  const WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  const aspectRatio = WIDTH / HEIGHT;

  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
};
