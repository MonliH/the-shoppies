import { useState } from "react";

const useDebounce = (func: () => void, time: number): (() => void) => {
  const [timer, setTimer] = useState<null | ReturnType<typeof setTimeout>>(
    null
  );

  const call = () => {
    const later = async () => {
      setTimer(null);
      func();
    };

    if (timer) {
      clearTimeout(timer);
    }

    setTimer(setTimeout(later, time));
  };

  return call;
};
export default useDebounce;
