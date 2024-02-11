import { Notice, Plugin, View } from "obsidian";
import { AppHelper } from "./app-helper";
import { MFDIView, VIEW_TYPE_MFDI } from "./ui/MDFIView";
import { DEFAULT_SETTINGS, MFDISettingTab, Settings } from "./settings";

export default class MFDIPlugin extends Plugin {
  appHelper: AppHelper;
  settings: Settings;
  settingTab: MFDISettingTab;

  async onload() {
    this.appHelper = new AppHelper(this.app);

    await this.loadSettings();
    this.settingTab = new MFDISettingTab(this.app, this);
    this.addSettingTab(this.settingTab);

    this.registerView(
      VIEW_TYPE_MFDI,
      (leaf) => new MFDIView(leaf, this.settings)
    );

    this.app.workspace.onLayoutReady(async () => {
      if (this.settings.autoStartOnLaunch) {
        await this.attachMFDIView();
      }
    });
    this.addRibbonIcon("pencil", "Mobile First Daily Interface", async () => {
      await this.attachMFDIView();
    });
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_MFDI);
  }

  /**
   * MFDIのViewをアタッチします
   */
  async attachMFDIView() {
    const existed = this.app.workspace.getLeavesOfType(VIEW_TYPE_MFDI).at(0);
    if (existed) {
      existed.setViewState({ type: VIEW_TYPE_MFDI, active: true });
      return;
    }

    const targetLeaf =
      this.settings.leaf === "left"
        ? this.app.workspace.getLeftLeaf(false)
        : this.settings.leaf === "current"
        ? this.app.workspace.getActiveViewOfType(View)?.leaf
        : this.settings.leaf === "right"
        ? this.app.workspace.getRightLeaf(false)
        : undefined;
    if (!targetLeaf) {
      new Notice(`表示リーフの設定が不正です: ${this.settings.leaf}`);
      return;
    }

    await targetLeaf.setViewState({
      type: VIEW_TYPE_MFDI,
      active: true,
    });
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  async loadSettings(): Promise<void> {
    const currentSettings = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...currentSettings };
  }
}
