import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Textarea } from "@chakra-ui/react";
import { App, moment, TFile } from "obsidian";
import { AppHelper, CodeBlock } from "../app-helper";
import { sorter } from "../utils/collections";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import Markdown from "marked-react";
import { TimeIcon } from "@chakra-ui/icons";
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
                gap={3}
              >
                <TimeIcon />
                {x.timestamp.format("H:mm:ss")}
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
      maxWidth="800px"
    >
      <Textarea
        placeholder="Input anything"
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        isDisabled={!canSubmit}
        className={canSubmit ? "mod-cta" : ""}
        onClick={handleClickSubmit}
      >
        Submit
      </Button>
      <Box
        maxHeight="calc(100vh - 24rem)"
        overflowY="scroll"
        overflowX="hidden"
      >
        {cards}
      </Box>
    </Box>
  );
};
