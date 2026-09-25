import { describe, expect, test } from "@jest/globals";
import { getBottomOverlap, partitionTasks, toText } from "./ReactView";
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

describe("getBottomOverlap", () => {
  test("returns the portion of the mobile navbar covering the view", () => {
    expect(getBottomOverlap({ bottom: 800 }, { top: 720, bottom: 840 })).toBe(
      80
    );
  });

  test("returns zero when the mobile navbar is below the view", () => {
    expect(getBottomOverlap({ bottom: 700 }, { top: 720, bottom: 840 })).toBe(
      0
    );
  });
});

describe("partitionTasks", () => {
  test("returns empty groups when there are no tasks", () => {
    expect(partitionTasks([])).toEqual({ incomplete: [], completed: [] });
  });

  test("separates incomplete and completed tasks", () => {
    const incomplete = { name: "open", mark: " ", offset: 1 };
    const completed = { name: "done", mark: "x", offset: 2 };

    expect(partitionTasks([incomplete, completed])).toEqual({
      incomplete: [incomplete],
      completed: [completed],
    });
  });
});
