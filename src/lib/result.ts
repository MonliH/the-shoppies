export type Result<T> = T | string;
export const isOk = <T>(result: Result<T>): result is T =>
  typeof result !== "string";
