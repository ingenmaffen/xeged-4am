import { Mesh, PerspectiveCamera, Scene, WebGLRenderer, Clock, BoxGeometry, MeshNormalMaterial } from "three";
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

interface PlayerMovement {
  forward: boolean;
  backwards: boolean;
  left: boolean;
  right: boolean;
}

enum KeydownDirection {
  FORWARD = "w",
  BACKWARDS = "s",
  LEFT = "a",
  RIGHT = "d",
}

export const initRender = () => {
  window.addEventListener("resize", handleWindowResize);
  setupControls(renderer.domElement, camera);
  animate();
  return renderer.domElement;
};

const movingObjects: MovingObjects[] = [];
const clock = new Clock();
const scene = new Scene();
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraTarget = new Mesh(new BoxGeometry(0.01, 0.01, 0.01), new MeshNormalMaterial({ wireframe: true }));
const renderer = new WebGLRenderer({ antialias: true });
const cameraTargetDistance = 0.2;
let horizontalRotation = 0;
let verticalRotation = 0;
const playerMovement: PlayerMovement = {
  forward: false,
  backwards: false,
  left: false,
  right: false,
};

renderer.setSize(window.innerWidth, window.innerHeight);

setupScene(scene, movingObjects);

// default camera position
// TODO: update when autosave is implemented
camera.position.set(0, 3, 10);
cameraTarget.visible = false;
cameraTarget.position.set(camera.position.x, camera.position.y, camera.position.z - cameraTargetDistance);
scene.add(cameraTarget);

// calculate move direction for every moving object
movingObjects.forEach((object) => {
  object.isMovingPositive = Boolean(object.initialMoveDirection);
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

  updatePlayerPosition(deltaMovement);
  camera.lookAt(cameraTarget.position);
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

// move to separate file

const setupControls = (canvas, camera) => {
  const cameraMoveSpeed = 0.25;
  const verticalTreshold = Math.PI * 0.45;

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  canvas.addEventListener("mousemove", (event) => {
    if (document.pointerLockElement === canvas) {
      horizontalRotation -= event.movementX * (Math.PI / 180) * cameraMoveSpeed;
      verticalRotation += event.movementY * (Math.PI / 180) * cameraMoveSpeed;
      horizontalRotation = horizontalRotation % (Math.PI * 2);
      verticalRotation = verticalRotation % Math.PI;
      verticalRotation = verticalRotation < -verticalTreshold ? -verticalTreshold : verticalRotation;
      verticalRotation = verticalRotation > verticalTreshold ? verticalTreshold : verticalRotation;

      updateCameraPosition(horizontalRotation, verticalRotation, cameraTarget, camera);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (document.pointerLockElement === canvas) {
      switch (event.key) {
        case KeydownDirection.FORWARD:
          playerMovement.forward = true;
          break;
        case KeydownDirection.BACKWARDS:
          playerMovement.backwards = true;
          break;
        case KeydownDirection.LEFT:
          playerMovement.left = true;
          break;
        case KeydownDirection.RIGHT:
          playerMovement.right = true;
          break;
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    if (document.pointerLockElement === canvas) {
      switch (event.key) {
        case KeydownDirection.FORWARD:
          playerMovement.forward = false;
          break;
        case KeydownDirection.BACKWARDS:
          playerMovement.backwards = false;
          break;
        case KeydownDirection.LEFT:
          playerMovement.left = false;
          break;
        case KeydownDirection.RIGHT:
          playerMovement.right = false;
          break;
      }
    }
  });
};

const updatePlayerPosition = (delta) => {
  const playerSpeedMultiplier = 0.1 * delta;
  if (playerMovement.forward) {
    camera.position.x -= Math.sin(horizontalRotation) * playerSpeedMultiplier;
    camera.position.z -= Math.cos(horizontalRotation) * playerSpeedMultiplier;
  }
  if (playerMovement.backwards) {
    camera.position.x += Math.sin(horizontalRotation) * playerSpeedMultiplier;
    camera.position.z += Math.cos(horizontalRotation) * playerSpeedMultiplier;
  }
  if (playerMovement.left) {
    camera.position.x -= Math.cos(horizontalRotation) * playerSpeedMultiplier;
    camera.position.z += Math.sin(horizontalRotation) * playerSpeedMultiplier;
  }
  if (playerMovement.right) {
    camera.position.x += Math.cos(horizontalRotation) * playerSpeedMultiplier;
    camera.position.z -= Math.sin(horizontalRotation) * playerSpeedMultiplier;
  }
  updateCameraPosition(horizontalRotation, verticalRotation, cameraTarget, camera);
};

const updateCameraPosition = (horizontalRotation: number, verticalRotation: number, cameraTarget: Mesh, camera: PerspectiveCamera) => {
  cameraTarget.position.x = camera.position.x - cameraTargetDistance * Math.sin(horizontalRotation);
  cameraTarget.position.y = camera.position.y - cameraTargetDistance * Math.sin(verticalRotation);
  cameraTarget.position.z = camera.position.z - cameraTargetDistance * Math.cos(horizontalRotation);
};
