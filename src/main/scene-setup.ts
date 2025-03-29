import {
  AmbientLight,
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  Scene,
  TextureLoader,
} from "three";
import { OBJLoader } from "../../node_modules/three/examples/jsm/Addons";
import { loadEqualVertexShape, loadShape } from "./load-shape";
import { bush1, bush2, objectInTheSky1, spinningShitOnTheLeft } from "./objects";
import { BananaWrapper, InitialMoveDirection, MinimalVector3, MoveDirection, MovingObject } from "./global-types";
import { roseBase, roseHead } from "./objects/rose";
import { foliage } from "./objects/foliage";
import { hill2 } from "./objects/hill";

export const setupScene = (scene: Scene, movingObjects: MovingObject[], bananaWrapper: BananaWrapper) => {
  scene.background = new Color(0xc042df);

  // let there be light
  const light = new AmbientLight(0xffffff, 2.8);
  scene.add(light);

  // add floor
  const geometry = new PlaneGeometry(500, 500);
  const material = new MeshBasicMaterial({ color: 0xd6b511 });
  const plane = new Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // foliage
  const foliageMesh = loadEqualVertexShape(foliage, {
    color: 0x968773,
    wireframe: false,
    doubleSide: false,
    backSide: true,
  });
  scaleMesh(foliageMesh, 2);
  foliageMesh.rotation.x = Math.PI / 2;
  foliageMesh.position.set(-250, 0.01, -250);
  foliageMesh.position.y += 0.01;
  scene.add(foliageMesh);

  const foliageMesh2 = loadEqualVertexShape(foliage, {
    color: 0x81653f,
    wireframe: false,
    doubleSide: false,
    backSide: true,
  });
  scaleMesh(foliageMesh2, 2);
  foliageMesh2.rotation.x = Math.PI / 2;
  foliageMesh2.rotation.z = Math.PI / 2;
  foliageMesh2.position.set(250, 0.01, -250);
  foliageMesh2.position.y += 0.02;
  scene.add(foliageMesh2);

  // hill on the left side of the initial view
  const hillMesh = loadShape(hill2.vertexData, hill2.indexData, {
    color: 0xd6b511,
    doubleSide: true,
    wireframe: true,
    wireframeColor: 0x000000,
  });
  hillMesh.position.x = -160;
  hillMesh.position.z = -100;
  hillMesh.position.y = 20;
  hillMesh.rotation.y = Math.PI / 4;
  // hillMesh.rotation.z = Math.PI / 3;
  scaleMesh(hillMesh, 0.4);
  scene.add(hillMesh);

  // flying object
  const skyObject1 = loadShape(objectInTheSky1.vertexData, objectInTheSky1.indexData, {
    color: 0xff0000,
    doubleSide: true,
    wireframe: true,
  });
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
  const bush1Mesh = loadShape(bush1.vertexData, null, {
    color: 0x006400,
    doubleSide: false,
    wireframe: true,
  });
  scaleMesh(bush1Mesh, 0.25);
  bush1Mesh.rotation.y = Math.PI / 2;
  bush1Mesh.position.z = -5;
  bush1Mesh.position.x = 10;
  bush1Mesh.position.y = 2;
  scene.add(bush1Mesh);

  // spinning shit
  const spinningShit = loadShape(spinningShitOnTheLeft.vertexData, spinningShitOnTheLeft.indexData, {
    color: 0xdb0f53,
    wireframe: false,
    doubleSide: true,
  });
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
  const bush2Mesh = loadShape(bush2.vertexData, null, {
    color: 0x006400,
    wireframe: true,
    doubleSide: false,
  });
  scaleMesh(bush2Mesh, 0.25);
  bush2Mesh.rotation.y = Math.PI / 3;
  bush2Mesh.position.z = 2;
  bush2Mesh.position.x = -8;
  bush2Mesh.position.y = 2;
  scene.add(bush2Mesh);

  // ugly banana
  new TextureLoader().load("/assets/banana/banana.jpg", (bananaTexture) => {
    const bananaMaterial = new MeshPhongMaterial({ map: bananaTexture });
    const objectLoader = new OBJLoader();
    objectLoader.load("/assets/banana/banana.obj", (bananaMesh: Mesh) => {
      const banana = new Mesh(bananaMesh.children[0]["geometry"].clone(), bananaMaterial);
      const bananaPosition = { x: 20, y: -2, z: -10 };
      banana.position.set(bananaPosition.x, bananaPosition.y, bananaPosition.z);
      banana.rotation.x = -Math.PI / 2;
      scaleMesh(banana, 0.5);
      scene.add(banana);

      const bananaCollider = new Mesh(new BoxGeometry(4, 4, 2), new MeshNormalMaterial({ visible: false }));
      bananaCollider.position.set(bananaPosition.x, bananaPosition.y + 4, bananaPosition.z);
      scene.add(bananaCollider);

      bananaWrapper.bananaMesh = banana;
      bananaWrapper.colliderMesh = bananaCollider;

      movingObjects.push({
        mesh: banana,
        initialPosition: bananaPosition,
        moveDirection: MoveDirection.Y,
        initialMoveDirection: InitialMoveDirection.Plus,
        moveBetweenRelative: { min: -1, max: 1 },
        moveSpeed: 0.015,
        rotationDirection: MoveDirection.Z,
        rotationSpeed: 0.01,
      });
    });
  });

  // rose
  const rose = new Group();
  const rosePosition: MinimalVector3 = {
    x: 0,
    y: 0,
    z: 80,
  };
  const roseBaseMesh = loadEqualVertexShape(roseBase, {
    color: 0x158226,
    wireframe: true,
    doubleSide: true,
    wireframeColor: 0x0c4a16,
  });
  scaleMesh(roseBaseMesh, 0.05);
  roseBaseMesh.scale.y *= 2;
  roseBaseMesh.rotation.y = Math.PI / 2;
  roseBaseMesh.position.set(rosePosition.x, rosePosition.y, rosePosition.z);
  rose.add(roseBaseMesh);

  const roseHeadMesh = loadShape(roseHead.vertexData, null, {
    color: 0xae0f0f,
    wireframe: true,
    doubleSide: true,
    wireframeColor: 0x400000,
  });
  scaleMesh(roseHeadMesh, 0.05);
  roseHeadMesh.position.set(rosePosition.x, rosePosition.y + 1.5, rosePosition.z);
  rose.add(roseHeadMesh);

  scene.add(rose);
};

const scaleMesh = (mesh, scale) => {
  mesh.scale.x = scale;
  mesh.scale.y = scale;
  mesh.scale.z = scale;
};
