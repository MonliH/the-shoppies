type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
export default Without;
