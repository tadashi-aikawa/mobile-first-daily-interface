import type { TextComponent } from "obsidian";

export namespace TextComponentEvent {
  export function onChange(
    component: TextComponent,
    handler: (value: string) => void,
    option?: { className?: string; secret?: boolean }
  ): TextComponent {
    component.inputEl.addEventListener("change", async (ev) => {
      if (!(ev.target instanceof HTMLInputElement)) {
        return;
      }

      handler(ev.target.value);
    });
    if (option?.className) {
      component.inputEl.className = option.className;
    }
    if (option?.secret) {
      component.inputEl.type = "password";
    }
    return component;
  }
}
