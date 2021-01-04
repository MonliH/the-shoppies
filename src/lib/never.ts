export const assertUnreachable = (_: never): never => {
  throw new Error("Tried to run code that shouldn't be run");
};
