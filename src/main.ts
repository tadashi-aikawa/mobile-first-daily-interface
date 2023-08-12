import { Plugin, View } from "obsidian";
import { AppHelper } from "./app-helper";
import { MFDIView, VIEW_TYPE_MFDI } from "./ui/MDFIView";

export default class FreeWritingPlugin extends Plugin {
  appHelper: AppHelper;

  async onload() {
    this.appHelper = new AppHelper(this.app);
    this.init();
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_MFDI);
  }

  private init() {
    // UIなどの登録系はここ
    this.registerView(VIEW_TYPE_MFDI, (leaf) => new MFDIView(leaf));
    this.addRibbonIcon("pencil", "Mobile First Daily Interface", () => {
      this.activateView();
    });
  }

  async activateView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_MFDI);

    await this.app.workspace.getActiveViewOfType(View)?.leaf.setViewState({
      type: VIEW_TYPE_MFDI,
      active: true,
    });
  }
}
