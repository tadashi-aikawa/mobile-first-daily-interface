import { App, Editor, MarkdownView, TFile } from "obsidian";

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
}
