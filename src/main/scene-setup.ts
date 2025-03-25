import { AmbientLight, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, Scene, TextureLoader } from "three";
import { OBJLoader } from "../../node_modules/three/examples/jsm/Addons";
import { loadShape } from "./load-shape";
import { bush1, bush2, hill, objectInTheSky1, spinningShitOnTheLeft } from "./objects";
import { InitialMoveDirection, MoveDirection, MovingObject } from "./global-types";

export const setupScene = (scene: Scene, movingObjects: MovingObject[]) => {
  scene.background = new Color(0xc816db);

  // let there be light
  const light = new AmbientLight(0xffffff, 2.8);
  scene.add(light);

  // add floor
  const geometry = new PlaneGeometry(100, 100);
  const material = new MeshBasicMaterial({ color: 0xd6b511 });
  const plane = new Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // hill on the left side of the initial view
  const hillMesh = loadShape(hill.vertexData, 0xd6b511, false, true, hill.indexData);
  hillMesh.position.x = -20;
  hillMesh.position.z = -40;
  hillMesh.rotation.x = Math.PI / 2;
  scaleMesh(hillMesh, 5);
  scene.add(hillMesh);

  // flying object
  const skyObject1 = loadShape(objectInTheSky1.vertexData, 0xff0000, true, true, objectInTheSky1.indexData);
  const skyObject1InitialPosition = { x: 2, y: 10, z: -20 };
  skyObject1.position.z = skyObject1InitialPosition.z;
  skyObject1.position.y = skyObject1InitialPosition.y;
  skyObject1.position.x = skyObject1InitialPosition.x;
  scaleMesh(skyObject1, 0.8);
  skyObject1.rotation.z = -Math.PI / 2;
  scene.add(skyObject1);

  movingObjects.push({
    mesh: skyObject1,
    initialPosition: skyObject1InitialPosition,
    moveDirection: MoveDirection.Y,
    initialMoveDirection: InitialMoveDirection.Plus,
    moveBetweenRelative: { min: -2, max: 2 },
    moveSpeed: 0.025,
    rotationDirection: MoveDirection.Y,
    rotationSpeed: 0.005,
  });

  // bush to the right
  const bush1Mesh = loadShape(bush1.vertexData, 0x006400, true, false);
  scaleMesh(bush1Mesh, 0.25);
  bush1Mesh.rotation.y = Math.PI / 2;
  bush1Mesh.position.z = -5;
  bush1Mesh.position.x = 10;
  bush1Mesh.position.y = 2;
  scene.add(bush1Mesh);

  // spinning shit
  const spinningShit = loadShape(spinningShitOnTheLeft.vertexData, 0xdb0f53, false, true, spinningShitOnTheLeft.indexData);
  spinningShit.position.z = -10;
  spinningShit.position.x = -10;
  spinningShit.position.y = 5;
  spinningShit.rotation.x = Math.PI;
  scaleMesh(spinningShit, 0.5);
  scene.add(spinningShit);

  movingObjects.push({
    mesh: spinningShit,
    initialPosition: { x: 0, y: 0, z: 0 },
    moveDirection: MoveDirection.Y,
    initialMoveDirection: InitialMoveDirection.Plus,
    moveBetweenRelative: { min: 0, max: 0 },
    moveSpeed: 0,
    rotationDirection: MoveDirection.Y,
    rotationSpeed: 0.25,
  });

  // bush on the far left
  const bush2Mesh = loadShape(bush2.vertexData, 0x006400, true, false);
  scaleMesh(bush2Mesh, 0.25);
  bush2Mesh.rotation.y = Math.PI / 3;
  bush2Mesh.position.z = 2;
  bush2Mesh.position.x = -8;
  bush2Mesh.position.y = 2;
  scene.add(bush2Mesh);

  // ugly banana
  new TextureLoader().load("/assets/banana/banana.jpg", (bananaTexture) => {
    const bananaMaterial = new MeshPhongMaterial({ map: bananaTexture });
    // const normalMaterial = new MeshNormalMaterial();
    const objectLoader = new OBJLoader();
    objectLoader.load("/assets/banana/banana.obj", (bananaMesh: Mesh) => {
      const banana = new Mesh(bananaMesh.children[0]["geometry"].clone(), bananaMaterial);
      banana.position.set(0, -2, -10);
      banana.rotation.x = -Math.PI / 2;
      scaleMesh(banana, 0.5);
      scene.add(banana);

      movingObjects.push({
        mesh: banana,
        initialPosition: { x: 0, y: -2, z: -10 },
        moveDirection: MoveDirection.Y,
        initialMoveDirection: InitialMoveDirection.Plus,
        moveBetweenRelative: { min: -1, max: 1 },
        moveSpeed: 0.015,
        rotationDirection: MoveDirection.Z,
        rotationSpeed: 0.01,
      });
    });
  });
};

const scaleMesh = (mesh, scale) => {
  mesh.scale.x = scale;
  mesh.scale.y = scale;
  mesh.scale.z = scale;
};
