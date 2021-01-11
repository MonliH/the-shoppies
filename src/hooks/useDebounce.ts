import { useRef } from "react";

const useDebounce = <T extends any[]>(
  func: (...args: T) => void,
  time: number
): (() => void) => {
  const timer = useRef<null | ReturnType<typeof setTimeout>>(null);

  const call = (...args: T) => {
    const later = async () => {
      timer.current = null;
      func(...args);
    };

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(later, time);
  };

  return call;
};
export default useDebounce;
