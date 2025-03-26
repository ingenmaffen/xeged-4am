import { Group, Mesh } from "three";

export enum MoveDirection {
  X = "x",
  Y = "y",
  Z = "z",
}

export enum InitialMoveDirection {
  Minus,
  Plus,
}

export interface MovingObject {
  mesh: Mesh | Group<any>;
  initialPosition: { x: number; y: number; z: number };
  moveDirection: MoveDirection;
  initialMoveDirection: InitialMoveDirection;
  moveBetweenRelative: { min: number; max: number };
  moveSpeed: number;
  rotationDirection: MoveDirection;
  rotationSpeed: number;
  isMovingPositive?: boolean;
}

export interface BananaWrapper {
  bananaMesh: Mesh;
  colliderMesh: Mesh;
}

export interface MeshOptions {
  color?: number;
  wireframe?: boolean;
  wireframeColor?: number;
  doubleSide?: boolean;
  dimensions?: number;
}
