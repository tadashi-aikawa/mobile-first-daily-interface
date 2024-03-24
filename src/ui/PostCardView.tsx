import * as React from "react";
import { useEffect, useState } from "react";
import { CodeBlock } from "../app-helper";
import { Notice } from "obsidian";
import { Box, HStack } from "@chakra-ui/react";
import Markdown from "marked-react";
import { CopyIcon, TimeIcon, createIcon } from "@chakra-ui/icons";
import {
  pickUrls,
  replaceDayToJa,
  trimRedundantEmptyLines,
} from "../utils/strings";
import { createMeta, HTMLMeta, ImageMeta, TwitterMeta } from "../utils/meta";
import { isPresent } from "../utils/types";
import { HTMLCard } from "./HTMLCard";
import { ImageCard } from "./ImageCard";
import { TwitterCard } from "./TwitterCard";
import { postToBluesky } from "../clients/bluesky";
import { Settings } from "../settings";

const BlueskyIcon = createIcon({
  displayName: "BlueskyIcon",
  viewBox: "5 5 45 45",
  path: (
    <path
      fill="#1185FE"
      d="M27.5,25.73c-1.6-3.1-5.94-8.89-9.98-11.74c-3.87-2.73-5.35-2.26-6.31-1.82c-1.12,0.51-1.32,2.23-1.32,3.24
	c0,1.01,0.55,8.3,0.92,9.51c1.2,4.02,5.45,5.38,9.37,4.94c0.2-0.03,0.4-0.06,0.61-0.08c-0.2,0.03-0.41,0.06-0.61,0.08
	c-5.74,0.85-10.85,2.94-4.15,10.39c7.36,7.62,10.09-1.63,11.49-6.33c1.4,4.69,3.01,13.61,11.35,6.33c6.27-6.33,1.72-9.54-4.02-10.39
	c-0.2-0.02-0.41-0.05-0.61-0.08c0.21,0.03,0.41,0.05,0.61,0.08c3.92,0.44,8.18-0.92,9.37-4.94c0.36-1.22,0.92-8.5,0.92-9.51
	c0-1.01-0.2-2.73-1.32-3.24c-0.97-0.44-2.44-0.91-6.31,1.82C33.44,16.85,29.1,22.63,27.5,25.73z"
    />
  ),
});

export const PostCardView = ({
  codeBlock,
  settings,
  onClickTime,
}: {
  codeBlock: CodeBlock;
  settings: Settings;
  onClickTime: (codeBlock: CodeBlock) => void;
}) => {
  const [htmlMetas, setHtmlMetas] = useState<HTMLMeta[]>([]);
  const [imageMetas, setImageMetas] = useState<ImageMeta[]>([]);
  const [twitterMetas, setTwitterMetas] = useState<TwitterMeta[]>([]);

  const handleClickCopyIcon = async (text: string) => {
    await navigator.clipboard.writeText(text);
    new Notice("copied");
  };

  const handleClickPostBlueskyIcon = async () => {
    const nt = new Notice("🦋 Blueskyに投稿中...", 30 * 1000);

    // 画像のメタデータを優先するが、Blueskyが両方指定を許容するなら対応するのもアリ
    // TODO: HTMLと画像が共存すると、HTMLのURLはplain textになってしまう. これがリンクになってくれると良い
    const meta = imageMetas.first() ?? htmlMetas.first();
    const text = meta?.originUrl
      ? trimRedundantEmptyLines(codeBlock.code.replace(meta.originUrl, ""))
      : codeBlock.code;

    try {
      await postToBluesky(
        settings.blueskyIdentifier,
        settings.blueskyAppPassword,
        text,
        meta
      );
      nt.setMessage("投稿に成功しました");
      await sleep(5 * 1000);
      nt.hide();
    } catch (e) {
      console.error(e);
      nt.setMessage(`投稿に失敗しました\n\n${String(e)}`);
    }
  };

  useEffect(() => {
    (async function () {
      const urls = pickUrls(codeBlock.code);
      const results = (await Promise.all(urls.map(createMeta))).filter(
        isPresent
      );
      setHtmlMetas(results.filter((x): x is HTMLMeta => x.type === "html"));
      setImageMetas(results.filter((x): x is ImageMeta => x.type === "image"));
      setTwitterMetas(
        results.filter((x): x is TwitterMeta => x.type === "twitter")
      );
    })();
  }, [codeBlock.code]);

  return (
    <Box
      borderStyle={"solid"}
      borderRadius={"10px"}
      borderColor={"var(--table-border-color)"}
      borderWidth={"2px"}
      boxShadow={"0 1px 1px 0"}
      marginY={8}
    >
      <Box
        fontSize={"85%"}
        paddingX={16}
        wordBreak={"break-all"}
        className="markdown-rendered"
      >
        <Markdown gfm breaks>
          {codeBlock.code}
        </Markdown>
        {htmlMetas.map((meta) => (
          <HTMLCard key={meta.originUrl} meta={meta} />
        ))}
        {imageMetas.map((meta) => (
          <ImageCard key={meta.originUrl} meta={meta} />
        ))}
        {twitterMetas.map((meta) => (
          <TwitterCard key={meta.url} meta={meta} />
        ))}
      </Box>
      <HStack
        color={"var(--text-muted)"}
        fontSize={"75%"}
        paddingBottom={4}
        paddingRight={10}
        justify="end"
      >
        <Box cursor="pointer" onClick={() => onClickTime(codeBlock)}>
          <TimeIcon marginRight={2} />
          {replaceDayToJa(
            codeBlock.timestamp.format("YYYY-MM-DD(ddd) H:mm:ss")
          )}
        </Box>
        <Box
          cursor="pointer"
          onClick={() => handleClickCopyIcon(codeBlock.code)}
        >
          <CopyIcon marginRight={2} />
          copy
        </Box>
        {settings.blueskyIdentifier && settings.blueskyAppPassword ? (
          <Box cursor="pointer" onClick={handleClickPostBlueskyIcon}>
            <BlueskyIcon marginRight={2} />
            post
          </Box>
        ) : (
          ""
        )}
      </HStack>
    </Box>
  );
};
