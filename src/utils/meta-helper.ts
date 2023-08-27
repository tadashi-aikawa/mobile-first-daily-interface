export function getMetaByProperty(
  dom: Document,
  property: string
): string | undefined {
  return dom
    .querySelector(`meta[property='${property}']`)
    ?.attributes.getNamedItem("content")?.value;
}

export function getMetaByName(dom: Document, name: string): string | undefined {
  return dom
    .querySelector(`meta[name='${name}']`)
    ?.attributes.getNamedItem("content")?.value;
}

export function getMetaByHttpEquiv(
  dom: Document,
  httpEquiv: string
): string | undefined {
  return dom
    .querySelector(`meta[http-equiv='${httpEquiv}']`)
    ?.attributes.getNamedItem("content")?.value;
}

export function getSrcById(dom: Document, id: string): string | undefined {
  return dom.querySelector("#" + id)?.attributes.getNamedItem("src")?.value;
}

export function getFaviconUrl(dom: Document, url: string): string {
  let iconHref =
    dom.querySelector("link[rel='icon']")?.attributes.getNamedItem("href")
      ?.value ??
    dom
      .querySelector("link[rel='shortcut icon']")
      ?.attributes.getNamedItem("href")?.value;
  if (!iconHref) {
    return new URL("/favicon.ico", url).toString();
  }

  const baseUrl = dom
    .querySelector("base")
    ?.attributes.getNamedItem("href")?.value;
  return baseUrl
    ? new URL(iconHref, new URL(baseUrl, url).toString()).toString()
    : new URL(iconHref, url).toString();
}

export function getCoverUrl(dom: Document, url: string): string | undefined {
  const coverHref =
    getMetaByProperty(dom, "og:image") ?? getSrcById(dom, "ebooksImgBlkFront");
  return coverHref ? new URL(coverHref, url).toString() : undefined;
}
