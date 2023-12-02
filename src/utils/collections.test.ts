import { describe, expect, test } from "@jest/globals";
import { forceLowerCaseKeys, mirrorMap } from "./collections";

describe.each`
  obj                                      | expected
  ${{ key: 1, key2: 2, Key3: 3, KEY4: 4 }} | ${{ key: 1, key2: 2, key3: 3, key4: 4 }}
`("forceLowerCaseKeys", ({ obj, expected }) => {
  test(`forceLowerCaseKeys(${obj}) = ${expected}`, () => {
    expect(forceLowerCaseKeys(obj)).toStrictEqual(expected);
  });
});

describe.each<{
  arr: unknown[];
  toValue: (x: any) => string;
  expected: { [key: string]: unknown };
}>`
  arr                           | toValue            | expected
  ${["aa", "ii"]}               | ${(x: any) => x}   | ${{ aa: "aa", ii: "ii" }}
  ${[{ s: "aa" }, { s: "ii" }]} | ${(x: any) => x.s} | ${{ aa: "aa", ii: "ii" }}
`("mirrorMap", ({ arr, toValue, expected }) => {
  test(`mirrorMap(${arr}, ${toValue}) = ${expected}`, () => {
    expect(mirrorMap(arr, toValue)).toStrictEqual(expected);
  });
});
