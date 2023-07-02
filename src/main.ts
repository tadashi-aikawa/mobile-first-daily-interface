import { Plugin, View } from "obsidian";
import { DEFAULT_SETTINGS, Settings, FreeWritingSettingTab } from "./settings";
import { AppHelper } from "./app-helper";
import { createCommands } from "./commands";
import { FreeWritingView, VIEW_TYPE_FREE_WRITING } from "./ui/view";

export default class FreeWritingPlugin extends Plugin {
  settings: Settings;
  appHelper: AppHelper;

  async onload() {
    await this.loadSettings();
    this.appHelper = new AppHelper(this.app);
    this.init();

    createCommands(this.appHelper, this.settings).forEach((c) =>
      this.addCommand(c)
    );

    this.addSettingTab(new FreeWritingSettingTab(this.app, this));
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_FREE_WRITING);
  }

  private init() {
    // UIなどの登録系はここ
    this.registerView(
      VIEW_TYPE_FREE_WRITING,
      (leaf) => new FreeWritingView(leaf)
    );
    this.addRibbonIcon("pencil", "Free Writing", () => {
      this.activateView();
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.init();
  }

  async activateView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_FREE_WRITING);

    await this.app.workspace.getActiveViewOfType(View)?.leaf.setViewState({
      type: VIEW_TYPE_FREE_WRITING,
      active: true,
    });

    // this.app.workspace.revealLeaf(
    //   this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0]
    // );
  }
}
