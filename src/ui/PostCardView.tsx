import * as React from "react";
import { CodeBlock } from "../app-helper";
import { Notice } from "obsidian";
import { Box } from "@chakra-ui/react";
import Markdown from "marked-react";
import { CopyIcon, TimeIcon } from "@chakra-ui/icons";

export const PostCardView = ({ codeBlock }: { codeBlock: CodeBlock }) => {
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
      <Box
        color={"var(--text-muted)"}
        fontSize={"75%"}
        paddingBottom={4}
        paddingRight={10}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
        gap={8}
      >
        <Box>
          <TimeIcon marginRight={2} />
          {codeBlock.timestamp.format("H:mm:ss")}
        </Box>
        <Box onClick={() => handleClickCopyIcon(codeBlock.code)}>
          <CopyIcon marginRight={2} />
          copy
        </Box>
      </Box>
    </Box>
  );
};