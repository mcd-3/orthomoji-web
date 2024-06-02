import { useState, useEffect } from "react";

/**
 * Custom hook to handle window resize events
 *
 * @returns {object} Object containing width and isDesktop
 */
const useWindowResize = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    }

    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isDesktop = width > 768;

  return { width, isDesktop };
};

export { useWindowResize };
