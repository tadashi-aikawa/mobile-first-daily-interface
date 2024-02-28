import { BskyAgent } from "@atproto/api";
import { HTMLMeta } from "../utils/meta";
import { requestUrl } from "obsidian";
import { forceLowerCaseKeys } from "src/utils/collections";

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
