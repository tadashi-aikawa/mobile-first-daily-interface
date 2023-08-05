export type PartialRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

export type RegExpMatchedArray = PartialRequired<
  RegExpMatchArray,
  "index" | "groups"
>;

export function isPresent<T>(value: T | undefined | null): value is T {
  return value != null;
}
