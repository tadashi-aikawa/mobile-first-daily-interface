import { CopyIcon, TimeIcon } from "@chakra-ui/icons";
import { Box, HStack } from "@chakra-ui/react";
import Markdown from "marked-react";
import { Notice } from "obsidian";
import * as React from "react";
import { useEffect, useState } from "react";
import { Settings } from "../settings";
import { createMeta, HTMLMeta, ImageMeta, TwitterMeta } from "../utils/meta";
import { pickUrls, replaceDayToJa } from "../utils/strings";
import { isPresent } from "../utils/types";
import { HTMLCard } from "./HTMLCard";
import { ImageCard } from "./ImageCard";
import { Post } from "./ReactView";
import { TwitterCard } from "./TwitterCard";

export const PostCardView = ({
  post,
  settings,
  onClickTime,
}: {
  post: Post;
  settings: Settings;
  onClickTime: (post: Post) => void;
}) => {
  const [htmlMetas, setHtmlMetas] = useState<HTMLMeta[]>([]);
  const [imageMetas, setImageMetas] = useState<ImageMeta[]>([]);
  const [twitterMetas, setTwitterMetas] = useState<TwitterMeta[]>([]);

  const handleClickCopyIcon = async (text: string) => {
    await navigator.clipboard.writeText(text);
    new Notice("copied");
  };

  useEffect(() => {
    (async function () {
      const urls = pickUrls(post.message);
      const results = (await Promise.all(urls.map(createMeta))).filter(
        isPresent
      );
      setHtmlMetas(results.filter((x): x is HTMLMeta => x.type === "html"));
      setImageMetas(results.filter((x): x is ImageMeta => x.type === "image"));
      setTwitterMetas(
        results.filter((x): x is TwitterMeta => x.type === "twitter")
      );
    })();
  }, [post.message]);

  return (
    <Box
      borderStyle={"solid"}
      borderRadius={"10px"}
      borderColor={"var(--table-border-color)"}
      borderWidth={"2px"}
      marginY={8}
    >
      <Box
        fontSize={"85%"}
        paddingX={16}
        paddingTop={3}
        wordBreak={"break-all"}
        className="markdown-rendered"
      >
        <Markdown gfm breaks>
          {post.message}
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
        <Box cursor="pointer" onClick={() => onClickTime(post)}>
          <TimeIcon marginRight={2} />
          {replaceDayToJa(post.timestamp.format("YYYY-MM-DD(ddd) H:mm:ss"))}
        </Box>
        <Box cursor="pointer" onClick={() => handleClickCopyIcon(post.message)}>
          <CopyIcon marginRight={2} />
          copy
        </Box>
      </HStack>
    </Box>
  );
};
