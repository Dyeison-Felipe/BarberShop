export type NullableOptional<T> = {
  [P in keyof T]?: T[P] | null;
};
