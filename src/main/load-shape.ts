import { BufferAttribute, BufferGeometry, DoubleSide, FrontSide, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial } from "three";
import { MeshOptions } from "./global-types";

export const loadShape = (vertexData: number[], indexData: number[] = null, meshOptions?: MeshOptions) => {
  const options = {
    color: meshOptions.color ?? 0x000000,
    wireframe: meshOptions?.wireframe ?? false,
    wireframeColor: meshOptions?.wireframeColor ?? 0xffffff,
    doubleSide: meshOptions?.doubleSide ?? false,
    dimensions: meshOptions?.dimensions ?? 3,
  };
  const geometry = new BufferGeometry();
  const vertices = new Float32Array(vertexData);

  geometry.setAttribute("position", new BufferAttribute(vertices, options.dimensions));

  if (indexData) {
    geometry.setIndex(indexData);
  }

  const material = new MeshPhongMaterial({ color: options.color, side: options.doubleSide ? DoubleSide : FrontSide });
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
