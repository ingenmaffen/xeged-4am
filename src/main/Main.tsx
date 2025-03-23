import { initRender } from "./game";

export const Main = () => {
  const canvas = initRender();
  return (
    <div
      ref={(nodeElement) => {
        nodeElement && nodeElement.appendChild(canvas);
      }}
    />
  );
};
