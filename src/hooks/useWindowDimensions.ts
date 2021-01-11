import { useState, useEffect } from "react";
import useDebounce from "hooks/useDebounce";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const useWindowDimensions = (delay = 300) => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const handleResize = useDebounce(() => {
    setWindowDimensions(getWindowDimensions());
  }, delay);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // remove on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};
export default useWindowDimensions;
