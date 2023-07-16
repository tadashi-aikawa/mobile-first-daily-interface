import { excludeWikiLink, pickTaskName } from "./strings";

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
