import { BufferAttribute, BufferGeometry, DoubleSide, FrontSide, Group, Mesh, MeshBasicMaterial } from "three";

export const getMesh = () => {
  const options = {
    dimensions: 3,
    numberOfVertices: 5,
    width: 4,
    height: 3,
    depth: 0.5,
    scale: 0.75,
    doubleSide: true,
    color: 0x158226,
    wireframeColor: 0x0c4a16,
    wireframe: true,
    useIndexes: true,
  };
  const geometry = new BufferGeometry();
  const generatedVertices = [];
  const generatedIndices = [];

  for (let i = 0; i < options.numberOfVertices * 3; i++) {
    const x = Math.random() > 0.5 ? Math.random() : -Math.random();
    const y = Math.random() > 0.5 ? Math.random() : -Math.random();
    const z = Math.random() > 0.5 ? Math.random() : -Math.random();

    generatedVertices.push(x * options.width);
    generatedVertices.push(y * options.height);
    generatedVertices.push(z * options.depth);

    for (let j = 0; j < 3; j++) {
      const vertexOrder = Math.ceil(Math.random() * options.numberOfVertices * 3);
      generatedIndices.push(vertexOrder);
    }
  }

  const vertices = new Float32Array(generatedVertices);
  geometry.setAttribute("position", new BufferAttribute(vertices, options.dimensions));

  if (options.useIndexes) {
    geometry.setIndex(generatedIndices);

    console.log({
      vertexData: generatedVertices,
      indexData: generatedIndices,
    });
  } else {
    console.log({ vertexData: generatedVertices });
  }

  const material = new MeshBasicMaterial({ color: options.color, side: options.doubleSide ? DoubleSide : FrontSide });
  const mesh = new Mesh(geometry, material);

  if (options.wireframe) {
    const wireframeMaterial = new MeshBasicMaterial({ color: options.wireframeColor, wireframe: true });
    const wireframeMesh = new Mesh(geometry, wireframeMaterial);

    const group = new Group();
    group.add(mesh);
    group.add(wireframeMesh);
    group.scale.x = options.scale;
    group.scale.y = options.scale;
    group.scale.z = options.scale;

    return group;
  } else {
    mesh.scale.x = options.scale;
    mesh.scale.y = options.scale;
    mesh.scale.z = options.scale;

    return mesh;
  }
};
