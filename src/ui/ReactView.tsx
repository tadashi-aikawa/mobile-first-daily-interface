import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Textarea } from "@chakra-ui/react";
import { App, moment, Notice, TFile } from "obsidian";
import { AppHelper, CodeBlock } from "../app-helper";
import { sorter } from "../utils/collections";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import Markdown from "marked-react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Moment } from "moment";

interface Props {
  app: App;
}

export const ReactView = ({ app }: Props) => {
  const appHelper = useMemo(() => new AppHelper(app), [app]);

  const [date, setDate] = useState<Moment>(moment());
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState<CodeBlock[]>([]);
  const canSubmit = useMemo(() => input.length > 0, [input]);

  const currentDailyNote = useMemo(
    () => getDailyNote(date, getAllDailyNotes()) as TFile | null,
    [date]
  );
  const currentDailyNoteRef = useRef(currentDailyNote);

  useEffect(() => {
    currentDailyNoteRef.current = currentDailyNote;

    if (!currentDailyNote) {
      return;
    }

    updatePosts(currentDailyNote);
  }, [currentDailyNote]);

  const handleClickSubmit = async () => {
    await appHelper.insertTextToEnd(
      getDailyNote(moment(), getAllDailyNotes()),
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

  const handleClickDate = () => {
    if (!currentDailyNote) {
      return;
    }

    app.workspace.getLeaf(true).openFile(currentDailyNote);
  };
  const handleClickMovePrevious = () => {
    setDate(date.clone().subtract(1, "day"));
  };
  const handleClickMoveNext = () => {
    setDate(date.clone().add(1, "day"));
  };

  useEffect(() => {
    const eventRef = app.metadataCache.on(
      "changed",
      async (file, data, cache) => {
        if (file.path !== currentDailyNoteRef.current?.path) {
          return;
        }

        await updatePosts(file);
      }
    );

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
                <Box onClick={() => handleClickCopyIcon(x.code)}>
                  <CopyIcon marginRight={2} />
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="1rem"
      >
        <ChevronLeftIcon onClick={handleClickMovePrevious} />
        <span onClick={handleClickDate}>{date.format("yyyy-MM-DD")}</span>
        <ChevronRightIcon onClick={handleClickMoveNext} />
      </Box>
      <Textarea
        placeholder="Input anything"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        minHeight={"8em"}
        maxHeight={"8em"}
        resize={"none"}
        disabled={!currentDailyNote}
      />
      <Button
        isDisabled={!canSubmit}
        className={canSubmit ? "mod-cta" : ""}
        onClick={handleClickSubmit}
        minHeight={"2.4em"}
        maxHeight={"2.4em"}
        disabled={!currentDailyNote}
      >
        Submit
      </Button>
      <Box flexGrow={1} overflowY="scroll" overflowX="hidden">
        {currentDailyNote && cards}
      </Box>
    </Box>
  );
};
