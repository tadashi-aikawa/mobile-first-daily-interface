import * as React from "react";
import { CodeBlock } from "../app-helper";
import { Notice } from "obsidian";
import { Box, HStack } from "@chakra-ui/react";
import Markdown from "marked-react";
import { CopyIcon, TimeIcon } from "@chakra-ui/icons";
import { replaceDayToJa } from "../utils/strings";

export const PostCardView = ({
  codeBlock,
  onClickTime,
}: {
  codeBlock: CodeBlock;
  onClickTime: (codeBlock: CodeBlock) => void;
}) => {
  const handleClickCopyIcon = async (text: string) => {
    await navigator.clipboard.writeText(text);
    new Notice("copied");
  };

  return (
    <Box
      borderStyle={"solid"}
      borderRadius={"10px"}
      borderColor={"var(--table-border-color)"}
      borderWidth={"2px"}
      boxShadow={"0 1px 1px 0"}
      marginY={8}
    >
      <Box fontSize={"85%"} paddingX={16}>
        <Markdown gfm breaks>
          {codeBlock.code}
        </Markdown>
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
