import { initRender } from "../main/game";

export const Dev = () => {
  const canvas = initRender();
  return (
    <div
      ref={(nodeElement) => {
        nodeElement && nodeElement.appendChild(canvas);
      }}
    />
  );
};
