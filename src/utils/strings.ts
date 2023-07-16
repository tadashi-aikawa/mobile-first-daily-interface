export function excludeWikiLink(text: string): string {
  return text
    .replace(/\[\[[^\]]+\|(.*?)]]/g, "$1")
    .replace(/\[\[([^\]]+)]]/g, "$1");
}

export function pickTaskName(text: string): string {
  return text.matchAll(/[-*] \[(?<mark>[^\]]+)] +(?<name>.+)/g).next().value
    .groups.name as string;
}
