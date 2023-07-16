import { describe, expect, test } from "@jest/globals";

describe("from", () => {
  describe.each<{
    a: number;
    b: number;
    expected: number;
  }>`
    a    | b    | expected
    ${1} | ${2} | ${3}
  `("test", ({ a, b, expected }) => {
    test(`test(${a}, ${b}, ${expected})`, () => {
      const actual = a + b;
      expect(actual).toBe(expected);
    });
  });
});
