import { RegExpMatchedArray } from "./types";
import * as Encoding from "encoding-japanese";

export function excludeWikiLink(text: string): string {
  return text
    .replace(/\[\[[^\]]+\|(.*?)]]/g, "$1")
    .replace(/\[\[([^\]]+)]]/g, "$1");
}

export function pickTaskName(text: string): string {
  return parseMarkdownList(text).content;
}

export function parseMarkdownList(text: string): {
  prefix: string;
  content: string;
} {
  const { groups } = Array.from(
    text.matchAll(/^(?<prefix> *([-*] (\[.] |)|))(?<content>.*)$/g)
  ).at(0) as any;

  return { prefix: groups.prefix, content: groups.content };
}

export function replaceDayToJa(text: string): string {
  return text
    .replace("Sun", "日")
    .replace("Mon", "月")
    .replace("Tue", "火")
    .replace("Wed", "水")
    .replace("Thu", "木")
    .replace("Fri", "金")
    .replace("Sat", "土");
}

export function pickUrls(str: string): string[] {
  const urlsMatches = Array.from(
    str.matchAll(/(^| |\(|\n)(?<url>https?:\/\/[^ )\n]+)/g)
  ) as RegExpMatchedArray[];
  return urlsMatches.map((x) => x.groups.url);
}

export function sjis2String(sjisBuffer: ArrayBuffer): string {
  const unicodeArray = Encoding.convert(new Uint8Array(sjisBuffer), {
    from: "SJIS",
    to: "UNICODE",
  });
  return Encoding.codeToString(unicodeArray);
}
