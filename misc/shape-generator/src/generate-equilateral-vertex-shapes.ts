import { BufferAttribute, BufferGeometry, DoubleSide, FrontSide, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";

const degree = Math.PI / 180;
const vertexCoordinates = new Float32Array([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, Math.sqrt(0.75), 0.5, 0.0]);

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

interface VertexData {
  position: Vector3D;
  rotation: Vector3D;
}

const _roseConfig = {
  dimensions: 3,
  numberOfVertices: 150,
  width: 0.25,
  height: 15,
  depth: 0.25,
  scale: 0.25,
  doubleSide: true,
  color: 0x158226,
  wireframeColor: 0x0c4a16,
  wireframe: true,
};

export const getMeshFromEqualVertices = (): Group => {
  const options = {
    dimensions: 3,
    numberOfVertices: 25,
    width: 4,
    height: 3,
    depth: 0,
    scale: 0.5,
    doubleSide: true,
    color: 0x158226,
    wireframeColor: 0x0c4a16,
    wireframe: true,
  };
  const material = new MeshBasicMaterial({ color: options.color, side: options.doubleSide ? DoubleSide : FrontSide });
  const vertexData: VertexData[] = [];

  const group = new Group();

  for (let i = 0; i < options.numberOfVertices; i++) {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(vertexCoordinates, options.dimensions));
    const mesh = new Mesh(geometry, material);

    const position = new Vector3(Math.random() * options.width, Math.random() * options.height, Math.random() * options.depth);
    const rotation = new Vector3(getRandomRotation(), getRandomRotation(), getRandomRotation());

    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

    vertexData.push({
      position: convertVector3ToVector3D(position),
      rotation: convertVector3ToVector3D(rotation),
    });

    group.add(mesh);

    if (options.wireframe) {
      const wireframeMesh = getWireframeMesh(geometry, options.wireframeColor);
      wireframeMesh.position.set(position.x, position.y, position.z);
      wireframeMesh.rotation.set(rotation.x, rotation.y, rotation.z);
      group.add(wireframeMesh);
    }
  }

  console.log(vertexData);

  group.scale.x = options.scale;
  group.scale.y = options.scale;
  group.scale.z = options.scale;

  group.position.x += options.width * (options.scale / 2);
  group.position.y -= options.height * (options.scale / 2);

  return group;
};

const getWireframeMesh = (geometry, wireframeColor) => {
  const wireframeMaterial = new MeshBasicMaterial({ color: wireframeColor, wireframe: true });
  const wireframeMesh = new Mesh(geometry, wireframeMaterial);

  return wireframeMesh;
};

const convertVector3ToVector3D = (vector: Vector3): Vector3D => {
  return {
    x: vector.x,
    y: vector.y,
    z: vector.z,
  };
};

const getRandomRotation = () => {
  return Math.ceil(Math.random() * 360) * degree;
};
