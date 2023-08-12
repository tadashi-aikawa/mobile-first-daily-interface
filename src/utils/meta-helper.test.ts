import { JSDOM } from "jsdom";
import { getCoverUrl, getFaviconUrl } from "./meta-helper";

describe("getFaviconUrl", () => {
  test.concurrent.each`
    name          | url                                                                                     | expected
    ${"mockito"}  | ${"https://site.mockito.org/"}                                                          | ${"https://site.mockito.org/favicon.ico"}
    ${"ESLint"}   | ${"https://eslint.org/docs/latest/rules"}                                               | ${"https://eslint.org/favicon.ico"}
    ${"GitHub"}   | ${"https://github.com/tadashi-aikawa/obsidian-another-quick-switcher"}                  | ${"https://github.githubassets.com/favicons/favicon.svg"}
    ${"voicy"}    | ${"https://voicy.jp/channel/1380/459280"}                                               | ${"https://voicy.jp/favicon.ico"}
    ${"Zenn"}     | ${"https://zenn.dev/estra/books/obsidian-dot-zenn"}                                     | ${"https://zenn.dev/images/logo-transparent.png"}
    ${"Qiita"}    | ${"https://qiita.com/ugr0/items/514dcab4275aa74f3add"}                                  | ${"https://cdn.qiita.com/assets/favicons/public/production-c620d3e403342b1022967ba5e3db1aaa.ico"}
    ${"Cargo"}    | ${"https://doc.rust-lang.org/cargo/reference/publishing.html"}                          | ${"https://doc.rust-lang.org/cargo/favicon.png"}
    ${"GIGAZINE"} | ${"https://gigazine.net/news/20230322-windows-11-snipping-tool-vulnerability/"}         | ${"https://gigazine.net/favicon.ico"}
  `(`getFaviconUrl: $name`, async ({ name, url, expected }) => {
    const textResponse = await (await fetch(url)).text();
    expect(getFaviconUrl(new JSDOM(textResponse).window.document, url)).toBe(
      expected
    );
  });
});

describe("getCoverUrl", () => {
  test.concurrent.each`
    name          | url                                                                                     | expected
    ${"mockito"}  | ${"https://site.mockito.org/"}                                                          | ${undefined}
    ${"ESLint"}   | ${"https://eslint.org/docs/latest/rules"}                                               | ${"https://eslint.org/icon-512.png"}
    ${"voicy"}    | ${"https://voicy.jp/channel/1380/459280"}                                               | ${"https://ogp-image.voicy.jp/ogp-image/story/0/1380/459280"}
    ${"Cargo"}    | ${"https://doc.rust-lang.org/cargo/reference/publishing.html"}                          | ${undefined}
    ${"GIGAZINE"} | ${"https://gigazine.net/news/20230322-windows-11-snipping-tool-vulnerability/"}         | ${"https://i.gzn.jp/img/2023/03/22/windows-11-snipping-tool-vulnerability/00_m.jpg"}
    ${"relative path"} | ${"https://lukas.zapletalovi.com/posts/2022/wrapping-multiple-errors/"} | ${"https://lukas.zapletalovi.com/images/avatar_rh_512.jpg"}
  `(`getCoverUrl: $name`, async ({ name, url, expected }) => {
    const textResponse = await (await fetch(url)).text();
    expect(getCoverUrl(new JSDOM(textResponse).window.document, url)).toBe(
      expected
    );
  });
});
