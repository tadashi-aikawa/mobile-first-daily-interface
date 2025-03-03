import { requestUrl } from "obsidian";
import { defineUserAgent } from "./agent";
import { forceLowerCaseKeys } from "./collections";
import {
  getCharsetFromMeta,
  getCoverUrl,
  getFaviconUrl,
  getMetaByHttpEquiv,
  getMetaByName,
  getMetaByProperty,
} from "./meta-helper";
import { eucJp2String, sjis2String } from "./strings";

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

async function getTwitterMeta(
  url: string,
  type: "X" | "Twitter"
): Promise<TwitterMeta | null> {
  const twitterEmbedUrl = `https://publish.${
    type === "X" ? "x" : "twitter"
  }.com/oembed?hide_media=true&hide_thread=true&omit_script=true&lang=ja&url=${url}`;
  const res = await requestUrl({
    url: twitterEmbedUrl,
    headers: { "User-Agent": defineUserAgent(twitterEmbedUrl) },
  });
  if (res.status >= 400) {
    console.debug(`twitter embed status is ${res.status}`);
    return null;
  }
  return res.json;
}

function htmlString2Document(
  htmlString: string,
  htmlBuffer: ArrayBuffer
): Document {
  let html = new DOMParser().parseFromString(htmlString, "text/html");

  const metaContentType = getCharsetFromMeta(html);
  const httpEquivContentType = getMetaByHttpEquiv(html, "content-type");

  const normalize = (s: string | undefined) =>
    s?.toLowerCase()?.replaceAll(/[-_]/g, "");
  const infer = (encoding: "shiftjis" | "eucjp" | "utf8"): boolean =>
    normalize(metaContentType)?.includes(encoding) ??
    normalize(httpEquivContentType?.content)?.includes(encoding) ??
    false;

  if (infer("shiftjis")) {
    // HTMLのmetaデータにshift_jisと明記されている場合はbodyを作り直す
    html = new DOMParser().parseFromString(
      sjis2String(htmlBuffer),
      "text/html"
    );
  } else if (infer("eucjp")) {
    // HTMLのmetaデータにeuc_jpと明記されている場合はbodyを作り直す
    html = new DOMParser().parseFromString(
      eucJp2String(htmlBuffer),
      "text/html"
    );
  }

  return html;
}

export async function createMeta(url: string): Promise<Meta | null> {
  if (
    url.startsWith("https://twitter.com") ||
    url.startsWith("https://x.com")
  ) {
    const res = await getTwitterMeta(
      url,
      url.startsWith("https://x.com") ? "X" : "Twitter"
    );
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

  const res = await requestUrl({
    url,
    headers: { "User-Agent": defineUserAgent(url) },
  });
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
  const html = htmlString2Document(res.text, res.arrayBuffer);

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
  const coverUrl = getCoverUrl(html, url);

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
