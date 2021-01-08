import { useState, useEffect } from "react";
import useDebounce from "hooks/useDebounce";

const getDimensions = () => {
  return { width: window.innerWidth, height: window.innerHeight };
};

const useWindowDimensions = (debounce: number) => {
  const [windowDimensions, setWindowDimensions] = useState(getDimensions());
  const debouncedHandleResize = useDebounce(() => {
    setWindowDimensions(getDimensions());
  }, debounce);

  useEffect(() => {
    window.addEventListener("resize", debouncedHandleResize);
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
