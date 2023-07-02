import { App, PluginSettingTab, Setting } from "obsidian";
import type FreeWritingPlugin from "./main";

export interface Settings {
  hoge: string;
}

export const DEFAULT_SETTINGS: Settings = {
  hoge: "",
};

export class FreeWritingSettingTab extends PluginSettingTab {
  plugin: FreeWritingPlugin;

  constructor(app: App, plugin: FreeWritingPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl).setName("Hoge").addText((text) =>
      text
        .setPlaceholder("ex: hoge.md")
        .setValue(this.plugin.settings.hoge)
        .onChange(async (value) => {
          this.plugin.settings.hoge = value;
          await this.plugin.saveSettings();
        })
    );
  }
}
