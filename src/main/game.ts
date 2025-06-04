import { Mesh, PerspectiveCamera, Scene, WebGLRenderer, Clock, BoxGeometry, MeshNormalMaterial } from "three";
import { setupScene } from "./scene-setup";
import { cameraTargetDistance, setupControls, updatePlayerPosition } from "./controls";
import { BananaWrapper, MovingObject } from "./global-types";

export const initRender = (isDevMode = false) => {
  window.addEventListener("resize", handleWindowResize);
  setupControls(renderer.domElement, camera, cameraTarget, isDevMode);
  animate();
  return renderer.domElement;
};

const audio = new Audio("/assets/rotating_banana_sfx.wav");
const bananaWrapper: BananaWrapper = {
  bananaMesh: null,
  colliderMesh: null,
};
const movingObjects: MovingObject[] = [];
const clock = new Clock();
const scene = new Scene();
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraTarget = new Mesh(new BoxGeometry(0.01, 0.01, 0.01), new MeshNormalMaterial({ visible: false }));
const renderer = new WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

setupScene(scene, movingObjects, bananaWrapper);

// default camera position
// TODO: update when autosave is implemented
// TODO: implement autosave
camera.position.set(0, 3, 100);
cameraTarget.visible = false;
cameraTarget.position.set(camera.position.x, camera.position.y, camera.position.z - cameraTargetDistance);
scene.add(cameraTarget);

// calculate move direction for every moving object
movingObjects.forEach((object) => {
  object.isMovingPositive = Boolean(object.initialMoveDirection);
});

const playerColliderBox = new BoxGeometry(1, 1, 1);
const playerColliderMesh = new Mesh(playerColliderBox, new MeshNormalMaterial({ visible: false }));
scene.add(playerColliderMesh);

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

  updatePlayerPosition(deltaMovement, camera, cameraTarget);
  playerColliderMesh.position.set(camera.position.x, camera.position.y, camera.position.z);

  if (bananaWrapper.colliderMesh && getPlayerCollider().intersectsBox(getObjectCollider(bananaWrapper.colliderMesh))) {
    playSfx();
    removeBanana();
  }

  camera.lookAt(cameraTarget.position);
  renderer.render(scene, camera);
};

const getPlayerCollider = () => {
  playerColliderMesh.geometry.computeBoundingBox();
  playerColliderMesh.updateMatrixWorld();
  const playerCollider = playerColliderMesh.geometry.boundingBox.clone();
  playerCollider.applyMatrix4(playerColliderMesh.matrixWorld);
  return playerCollider;
};

const getObjectCollider = (object: Mesh) => {
  object.geometry.computeBoundingBox();
  object.updateMatrixWorld();
  const objectCollider = object.geometry.boundingBox.clone();
  objectCollider.applyMatrix4(object.matrixWorld);
  return objectCollider;
};

const removeBanana = () => {
  scene.remove(bananaWrapper.colliderMesh);
  scene.remove(bananaWrapper.bananaMesh);
  bananaWrapper.colliderMesh = null;
  bananaWrapper.bananaMesh = null;
};

const playSfx = () => {
  audio.play();
};

const handleWindowResize = () => {
  const HEIGHT = window.innerHeight;
  const WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  const aspectRatio = WIDTH / HEIGHT;

  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
};
