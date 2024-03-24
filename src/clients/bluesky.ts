import { BskyAgent } from "@atproto/api";
import { HTMLMeta, ImageMeta } from "../utils/meta";
import { requestUrl } from "obsidian";
import { forceLowerCaseKeys } from "src/utils/collections";
import { ExhaustiveError } from "src/errors";

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
  meta?: HTMLMeta | ImageMeta
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

  if (!meta) {
    return agent.post({
      text,
      langs: ["ja"],
      createdAt: new Date().toISOString(),
    });
  }

  switch (meta.type) {
    case "html":
      return postWithHTMLMeta(agent, text, meta);
    case "image":
      return postWithImageMeta(agent, text, meta);
    default:
      throw new ExhaustiveError(meta);
  }
}

async function postWithHTMLMeta(
  agent: BskyAgent,
  text: string,
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
    text,
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

// TODO: 需要があればimage metaは複数指定対応してもよい
async function postWithImageMeta(
  agent: BskyAgent,
  text: string,
  meta: ImageMeta
): Promise<{ uri: string; cid: string }> {
  // meta.dataのBlobデータから生成すれば通信を1回分節約できる...がcontent-typeの推論ロジックなどが必要になり改修の影響範囲も広がるので今はHTMLMetaの画像データ取得ロジックを流用する
  const { data: imageData, encoding } = await loadImage(meta.originUrl);
  if (!imageData) {
    throw Error(
      `URLから画像を取得できませんでした。Blueskyへの投稿処理を中断します。 url=${meta.originUrl}`
    );
  }

  const { data } = await agent.uploadBlob(new Uint8Array(imageData), {
    encoding,
  });

  return agent.post({
    text,
    langs: ["ja"],
    embed: {
      $type: "app.bsky.embed.images",
      // TODO: aspectRatioは設定していないが必要なら設定する
      images: [
        {
          alt: meta.originUrl,
          image: data.blob,
        },
      ],
    },
    createdAt: new Date().toISOString(),
  });
}
