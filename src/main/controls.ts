import { Mesh, PerspectiveCamera } from "three";

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

let horizontalRotation = 0;
let verticalRotation = 0;
let devMode = false;
const ongoingTouches = new Map();
const playerMovement: PlayerMovement = {
  forward: false,
  backwards: false,
  left: false,
  right: false,
};

export const cameraTargetDistance = 0.2;

export const setupControls = (canvas: HTMLCanvasElement, camera: PerspectiveCamera, cameraTarget: Mesh, isDevMode = false) => {
  devMode = isDevMode;

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  canvas.addEventListener("mousemove", (event) => {
    if (document.pointerLockElement === canvas) {
      moveCamera(event.movementX, event.movementY, camera, cameraTarget);
    }
  });

  // add touch event
  canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();

    for (const changedTouch of event.changedTouches) {
      const touch = {
        startX: changedTouch.pageX,
        startY: changedTouch.pageY,
        targetX: changedTouch.pageX,
        targetY: changedTouch.pageY,
        cameraMove: changedTouch.pageX > window.innerWidth / 2,
      };
      ongoingTouches.set(changedTouch.identifier, touch);
    }
  });

  canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();

    for (const changedTouch of event.changedTouches) {
      const touch = {
        ...ongoingTouches.get(changedTouch.identifier),
        targetX: changedTouch.pageX,
        targetY: changedTouch.pageY,
      };
      ongoingTouches.set(changedTouch.identifier, touch);
    }
  });

  canvas.addEventListener("touchend", (event) => {
    event.preventDefault();

    for (const changedTouch of event.changedTouches) {
      ongoingTouches.delete(changedTouch.identifier);
    }
  });

  // if orientation is landscape, normal controls
  // otherwise calculate things differently

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

export const updatePlayerPosition = (delta: number, camera: PerspectiveCamera, cameraTarget: Mesh) => {
  const radius = Math.min(window.innerHeight, window.innerWidth) / 10;

  let playerSpeedMultiplier = 0.1 * delta;
  playerSpeedMultiplier *= devMode ? 10 : 1;
  if (playerMovement.forward) {
    camera.position.x -= Math.sin(horizontalRotation) * playerSpeedMultiplier;
    camera.position.z -= Math.cos(horizontalRotation) * playerSpeedMultiplier;
    camera.position.y -= devMode ? Math.sin(verticalRotation) * playerSpeedMultiplier : 0;
  }
  if (playerMovement.backwards) {
    camera.position.x += Math.sin(horizontalRotation) * playerSpeedMultiplier;
    camera.position.z += Math.cos(horizontalRotation) * playerSpeedMultiplier;
    camera.position.y += devMode ? Math.sin(verticalRotation) * playerSpeedMultiplier : 0;
  }
  if (playerMovement.left) {
    camera.position.x -= Math.cos(horizontalRotation) * playerSpeedMultiplier;
    camera.position.z += Math.sin(horizontalRotation) * playerSpeedMultiplier;
  }
  if (playerMovement.right) {
    camera.position.x += Math.cos(horizontalRotation) * playerSpeedMultiplier;
    camera.position.z -= Math.sin(horizontalRotation) * playerSpeedMultiplier;
  }

  // handle touch controls
  ongoingTouches.forEach((touch) => {
    if (touch.cameraMove) {
      // camera move
      const movementX = touch.targetX - touch.startX;
      const movementY = touch.targetY - touch.startY;
      touch.startX = touch.targetX;
      touch.startY = touch.targetY;
      touch.cameraMove = true;
      moveCamera(movementX * 2, movementY * 2, camera, cameraTarget);
    } else {
      // player move
      const movementX = touch.targetX - touch.startX;
      const movementY = touch.targetY - touch.startY;
      const moveWeigthX = movementX > radius ? movementX / Math.abs(movementX) : movementX / radius;
      const moveWeigthY = movementY > radius ? movementY / Math.abs(movementY) : movementY / radius;
      const degree = Math.atan(moveWeigthY / moveWeigthX);
      const direction = degree / Math.abs(degree);

      camera.position.x += Math.cos(nanToZero(degree) - horizontalRotation) * playerSpeedMultiplier * moveWeigthX;
      camera.position.z += Math.cos(nanToZero(degree) - horizontalRotation) * playerSpeedMultiplier * moveWeigthY;
      camera.position.y += devMode ? Math.sin(verticalRotation) * playerSpeedMultiplier * nanToZero(direction) : 0;
      console.log(camera.position);
    }
  });

  updateCameraPosition(camera, cameraTarget);
};

const moveCamera = (movementX, movementY, camera, cameraTarget) => {
  const cameraMoveSpeed = 0.25;
  const verticalTreshold = Math.PI * 0.45;

  horizontalRotation -= movementX * (Math.PI / 180) * cameraMoveSpeed;
  verticalRotation += movementY * (Math.PI / 180) * cameraMoveSpeed;
  horizontalRotation = horizontalRotation % (Math.PI * 2);
  verticalRotation = verticalRotation % Math.PI;
  verticalRotation = verticalRotation < -verticalTreshold ? -verticalTreshold : verticalRotation;
  verticalRotation = verticalRotation > verticalTreshold ? verticalTreshold : verticalRotation;

  updateCameraPosition(camera, cameraTarget);
};

const updateCameraPosition = (camera: PerspectiveCamera, cameraTarget: Mesh) => {
  cameraTarget.position.x = camera.position.x - cameraTargetDistance * Math.sin(horizontalRotation);
  cameraTarget.position.y = camera.position.y - cameraTargetDistance * Math.sin(verticalRotation);
  cameraTarget.position.z = camera.position.z - cameraTargetDistance * Math.cos(horizontalRotation);
};

// TODO: fix NaN issues
const nanToZero = (value) => {
  if (Number.isNaN(value)) {
    return 0;
  }
  return value;
};
