import { forceLowerCaseKeys } from "./collections";

describe.each`
  obj                                      | expected
  ${{ key: 1, key2: 2, Key3: 3, KEY4: 4 }} | ${{ key: 1, key2: 2, key3: 3, key4: 4 }}
`("forceLowerCaseKeys", ({ obj, expected }) => {
  test(`forceLowerCaseKeys(${obj}) = ${expected}`, () => {
    expect(forceLowerCaseKeys(obj)).toStrictEqual(expected);
  });
});
