import { BackSide, BufferAttribute, BufferGeometry, DoubleSide, FrontSide, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial } from "three";
import { MeshOptions, VertexData } from "./global-types";

const equilateralVertexCoordinates = new Float32Array([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, Math.sqrt(0.75), 0.5, 0.0]);

export const loadShape = (vertexData: number[], indexData: number[] = null, meshOptions?: MeshOptions) => {
  const options = setupOptions(meshOptions);
  const geometry = new BufferGeometry();
  const vertices = new Float32Array(vertexData);

  geometry.setAttribute("position", new BufferAttribute(vertices, options.dimensions));

  if (indexData) {
    geometry.setIndex(indexData);
  }

  const material = new MeshPhongMaterial({ color: options.color, side: options.doubleSide ? DoubleSide : FrontSide });
  geometry.computeVertexNormals();
  const mesh = new Mesh(geometry, material);

  if (options.wireframe) {
    const wireframeMaterial = new MeshBasicMaterial({ color: options.wireframeColor, wireframe: true });
    const wireframeMesh = new Mesh(geometry, wireframeMaterial);

    const group = new Group();
    group.add(mesh);
    group.add(wireframeMesh);

    return group;
  }

  return mesh;
};

export const loadEqualVertexShape = (vertexData: VertexData[], meshOptions?: MeshOptions) => {
  const options = setupOptions(meshOptions);
  const side = options.doubleSide ? DoubleSide : options.backSide ? BackSide : FrontSide;
  const material = new MeshBasicMaterial({ color: options.color, side });

  const group = new Group();

  for (let i = 0; i < vertexData.length; i++) {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(equilateralVertexCoordinates, options.dimensions));
    const mesh = new Mesh(geometry, material);

    const position = vertexData[i].position;
    const rotation = vertexData[i].rotation;

    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

    group.add(mesh);

    if (options.wireframe) {
      const wireframeMaterial = new MeshBasicMaterial({ color: options.wireframeColor, wireframe: true });
      const wireframeMesh = new Mesh(geometry, wireframeMaterial);
      wireframeMesh.position.set(position.x, position.y, position.z);
      wireframeMesh.rotation.set(rotation.x, rotation.y, rotation.z);
      group.add(wireframeMesh);
    }
  }

  return group;
};

const setupOptions = (options?: MeshOptions) => {
  return {
    color: options.color ?? 0x000000,
    wireframe: options?.wireframe ?? false,
    wireframeColor: options?.wireframeColor ?? 0xffffff,
    doubleSide: options?.doubleSide ?? false,
    dimensions: options?.dimensions ?? 3,
    backSide: options?.backSide ?? false,
  };
};
