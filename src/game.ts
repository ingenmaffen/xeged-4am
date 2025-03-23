import { Mesh, PerspectiveCamera, Scene, WebGLRenderer } from "three";
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
};

const movingObjects: MovingObjects[] = [];
const scene = new Scene();
setupScene(scene, movingObjects);
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

// camera rotation limits for v0.9
let cameraRotationPositive = false;
const cameraRotationSpeed = 0.001;

// calculate move direction for every moving object
movingObjects.forEach((object) => {
  object.isMovingPositive = Boolean(object.initialMoveDirection);
});

camera.position.y += 2;
camera.position.z = 5;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const animate = () => {
  requestAnimationFrame(animate);
  // camera.rotation.y -= 0.001;

  if (cameraRotationPositive) {
    camera.rotation.y += cameraRotationSpeed;
    cameraRotationPositive = camera.rotation.y < Math.PI / 6;
  } else {
    camera.rotation.y -= cameraRotationSpeed;
    cameraRotationPositive = camera.rotation.y < -Math.PI / 6;
  }

  movingObjects.forEach((object) => {
    if (object.isMovingPositive) {
      object.mesh.position[object.moveDirection] += object.moveSpeed;
      object.isMovingPositive = object.mesh.position[object.moveDirection] < object.initialPosition[object.moveDirection] + object.moveBetweenRelative.max;
    } else {
      object.mesh.position[object.moveDirection] -= object.moveSpeed;
      object.isMovingPositive = object.mesh.position[object.moveDirection] < object.initialPosition[object.moveDirection] + object.moveBetweenRelative.min;
    }

    object.mesh.rotation[object.rotationDirection] += object.rotationSpeed;
  });

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
