import { requestUrl } from "obsidian";
import { forceLowerCaseKeys } from "./collections";

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

export type Meta = HTMLMeta | ImageMeta | TwitterMeta;
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
export interface TwitterMeta {
  type: "twitter";
  url: string;
  author_name: string;
  html: string;
}

async function getTwitterMeta(url: string): Promise<TwitterMeta | null> {
  const twitterEmbedUrl = `https://publish.twitter.com/oembed?hide_media=true&hide_thread=true&omit_script=true&lang=ja&url=${url}`;
  const res = await requestUrl({
    url: twitterEmbedUrl,
    headers: { "User-Agent": "bot" },
  });
  if (res.status >= 400) {
    console.debug(`twitter embed status is ${res.status}`);
    return null;
  }

  return res.json;
}

export async function createMeta(url: string): Promise<Meta | null> {
  if (url.startsWith("https://twitter.com")) {
    const res = await getTwitterMeta(url);
    if (!res) {
      return null;
    }

    return {
      type: "twitter",
      url,
      author_name: res.author_name,
      html: res.html,
    };
  }

  const res = await requestUrl({ url, headers: { "User-Agent": "bot" } });
  if (res.status >= 400) {
    console.debug(`status is ${res.status}`);
    return null;
  }

  const headers = forceLowerCaseKeys(res.headers);
  const contentType = headers["content-type"] as string;
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
