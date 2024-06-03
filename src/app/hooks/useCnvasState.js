import { useState } from "react";

/**
 * Custom hook to handle canvas objects
 *
 * @param {string} message - Message to write to canvas
 * @param {Image} icon - Icon image to display to canvas
 * @param {boolean} showImage - True to show canvas image. Flase to not.
 * @returns {object} Object containing width and isDesktop
 */
const useCanvasState = ({ message, icon, showImage }) => {
  const [canvasState, setCanvasState] = useState({
    message,
    icon,
    showImage,
  });

  return { canvasState, setCanvasState };
};

export { useCanvasState };
