import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Textarea } from "@chakra-ui/react";
import { App, moment, Notice, TFile } from "obsidian";
import { AppHelper, CodeBlock, Task } from "../app-helper";
import { sorter } from "../utils/collections";
import {
  createDailyNote,
  getAllDailyNotes,
  getDailyNote,
} from "obsidian-daily-notes-interface";
import {
  ChatIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Moment } from "moment";
import { PostCardView } from "./PostCardView";
import { TaskView } from "./TaskView";
import { replaceDayToJa } from "../utils/strings";

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

    if (!currentDailyNote) {
      new Notice("デイリーノートが存在しなかったので新しく作成しました");
      await createDailyNote(date);
      // 再読み込みをするためにクローンを入れて参照を更新
      setDate(date.clone());
    }

    // デイリーノートがなくてif文に入った場合、setDateからのuseMemoが間に合わずcurrentDailyNoteの値が更新されないので、意図的に同じ処理を呼び出す
    await appHelper.insertTextToEnd(
      getDailyNote(date, getAllDailyNotes()),
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

  const handleClickDate = async () => {
    if (!currentDailyNote) {
      new Notice("デイリーノートが存在しなかったので新しく作成しました");
      await createDailyNote(date);
      // 再読み込みをするためにクローンを入れて参照を更新
      setDate(date.clone());
    }

    // デイリーノートがなくてif文に入った場合、setDateからのuseMemoが間に合わずcurrentDailyNoteの値が更新されないので、意図的に同じ処理を呼び出す
    await app.workspace
      .getLeaf(true)
      .openFile(getDailyNote(date, getAllDailyNotes()));
  };
  const handleClickMovePrevious = () => {
    setDate(date.clone().subtract(1, "day"));
  };
  const handleClickMoveNext = () => {
    setDate(date.clone().add(1, "day"));
  };

  const handleClickTime = (codeBlock: CodeBlock) => {
    (async () => {
      if (!currentDailyNote) {
        return;
      }

      // TODO: 今後必要に応じてAppHelperにだす
      const leaf = app.workspace.getLeaf(true);
      await leaf.openFile(currentDailyNote);

      const editor = appHelper.getActiveMarkdownEditor()!;
      const pos = editor.offsetToPos(codeBlock.offset);
      editor.setCursor(pos);
      await leaf.openFile(currentDailyNote, {
        eState: { line: pos.line },
      });
    })();
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

    const deleteEventRef = app.vault.on("delete", async (file) => {
      if (file.path !== currentDailyNoteRef.current?.path) {
        return;
      }

      // 再読み込みをするためにクローンを入れて参照を更新
      setDate(date.clone());
      setTasks([]);
      setPosts([]);
    });

    return () => {
      app.metadataCache.offref(eventRef);
      app.vault.offref(deleteEventRef);
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
            minHeight={50}
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
            minHeight={50}
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
              <PostCardView codeBlock={x} onClickTime={handleClickTime} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ),
    [posts, tasks, asTask]
  );

  return (
    <Flex flexDirection="column" gap="0.75rem" height="95%" maxWidth="30rem">
      <HStack justify="center">
        <ChevronLeftIcon cursor="pointer" onClick={handleClickMovePrevious} />
        <Box cursor="pointer" onClick={handleClickDate}>
          {replaceDayToJa(date.format("YYYY-MM-DD(ddd)"))}
        </Box>
        <ChevronRightIcon cursor="pointer" onClick={handleClickMoveNext} />
      </HStack>
      <Textarea
        placeholder={asTask ? "タスクを入力" : "思ったことなどを記入"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        minHeight={"8em"}
        maxHeight={"8em"}
        resize={"none"}
      />
      <HStack>
        <Button
          isDisabled={!canSubmit}
          className={canSubmit ? "mod-cta" : ""}
          onClick={handleClickSubmit}
          minHeight={"2.4em"}
          maxHeight={"2.4em"}
          flexGrow={1}
          cursor={canSubmit ? "pointer" : ""}
        >
          {asTask ? "タスク追加" : "投稿"}
        </Button>
        <Box
          display="flex"
          gap="0.5em"
          padding={4}
          marginRight={8}
          borderStyle={"solid"}
          borderRadius={"10px"}
          borderColor={"var(--table-border-color)"}
          borderWidth={"2px"}
          cursor={"pointer"}
          onClick={() => setAsTask(!asTask)}
          _hover={{
            borderColor: "var(--text-success)",
            transitionDuration: "0.5s",
          }}
          transitionDuration={"0.5s"}
        >
          <ChatIcon
            boxSize={"1.5em"}
            color={asTask ? "var(--text-faint)" : "var(--text-success)"}
            opacity={asTask ? 0.2 : 1}
          />
          <CheckCircleIcon
            boxSize={"1.5em"}
            color={asTask ? "var(--text-success)" : "var(--text-faint)"}
            opacity={asTask ? 1 : 0.2}
          />
        </Box>
      </HStack>

      <Box flexGrow={1} overflowY="scroll" overflowX="hidden">
        {currentDailyNote && contents}
      </Box>
    </Flex>
  );
};
