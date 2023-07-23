import { excludeWikiLink, pickTaskName, replaceDayToJa } from "./strings";

describe.each`
  text              | expected
  ${"[[hoge]]"}     | ${"hoge"}
  ${"[[hoge|aaa]]"} | ${"aaa"}
  ${"*aa*"}         | ${"*aa*"}
  ${"**aa**"}       | ${"**aa**"}
  ${"`aa`"}         | ${"`aa`"}
  ${"[hoge](URL)"}  | ${"[hoge](URL)"}
`("excludeWikiLink", ({ text, expected }) => {
  test(`excludeWikiLink(${text}) = ${expected}`, () => {
    expect(excludeWikiLink(text)).toBe(expected);
  });
});

describe.each`
  text                            | expected
  ${"- [ ] task"}                 | ${"task"}
  ${"- [x] task"}                 | ${"task"}
  ${"- [x] [hoge](URL)"}          | ${"[hoge](URL)"}
  ${"- [x] [[hogehoge]]"}         | ${"[[hogehoge]]"}
  ${"- [x] [[link]] hoge (fuga)"} | ${"[[link]] hoge (fuga)"}
`("pickTaskName", ({ text, expected }) => {
  test(`pickTaskName(${text}) = ${expected}`, () => {
    expect(pickTaskName(text)).toBe(expected);
  });
});

describe.each`
  text                  | expected
  ${"YYYY-MM-dd (Sun)"} | ${"YYYY-MM-dd (日)"}
  ${"YYYY-MM-dd (Mon)"} | ${"YYYY-MM-dd (月)"}
  ${"YYYY-MM-dd (Tue)"} | ${"YYYY-MM-dd (火)"}
  ${"YYYY-MM-dd (Wed)"} | ${"YYYY-MM-dd (水)"}
  ${"YYYY-MM-dd (Thu)"} | ${"YYYY-MM-dd (木)"}
  ${"YYYY-MM-dd (Fri)"} | ${"YYYY-MM-dd (金)"}
  ${"YYYY-MM-dd (Sat)"} | ${"YYYY-MM-dd (土)"}
`("replaceDayToJa", ({ text, expected }) => {
  test(`replaceDayToJa(${text}) = ${expected}`, () => {
    expect(replaceDayToJa(text)).toBe(expected);
  });
});
