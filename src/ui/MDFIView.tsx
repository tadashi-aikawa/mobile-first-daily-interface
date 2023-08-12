import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { ReactView } from "./ReactView";
import { createRoot, Root } from "react-dom/client";
import { AppHelper } from "../app-helper";

export const VIEW_TYPE_MFDI = "mfdi-view";

// Why private?
type IconName = string;

export class MFDIView extends ItemView {
  root: Root;
  appHelper: AppHelper;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.appHelper = new AppHelper(this.app);
  }

  getIcon(): IconName {
    return "pencil";
  }

  getViewType() {
    return VIEW_TYPE_MFDI;
  }

  getDisplayText() {
    return "Mobile First Daily Interface";
  }

  async onOpen() {
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(<ReactView app={this.app} />);
  }

  async onClose() {
    this.root.unmount();
  }
}
