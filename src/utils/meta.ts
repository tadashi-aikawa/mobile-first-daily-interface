import { requestUrl } from "obsidian";

function getMetaByProperty(
  dom: Document,
  property: string
): string | undefined {
  return dom
    .querySelector(`meta[property='${property}']`)
    ?.attributes.getNamedItem("content")?.value;
}

function getMetaByName(dom: Document, name: string): string | undefined {
  return dom
    .querySelector(`meta[name='${name}']`)
    ?.attributes.getNamedItem("content")?.value;
}

function getSrcById(dom: Document, id: string): string | undefined {
  return dom.querySelector("#" + id)?.attributes.getNamedItem("src")?.value;
}

function getFaviconUrl(dom: Document, url: string): string {
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

function getCoverUrl(dom: Document): string | undefined {
  return (
    getMetaByProperty(dom, "og:image") ?? getSrcById(dom, "ebooksImgBlkFront")
  );
}

export type Meta = HTMLMeta | ImageMeta;
export interface HTMLMeta {
  type: "html";
  siteName: string;
  title: string;
  description?: string;
  faviconUrl: string;
  coverUrl?: string;
  originUrl: string;
}
export interface ImageMeta {
  type: "image";
  data: Blob;
  originUrl: string;
}

export async function createMeta(url: string): Promise<Meta | null> {
  const res = await requestUrl({ url, headers: { "User-Agent": "bot" } });
  if (res.status >= 400) {
    console.debug(`status is ${res.status}`);
    return null;
  }

  const contentType = res.headers["content-type"];
  if (contentType.startsWith("image/")) {
    return {
      type: "image",
      data: new Blob([res.arrayBuffer], { type: contentType }),
      originUrl: url,
    };
  }

  if (!contentType.startsWith("text/html")) {
    console.debug(`content-type is ${contentType}`);
    return null;
  }
  const html = new DOMParser().parseFromString(res.text, "text/html");

  const siteName = getMetaByProperty(html, "og:site_name") ?? new URL(url).host;
  const title =
    getMetaByProperty(html, "og:title") ??
    getMetaByProperty(html, "title") ??
    html.querySelector("title")?.text ??
    url;
  const description =
    getMetaByProperty(html, "og:description") ??
    getMetaByProperty(html, "description") ??
    getMetaByName(html, "description");
  const faviconUrl = getFaviconUrl(html, url);
  const coverUrl = getCoverUrl(html);

  return {
    type: "html",
    siteName,
    title,
    description,
    faviconUrl,
    coverUrl,
    originUrl: url,
  };
}
