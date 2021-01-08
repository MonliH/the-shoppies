import { useState } from "react";

const useDebounce = <T extends any[]>(
  func: (...args: T) => void,
  time: number
): (() => void) => {
  const [timer, setTimer] = useState<null | ReturnType<typeof setTimeout>>(
    null
  );

  const call = (...args: T) => {
    const later = async () => {
      setTimer(null);
      func(...args);
    };

    if (timer) {
      clearTimeout(timer);
    }

    setTimer(setTimeout(later, time));
  };

  return call;
};
export default useDebounce;
