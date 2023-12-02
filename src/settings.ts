import { App, PluginSettingTab, Setting } from "obsidian";
import MFDIPlugin from "./main";
import { mirrorMap } from "./utils/collections";

export interface Settings {
  leaf: string;
  autoStartOnLaunch: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  leaf: "left",
  autoStartOnLaunch: false,
};

const leafOptions = ["left", "current", "right"];

export class MFDISettingTab extends PluginSettingTab {
  plugin: MFDIPlugin;

  constructor(app: App, plugin: MFDIPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("表示リーフ")
      .setDesc("MFDI Viewを表示するリーフを指定します。")
      .addDropdown((tc) =>
        tc
          .addOptions(mirrorMap(leafOptions, (x) => x))
          .setValue(this.plugin.settings.leaf)
          .onChange(async (value) => {
            this.plugin.settings.leaf = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Obsidian起動時に自動起動・アクティブにする")
      .setDesc(
        "有効にするとObsidian起動時にMFDIのViewが自動で起動し、アクティブになります。"
      )
      .addToggle((tc) => {
        tc.setValue(this.plugin.settings.autoStartOnLaunch).onChange(
          async (value) => {
            this.plugin.settings.autoStartOnLaunch = value;
            await this.plugin.saveSettings();
          }
        );
      });
  }
}
