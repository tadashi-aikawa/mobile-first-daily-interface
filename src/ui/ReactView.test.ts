import { describe, expect, test } from "@jest/globals";
import { toText } from "./ReactView";
import { PostFormat } from "../settings";
import { moment } from "obsidian";

describe("toText", () => {
  test("uses the default task format", () => {
    const pf: PostFormat = { type: "codeblock" } as any;
    expect(toText("hoge", true, pf, "YYYY")).toBe("\n- [ ] hoge\n");
  });

  test("adds task affixes and expands every timestamp placeholder", () => {
    const fmt = "YYYY";
    const pf: PostFormat = { type: "codeblock" } as any;
    const year = moment().format(fmt);
    const output = toText(
      "hoge",
      true,
      pf,
      fmt,
      "{{timestamp}} {{timestamp}} ",
      " #todo {{timestamp}}"
    );
    expect(output).toBe(`\n- [ ] ${year} ${year} hoge #todo ${year}\n`);
  });

  test("uses provided timestamp format for list", () => {
    const fmt = "YYYY";
    const pf: PostFormat = { type: "list" } as any;
    const output = toText("hoge", false, pf, fmt);
    const year = moment().format(fmt);
    expect(output).toBe(`\n- ${year} hoge\n`);
  });
});
