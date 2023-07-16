import { App, Editor, MarkdownView, moment, TFile } from "obsidian";
import { Moment } from "moment";
import { pickTaskName } from "./utils/strings";

export interface CodeBlock {
  lang: string;
  timestamp: Moment;
  code: string;
}

export interface Task {
  mark: " " | string;
  name: string;
  offset: number;
}

interface UnsafeAppInterface {
  commands: {
    commands: { [commandId: string]: any };
    executeCommandById(commandId: string): boolean;
  };
}

export class AppHelper {
  private unsafeApp: App & UnsafeAppInterface;

  constructor(app: App) {
    this.unsafeApp = app as any;
  }

  async loadFile(path: string): Promise<string> {
    return this.unsafeApp.vault.adapter.read(path);
  }

  async setCheckMark(
    path: string,
    mark: "x" | " " | string,
    offset: number
  ): Promise<void> {
    const origin = await this.loadFile(path);
    const markOffset = offset + origin.slice(offset).indexOf("[") + 1;
    await this.unsafeApp.vault.adapter.write(
      path,
      `${origin.slice(0, markOffset)}${mark}${origin.slice(markOffset + 1)}`
    );
  }

  getActiveFile(): TFile | null {
    // noinspection TailRecursionJS
    return this.unsafeApp.workspace.getActiveFile();
  }

  getActiveMarkdownView(): MarkdownView | null {
    return this.unsafeApp.workspace.getActiveViewOfType(MarkdownView);
  }

  getActiveMarkdownEditor(): Editor | null {
    return this.getActiveMarkdownView()?.editor ?? null;
  }

  insertTextToEnd(file: TFile, text: string) {
    return this.unsafeApp.vault.adapter.append(file.path, text);
  }

  async getCodeBlocks(file: TFile): Promise<CodeBlock[] | null> {
    const content = await this.loadFile(file.path);

    return (
      this.unsafeApp.metadataCache
        .getFileCache(file)
        ?.sections?.filter((x) => x.type === "code")
        .map((x) =>
          content.slice(x.position.start.offset, x.position.end.offset)
        )
        .map((x) => {
          const lines = x.split("\n");

          const lang = lines[0].split(" ")[0].replace("````", "");
          const timestamp = lines[0].split(" ")[1];
          return {
            lang,
            timestamp: moment(timestamp),
            code: lines.slice(1, -1).join("\n"),
          };
        }) ?? null
    );
  }

  async getTasks(file: TFile): Promise<Task[] | null> {
    const content = await this.loadFile(file.path);

    return (
      this.unsafeApp.metadataCache
        .getFileCache(file)
        ?.listItems?.filter((x) => x.task != null)
        .map((x) => {
          const text = content.slice(
            x.position.start.offset,
            x.position.end.offset
          );
          const name = pickTaskName(text);
          return {
            mark: x.task!,
            name,
            offset: x.position.start.offset,
          };
        }) ?? null
    );
  }
}
