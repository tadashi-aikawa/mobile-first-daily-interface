import { App, Editor, MarkdownView, moment, TFile } from "obsidian";
import { Moment } from "moment";
import { pickTaskName } from "./utils/strings";

export interface PostBlock {
  blockType: string;
  timestamp: Moment | any;
  body: string;
  offset: number;
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

  async getPostBlocks(file: TFile): Promise<PostBlock[] | null> {
    const content = await this.loadFile(file.path);

    return (
      this.unsafeApp.metadataCache
        .getFileCache(file)
        ?.sections?.filter((x) => (x.type === "callout" || x.type === "code"))
        .map((x) => {
          const str = content.slice(
            x.position.start.offset,
            x.position.end.offset
          );
          const lines = str.split("\n");
          const offset = x.position.start.offset;

          const postBlock: PostBlock = (() => {
            if (x.type === "code") {
              /*
              ````${blockType} ${timestamp}
              ${body}
              ````
              */
              return {
                blockType: lines[0].split(" ")[0].replace("````", ""),
                timestamp: moment(lines[0].split(" ")[1]),
                body: lines.slice(1, -1).join("\n"),
                offset: offset
              }
            } else { // if (x.type === "callout") {
              /*
              > [!${blockType}] ${timestamp}
              > ${body}
              */
              const matches = lines[0].match(/\[!(\w+)\]/);
              return {
                blockType: matches && matches[1] ? matches[1] : "",
                timestamp: moment(lines[0].split(" ")[2]),
                body: lines.slice(1).map((l) => l.replace(/^>\s*/, "")).join("\n"),
                offset: offset
              }
            }
          })();

          return postBlock;
        }) ?? null
    );
  }

  async getTasks(file: TFile): Promise<Task[] | null> {
    const content = await this.loadFile(file.path);
    const lines = content.split("\n");

    return (
      this.unsafeApp.metadataCache
        .getFileCache(file)
        ?.listItems?.filter((x) => x.task != null)
        .map((x) => {
          const text = lines.at(x.position.start.line)!;
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
