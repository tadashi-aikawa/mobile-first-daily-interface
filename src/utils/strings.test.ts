import {
  excludeWikiLink,
  parseMarkdownList,
  pickTaskName,
  pickUrls,
  replaceDayToJa,
  trimRedundantEmptyLines,
} from "./strings";

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

test.each([
  ["", { prefix: "", content: "" }],
  ["hoge", { prefix: "", content: "hoge" }],
  ["- ", { prefix: "- ", content: "" }],
  ["- hoge", { prefix: "- ", content: "hoge" }],
  ["- [ ] hoge", { prefix: "- [ ] ", content: "hoge" }],
  ["- [x] hoge", { prefix: "- [x] ", content: "hoge" }],
  ["  hoge", { prefix: "  ", content: "hoge" }],
  ["  - ", { prefix: "  - ", content: "" }],
  ["  - hoge", { prefix: "  - ", content: "hoge" }],
  ["  - [ ] hoge", { prefix: "  - [ ] ", content: "hoge" }],
  ["  - [x] hoge", { prefix: "  - [x] ", content: "hoge" }],
  ["* ", { prefix: "* ", content: "" }],
  ["* hoge", { prefix: "* ", content: "hoge" }],
  ["* [ ] hoge", { prefix: "* [ ] ", content: "hoge" }],
  ["* [x] hoge", { prefix: "* [x] ", content: "hoge" }],
])(
  `parseMarkdownList("%s")`,
  (text: string, expected: ReturnType<typeof parseMarkdownList>) => {
    expect(parseMarkdownList(text)).toEqual(expected);
  }
);

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

describe.each`
  text                                             | expected
  ${"https://hoge.com"}                            | ${["https://hoge.com"]}
  ${"  https://hoge.com"}                          | ${["https://hoge.com"]}
  ${"https://hoge.com  "}                          | ${["https://hoge.com"]}
  ${"  https://hoge.com  "}                        | ${["https://hoge.com"]}
  ${"aaa https://hoge.com bbb"}                    | ${["https://hoge.com"]}
  ${"aaa\nhttps://hoge.com\nbbb"}                  | ${["https://hoge.com"]}
  ${"aaa https://hoge.com bbb http://fuga.com"}    | ${["https://hoge.com", "http://fuga.com"]}
  ${"aaa\nhttps://hoge.com\nbbb\nhttp://fuga.com"} | ${["https://hoge.com", "http://fuga.com"]}
`("pickUrls", ({ text, expected }) => {
  test(`pickUrls(${text}) = ${expected}`, () => {
    expect(pickUrls(text)).toStrictEqual(expected);
  });
});

describe.each`
  text                 | expected
  ${"aaa"}             | ${"aaa"}
  ${"aaa\nbbb"}        | ${"aaa\nbbb"}
  ${"aaa\n\nbbb"}      | ${"aaa\n\nbbb"}
  ${"aaa\n\n\nbbb"}    | ${"aaa\n\nbbb"}
  ${"aaa\nbbb\n"}      | ${"aaa\nbbb"}
  ${"aaa\nbbb\n\n"}    | ${"aaa\nbbb"}
  ${"aaa\nbbb\n\nccc"} | ${"aaa\nbbb\n\nccc"}
`("trimRedundantEmptyLines", ({ text, expected }) => {
  test(`trimRedundantEmptyLines(${text}) = ${expected}`, () => {
    expect(trimRedundantEmptyLines(text)).toBe(expected);
  });
});
