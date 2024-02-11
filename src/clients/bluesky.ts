import { BskyAgent } from "@atproto/api";
import { HTMLMeta } from "../utils/meta";
import { requestUrl } from "obsidian";

function inferContentType(url: string): string | null {
  if (url.endsWith(".webp")) {
    return "image/webp";
  }
  if (url.endsWith(".png")) {
    return "image/png";
  }
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) {
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
      const contentType =
        res.headers["content-type"] ?? inferContentType(imageUrl);
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
  meta?: HTMLMeta
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

  // カバーイメージが取得できたら取得
  let coverImageData: any | null = null;
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
        description: meta.description,
        thumb: coverImageData,
      },
    },
    createdAt: new Date().toISOString(),
  });
}
