import { BlobRef, BskyAgent, RichText } from "@atproto/api";
import { HTMLMeta, ImageMeta } from "../utils/meta";
import { requestUrl } from "obsidian";
import { forceLowerCaseKeys } from "src/utils/collections";
import { trimRedundantEmptyLines } from "src/utils/strings";

function inferContentType(url: string): string | null {
  const urlBeforeQuery = url.split("?").first()!;

  if (urlBeforeQuery.endsWith(".webp")) {
    return "image/webp";
  }
  if (urlBeforeQuery.endsWith(".png")) {
    return "image/png";
  }
  if (urlBeforeQuery.endsWith(".jpg") || urlBeforeQuery.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  return null;
}

async function loadImage(
  imageUrl: string
): Promise<{ data: ArrayBuffer; encoding: string }> {
  return new Promise((resolve, reject) =>
    requestUrl(imageUrl).then(async (res) => {
      const buf = res.arrayBuffer;

      const headers = forceLowerCaseKeys(res.headers);
      const contentType = headers["content-type"] ?? inferContentType(imageUrl);
      if (!contentType) {
        reject("content-typeが空です");
        return;
      }

      resolve({
        data: buf,
        encoding: contentType,
      });
    })
  );
}

export async function postToBluesky(
  identifier: string,
  password: string,
  text: string,
  meta?: HTMLMeta | ImageMeta[]
): Promise<{ uri: string; cid: string }> {
  if (!identifier) {
    throw Error("identifierが指定されていません");
  }
  if (!password) {
    throw Error("パスワード(BLUESKY_PASSWORD)が指定されていません");
  }

  const agent = new BskyAgent({
    service: "https://bsky.social",
  });
  await agent.login({ identifier, password });

  return post(agent, text, meta);
}

/**
 * MFDIで入力したテキストをBlueskyに最適な形で加工しpostします
 */
async function post(
  agent: BskyAgent,
  text: string,
  meta?: HTMLMeta | ImageMeta[]
): Promise<{ uri: string; cid: string }> {
  const toRichText = (input: string): RichText => {
    const richText = new RichText({ text: trimRedundantEmptyLines(input) });
    richText.detectFacets(agent);
    return richText;
  };

  // No Meta
  if (!meta) {
    const richText = toRichText(text);
    return agent.post({
      text: richText.text,
      facets: richText.facets,
      langs: ["ja"],
      createdAt: new Date().toISOString(),
    });
  } else if (Array.isArray(meta)) {
    // ImageMeta[]
    const richText = toRichText(
      meta
        .map((x) => x.originUrl)
        .reduce((ac, url) => ac.replace(url, ""), text)
    );
    return postWithImageMeta(agent, richText, meta);
  } else {
    // HTMLMeta
    const richText = toRichText(text.replace(meta.originUrl, ""));
    return postWithHTMLMeta(agent, richText, meta);
  }
}

async function postWithHTMLMeta(
  agent: BskyAgent,
  richText: RichText,
  meta: HTMLMeta
): Promise<{ uri: string; cid: string }> {
  // カバーイメージが取得できたら取得
  let coverImageData: any | undefined = undefined;
  if (meta.coverUrl) {
    const { data: imageData, encoding } = await loadImage(meta.coverUrl);
    if (imageData) {
      const { data } = await agent.uploadBlob(new Uint8Array(imageData), {
        encoding,
      });
      coverImageData = data.blob;
    }
  }

  return agent.post({
    text: richText.text,
    facets: richText.facets,
    langs: ["ja"],
    embed: {
      $type: "app.bsky.embed.external",
      external: {
        uri: meta.originUrl,
        title: meta.title,
        description: meta.description ?? "",
        thumb: coverImageData,
      },
    },
    createdAt: new Date().toISOString(),
  });
}

async function postWithImageMeta(
  agent: BskyAgent,
  richText: RichText,
  metas: ImageMeta[]
): Promise<{ uri: string; cid: string }> {
  // meta.dataのBlobデータから生成すれば通信を1回分節約できる...がcontent-typeの推論ロジックなどが必要になり改修の影響範囲も広がるので今はHTMLMetaの画像データ取得ロジックを流用する
  const results = await Promise.all(
    metas.map((meta) => uploadImage(agent, meta))
  );

  return agent.post({
    text: richText.text,
    facets: richText.facets,
    langs: ["ja"],
    embed: {
      $type: "app.bsky.embed.images",
      // TODO: aspectRatioは設定していないが必要なら設定する
      images: results.map(({ meta, blob }) => ({
        alt: meta.originUrl,
        image: blob,
      })),
    },
    createdAt: new Date().toISOString(),
  });
}

async function uploadImage(
  agent: BskyAgent,
  meta: ImageMeta
): Promise<{ meta: ImageMeta; blob: BlobRef }> {
  const { data: imageData, encoding } = await loadImage(meta.originUrl);
  if (!imageData) {
    throw Error(
      `URLから画像を取得できませんでした。Blueskyへの投稿処理を中断します。 url=${meta.originUrl}`
    );
  }

  const { data } = await agent.uploadBlob(new Uint8Array(imageData), {
    encoding,
  });

  return { meta, blob: data.blob };
}
