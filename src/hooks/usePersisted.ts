import {
  useReducer,
  useState,
  useEffect,
  Dispatch,
  Reducer,
  ReducerState,
  ReducerAction,
  SetStateAction,
} from "react";
import useDebounce from "hooks/useDebounce";

export const usePersistedState = <T>(
  defaultValue: T,
  key: string
): [T, Dispatch<SetStateAction<T>>] => {
  // Lazy init state
  const [value, setValue] = useState(() => {
    const savedValue = window.localStorage.getItem(key);
    return savedValue !== null ? JSON.parse(savedValue) : defaultValue;
  });

  // Debounce local storage writes
  const setLocalStorage = useDebounce(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, 300);

  // Write to local storage on set item
  useEffect(setLocalStorage, [key, value]);

  return [value, setValue];
};

export const usePersistedReducer = <R extends Reducer<any, any>>(
  reducer: R,
  defaultState: ReducerState<R>,
  key: string
): [ReducerState<R>, Dispatch<ReducerAction<R>>] => {
  const value = useReducer(reducer, defaultState, () => {
    const savedValue = window.localStorage.getItem(key);
    return savedValue !== null ? JSON.parse(savedValue) : defaultState;
  });

  // Debounce local storage writes
  const setLocalStorage = useDebounce(() => {
    window.localStorage.setItem(key, JSON.stringify(value[0]));
  }, 300);

  // Write to local storage on set item
  useEffect(setLocalStorage, [key, value[0]]);

  return value;
};
