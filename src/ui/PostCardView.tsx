import * as React from "react";
import { useEffect, useState } from "react";
import { CodeBlock } from "../app-helper";
import { Notice } from "obsidian";
import { Box, HStack } from "@chakra-ui/react";
import Markdown from "marked-react";
import { CopyIcon, TimeIcon } from "@chakra-ui/icons";
import { pickUrls, replaceDayToJa } from "../utils/strings";
import { createMeta, HTMLMeta, ImageMeta } from "../utils/meta";
import { isPresent } from "../utils/types";
import { HTMLCard } from "./HTMLCard";
import { ImageCard } from "./ImageCard";

export const PostCardView = ({
  codeBlock,
  onClickTime,
}: {
  codeBlock: CodeBlock;
  onClickTime: (codeBlock: CodeBlock) => void;
}) => {
  const [htmlMetas, setHtmlMetas] = useState<HTMLMeta[]>([]);
  const [imageMetas, setImageMetas] = useState<ImageMeta[]>([]);

  const handleClickCopyIcon = async (text: string) => {
    await navigator.clipboard.writeText(text);
    new Notice("copied");
  };

  useEffect(() => {
    (async function () {
      const urls = pickUrls(codeBlock.code);
      const results = (await Promise.all(urls.map(createMeta))).filter(
        isPresent
      );
      setHtmlMetas(results.filter((x): x is HTMLMeta => x.type === "html"));
      setImageMetas(results.filter((x): x is ImageMeta => x.type === "image"));
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
      <Box fontSize={"85%"} paddingX={16} className="markdown-rendered">
        <Markdown gfm breaks>
          {codeBlock.code}
        </Markdown>
        {htmlMetas.map((meta) => (
          <HTMLCard meta={meta} />
        ))}
        {imageMetas.map((meta: ImageMeta) => (
          <ImageCard meta={meta} />
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
      </HStack>
    </Box>
  );
};
