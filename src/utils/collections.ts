export function sorter<T, U extends number | string>(
  toOrdered: (t: T) => U,
  order: "asc" | "desc" = "asc"
) {
  return (a: T, b: T) =>
    order === "asc"
      ? toOrdered(a) > toOrdered(b)
        ? 1
        : toOrdered(b) > toOrdered(a)
        ? -1
        : 0
      : toOrdered(a) < toOrdered(b)
      ? 1
      : toOrdered(b) < toOrdered(a)
      ? -1
      : 0;
}

export function forceLowerCaseKeys(obj: { [key: string]: any }): {
  [key: string]: any;
} {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key.toLowerCase(), value])
  );
}

export function mirrorMap<T>(
  collection: T[],
  toValue: (t: T) => string
): { [key: string]: string } {
  return collection.reduce((p, c) => ({ ...p, [toValue(c)]: toValue(c) }), {});
}
