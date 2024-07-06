import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { ReactView } from "./ReactView";
import { createRoot, Root } from "react-dom/client";
import { AppHelper } from "../app-helper";
import { Settings } from "src/settings";

export const VIEW_TYPE_MFDI = "mfdi-view";

// Why private?
type IconName = string;

export class MFDIView extends ItemView {
  private root: Root;
  private settings: Settings;

  constructor(leaf: WorkspaceLeaf, settings: Settings) {
    super(leaf);
    this.settings = settings;
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
    this.renderNewView();
  }

  async onClose() {
    this.root.unmount();
  }

  renderNewView() {
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(<ReactView app={this.app} settings={this.settings} />);
  }

  updateSettings(settings: Settings) {
    this.settings = settings;
    this.root.unmount();
    this.renderNewView();
  }
}
