import { Command } from "obsidian";
import { Settings } from "./settings";
import { AppHelper } from "./app-helper";

export function createCommands(
  appHelper: AppHelper,
  settings: Settings
): Command[] {
  return [
    {
      id: "main-command",
      name: "Main command",
      checkCallback: (checking: boolean) => {
        if (appHelper.getActiveFile() && appHelper.getActiveMarkdownView()) {
          if (!checking) {
            // TODO:
          }
          return true;
        }
      },
    },
  ];
}
