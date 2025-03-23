import { BufferAttribute, BufferGeometry, DoubleSide, FrontSide, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial } from "three";

export const loadShape = (vertexData, color, wireframe = false, doubleSide = false, indexData = null) => {
  const geometry = new BufferGeometry();
  const vertices = new Float32Array(vertexData);

  geometry.setAttribute("position", new BufferAttribute(vertices, 3));

  if (indexData) {
    geometry.setIndex(indexData);
  }

  const material = new MeshPhongMaterial({ color, side: doubleSide ? DoubleSide : FrontSide });
  const mesh = new Mesh(geometry, material);

  if (wireframe) {
    const wireframeMaterial = new MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const wireframeMesh = new Mesh(geometry, wireframeMaterial);

    const group = new Group();
    group.add(mesh);
    group.add(wireframeMesh);

    return group;
  }

  return mesh;
};
