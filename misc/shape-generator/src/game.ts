import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { getMesh } from "./generate-shape";
import { getMeshFromEqualVertices } from "./generate-equilateral-vertex-shapes";

export const initRender = () => {
  window.addEventListener("resize", handleWindowResize);
  animate();
};

let isDirectionDown = false;
const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z += 5;

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const mesh = getMeshFromEqualVertices();
const mesh = getMesh();
const initialYPosition = mesh.position.y;
scene.add(mesh);

camera.position.z = 5;

const animate = () => {
  requestAnimationFrame(animate);
  const speed = 0.005;
  const moveLimit = 0.65;
  if (isDirectionDown) {
    mesh.position.y -= speed;
    isDirectionDown = mesh.position.y - initialYPosition > -moveLimit;
  } else {
    mesh.position.y += speed;
    isDirectionDown = mesh.position.y - initialYPosition > moveLimit;
  }

  mesh.rotation.y += 0.0025;

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
