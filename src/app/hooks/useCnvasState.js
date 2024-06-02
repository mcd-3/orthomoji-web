import { useState } from "react";

const useCanvasState = ({ message, icon, showImage }) => {
  const [canvasState, setCanvasState] = useState({
    message,
    icon,
    showImage,
  });

  return { canvasState, setCanvasState };
};

export { useCanvasState };
