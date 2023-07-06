import { ItemView, moment, WorkspaceLeaf } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import * as React from "react";
import { ReactView } from "./ReactView";
import { createRoot, Root } from "react-dom/client";
import { AppHelper } from "../app-helper";

export const VIEW_TYPE_FREE_WRITING = "free-writing-view";

export class FreeWritingView extends ItemView {
  root: Root;
  appHelper: AppHelper;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.appHelper = new AppHelper(this.app);
  }

  async handleSubmit(message: string) {
    const todayNote = getDailyNote(moment(), getAllDailyNotes());
    await this.appHelper.insertTextToEnd(
      todayNote,
      `
\`\`\`\`fw ${moment().toISOString(true)}
${message}
\`\`\`\`
`
    );
  }

  getViewType() {
    return VIEW_TYPE_FREE_WRITING;
  }

  getDisplayText() {
    return "Free Writing";
  }

  async onOpen() {
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(
      <React.StrictMode>
        <ReactView onSubmit={this.handleSubmit.bind(this)} />
      </React.StrictMode>
    );
  }

  async onClose() {
    this.root.unmount();
  }
}
