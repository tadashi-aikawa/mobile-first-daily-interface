export function excludeWikiLink(text: string): string {
  return text
    .replace(/\[\[[^\]]+\|(.*?)]]/g, "$1")
    .replace(/\[\[([^\]]+)]]/g, "$1");
}

export function pickTaskName(text: string): string {
  return text.matchAll(/[-*] \[(?<mark>[^\]]+)] +(?<name>.+)/g).next().value
    .groups.name as string;
}

export function replaceDayToJa(text: string): string {
  return text
    .replace("Sun", "日")
    .replace("Mon", "月")
    .replace("Tue", "火")
    .replace("Wed", "水")
    .replace("Thu", "木")
    .replace("Fri", "金")
    .replace("Sat", "土");
}
