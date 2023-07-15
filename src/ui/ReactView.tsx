import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Checkbox, Textarea } from "@chakra-ui/react";
import { App, moment, TFile } from "obsidian";
import { AppHelper, CodeBlock, Task } from "../app-helper";
import { sorter } from "../utils/collections";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Moment } from "moment";
import { PostCardView } from "./PostCardView";
import { TaskView } from "./TaskView";

export const ReactView = ({ app }: { app: App }) => {
  const appHelper = useMemo(() => new AppHelper(app), [app]);

  const [date, setDate] = useState<Moment>(moment());
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState<CodeBlock[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [asTask, setAsTask] = useState(false);
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

    Promise.all([updatePosts(currentDailyNote), updateTasks(currentDailyNote)]);
  }, [currentDailyNote]);

  const handleClickSubmit = async () => {
    const text = asTask
      ? `
- [ ] ${input}
`
      : `
\`\`\`\`fw ${moment().toISOString(true)}
${input}
\`\`\`\`
`;

    await appHelper.insertTextToEnd(
      getDailyNote(moment(), getAllDailyNotes()),
      text
    );
    setInput("");
  };

  const updatePosts = async (note: TFile) => {
    setPosts(
      ((await appHelper.getCodeBlocks(note)) ?? [])
        ?.filter((x) => x.lang === "fw")
        .sort(sorter((x) => x.timestamp.unix(), "desc"))
    );
  };

  const updateTasks = async (note: TFile) => {
    setTasks((await appHelper.getTasks(note)) ?? []);
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

        await Promise.all([updatePosts(file), updateTasks(file)]);
      }
    );

    return () => {
      app.metadataCache.offref(eventRef);
    };
  }, []);

  const updateTaskChecked = async (task: Task, checked: boolean) => {
    if (!currentDailyNote) {
      return;
    }

    const mark = checked ? "x" : " ";
    setTasks(tasks.map((x) => (x.offset === task.offset ? { ...x, mark } : x)));
    await appHelper.setCheckMark(currentDailyNote.path, mark, task.offset);
  };

  const contents = useMemo(
    () =>
      asTask ? (
        <>
          <Box
            borderStyle={"solid"}
            borderRadius={"10px"}
            borderColor={"var(--table-border-color)"}
            borderWidth={"2px"}
            boxShadow={"0 1px 1px 0"}
            marginY={8}
          >
            <TransitionGroup className="list">
              {tasks
                .filter((x) => x.mark === " ")
                .map((x) => (
                  <CSSTransition
                    key={date.format() + x.name + x.mark}
                    timeout={300}
                    classNames="item"
                  >
                    <Box m={10}>
                      <TaskView
                        task={x}
                        onChange={(c) => updateTaskChecked(x, c)}
                      />
                    </Box>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          </Box>
          <Box
            borderStyle={"solid"}
            borderRadius={"10px"}
            borderColor={"var(--table-border-color)"}
            borderWidth={"2px"}
            boxShadow={"0 1px 1px 0"}
            marginY={8}
          >
            <TransitionGroup className="list">
              {tasks
                .filter((x) => x.mark !== " ")
                .map((x) => (
                  <CSSTransition
                    key={date.format() + x.name + x.mark}
                    timeout={300}
                    classNames="item"
                  >
                    <Box m={10}>
                      <TaskView
                        task={x}
                        onChange={(c) => updateTaskChecked(x, c)}
                      />
                    </Box>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          </Box>
        </>
      ) : (
        <TransitionGroup className="list">
          {posts.map((x) => (
            <CSSTransition
              key={x.timestamp.unix()}
              timeout={300}
              classNames="item"
            >
              <PostCardView codeBlock={x} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ),
    [posts, tasks, asTask]
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      gap="0.75rem"
      height="95%"
      maxWidth="30rem"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="1rem"
      >
        <ChevronLeftIcon onClick={handleClickMovePrevious} />
        <span onClick={handleClickDate}>{date.format("YYYY-MM-DD")}</span>
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="1rem"
      >
        <Button
          isDisabled={!canSubmit}
          className={canSubmit ? "mod-cta" : ""}
          onClick={handleClickSubmit}
          minHeight={"2.4em"}
          maxHeight={"2.4em"}
          disabled={!currentDailyNote}
          flexGrow={1}
        >
          Submit
        </Button>
        <Checkbox
          width="10rem"
          isChecked={asTask}
          onChange={() => setAsTask(!asTask)}
        >
          <Box
            color={asTask ? "var(--text-success)" : "var(--text-faint)"}
            opacity={asTask ? 1 : 0.2}
          >
            as a task
          </Box>
        </Checkbox>
      </Box>

      <Box flexGrow={1} overflowY="scroll" overflowX="hidden">
        {currentDailyNote && contents}
      </Box>
    </Box>
  );
};
