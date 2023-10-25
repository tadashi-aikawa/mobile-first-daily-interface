// botでないとOGPがとれないサイト VS botだと攻撃と勘違いしてブロックされるサイト の両方に対応
export function defineUserAgent(url: string): string {
  if (url.startsWith("https://gigazine.net")) {
    return "MFDI";
  }

  return "bot";
}
