import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Textarea } from "@chakra-ui/react";
import { App, moment, Notice, TFile } from "obsidian";
import { AppHelper, CodeBlock } from "../app-helper";
import { sorter } from "../utils/collections";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import Markdown from "marked-react";
import { CopyIcon, TimeIcon } from "@chakra-ui/icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface Props {
  app: App;
}

export const ReactView = ({ app }: Props) => {
  const appHelper = useMemo(() => new AppHelper(app), [app]);

  const [input, setInput] = useState("");
  const [posts, setPosts] = useState<CodeBlock[]>([]);
  const canSubmit = useMemo(() => input.length > 0, [input]);

  const getTodayNote = () => getDailyNote(moment(), getAllDailyNotes());

  const handleClickSubmit = async () => {
    await appHelper.insertTextToEnd(
      getTodayNote(),
      `
\`\`\`\`fw ${moment().toISOString(true)}
${input}
\`\`\`\`
`
    );
    setInput("");
  };

  const updatePosts = async (note: TFile) => {
    const posts = await appHelper.getCodeBlocks(note);
    if (posts) {
      setPosts(posts.sort(sorter((x) => x.timestamp.unix(), "desc")));
    }
  };

  const handleClickCopyIcon = async (text: string) => {
    await navigator.clipboard.writeText(text);
    new Notice("copied");
  };

  useEffect(() => {
    const eventRef = app.metadataCache.on(
      "changed",
      async (file, data, cache) => {
        if (file.path !== getTodayNote().path) {
          return;
        }

        await updatePosts(file);
      }
    );
    updatePosts(getTodayNote());

    return () => {
      app.metadataCache.offref(eventRef);
    };
  }, []);

  const cards = useMemo(
    () => (
      <TransitionGroup className="list">
        {posts.map((x) => (
          <CSSTransition
            key={x.timestamp.unix()}
            timeout={500}
            classNames="item"
          >
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
                  {x.code}
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
                  {x.timestamp.format("H:mm:ss")}
                </Box>
                <Box>
                  <CopyIcon
                    marginRight={2}
                    onClick={() => handleClickCopyIcon(x.code)}
                  />
                  copy
                </Box>
              </Box>
            </Box>
          </CSSTransition>
        ))}
      </TransitionGroup>
    ),
    [posts]
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      gap="1rem"
      height="90%"
      maxWidth="30rem"
    >
      <Textarea
        placeholder="Input anything"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        minHeight={"8em"}
        maxHeight={"8em"}
        resize={"none"}
      />
      <Button
        isDisabled={!canSubmit}
        className={canSubmit ? "mod-cta" : ""}
        onClick={handleClickSubmit}
        minHeight={"2.4em"}
        maxHeight={"2.4em"}
      >
        Submit
      </Button>
      <Box flexGrow={1} overflowY="scroll" overflowX="hidden">
        {cards}
      </Box>
    </Box>
  );
};
