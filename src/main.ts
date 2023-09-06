import { Plugin, View } from "obsidian";
import { AppHelper } from "./app-helper";
import { MFDIView, VIEW_TYPE_MFDI } from "./ui/MDFIView";

export default class MFDIPlugin extends Plugin {
  appHelper: AppHelper;

  async onload() {
    this.appHelper = new AppHelper(this.app);

    this.app.workspace.onLayoutReady(async () => {
      await this.activateView();
    });
    this.addRibbonIcon("pencil", "Mobile First Daily Interface", async () => {
      await this.app.workspace.getActiveViewOfType(View)?.leaf.setViewState({
        type: VIEW_TYPE_MFDI,
        active: false,
      });
    });
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_MFDI);
  }

  async activateView() {
    this.registerView(VIEW_TYPE_MFDI, (leaf) => new MFDIView(leaf));

    const existed = this.app.workspace.getLeavesOfType(VIEW_TYPE_MFDI).at(0);
    if (existed) {
      return;
    }

    await this.app.workspace.getLeftLeaf(false).setViewState({
      type: VIEW_TYPE_MFDI,
      active: false,
    });
  }
}
