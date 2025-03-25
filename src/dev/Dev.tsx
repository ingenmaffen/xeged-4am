import { initRender } from "../main/game";

export const Dev = () => {
  const canvas = initRender(true);
  return (
    <div
      ref={(nodeElement) => {
        nodeElement && nodeElement.appendChild(canvas);
      }}
    />
  );
};
