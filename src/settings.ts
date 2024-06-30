import { App, PluginSettingTab, Setting } from "obsidian";
import MFDIPlugin from "./main";
import { mirrorMap } from "./utils/collections";
import { TextComponentEvent } from "./obsutils/settings";

export interface Settings {
  leaf: string;
  autoStartOnLaunch: boolean;
  blueskyIdentifier: string;
  blueskyAppPassword: string;
  postFormatOption: PostFormatOption;
}

export const DEFAULT_SETTINGS: Settings = {
  leaf: "left",
  autoStartOnLaunch: false,
  blueskyIdentifier: "",
  blueskyAppPassword: "",
  postFormatOption: "コードブロック",
};

const leafOptions = ["left", "current", "right"];

export const postFormatMap = {
  コードブロック: { type: "codeblock" },
  見出し1: { type: "header", level: 1 },
  見出し2: { type: "header", level: 2 },
  見出し3: { type: "header", level: 3 },
  見出し4: { type: "header", level: 4 },
  見出し5: { type: "header", level: 5 },
  見出し6: { type: "header", level: 6 },
} as const;
export type PostFormatOption = keyof typeof postFormatMap;
export type PostFormat = (typeof postFormatMap)[PostFormatOption];

export class MFDISettingTab extends PluginSettingTab {
  plugin: MFDIPlugin;

  constructor(app: App, plugin: MFDIPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h3", { text: "🌍 全体" });

    new Setting(containerEl)
      .setName("投稿形式")
      .setDesc("MFDIの投稿形式を指定します。")
      .addDropdown((tc) =>
        tc
          .addOptions(mirrorMap(Object.keys(postFormatMap), (x) => x))
          .setValue(this.plugin.settings.postFormatOption)
          .onChange(async (value) => {
            this.plugin.settings.postFormatOption = value as PostFormatOption;
            await this.plugin.saveSettings();
          })
      );

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

    containerEl.createEl("h3", { text: "🦋 Bluesky" });

    new Setting(containerEl).setName("Blueskyのidentifier").addText((cb) => {
      TextComponentEvent.onChange(cb, async (value) => {
        this.plugin.settings.blueskyIdentifier = value;
        await this.plugin.saveSettings();
      })
        .setValue(this.plugin.settings.blueskyIdentifier)
        .setPlaceholder("例: mfdi.bsky.social");
    });

    new Setting(containerEl)
      .setName("Blueskyのアプリパスワード")
      .addText((cb) => {
        TextComponentEvent.onChange(
          cb,
          async (value) => {
            this.plugin.settings.blueskyAppPassword = value;
            await this.plugin.saveSettings();
          },
          { secret: true }
        ).setValue(this.plugin.settings.blueskyAppPassword);
      });
  }
}
