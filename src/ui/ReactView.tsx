import * as React from "react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Box, Button, Flex, HStack, Input, Textarea } from "@chakra-ui/react";
import { App, moment, Notice, TFile } from "obsidian";
import { AppHelper, PostBlock, Task } from "../app-helper";
import { sorter } from "../utils/collections";
import {
  createDailyNote,
  getAllDailyNotes,
  getDailyNote,
  getDailyNoteSettings,
} from "obsidian-daily-notes-interface";
import {
  ChatIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Moment } from "moment";
import { PostCardView } from "./PostCardView";
import { TaskView } from "./TaskView";
import { replaceDayToJa } from "../utils/strings";
import { Settings } from "../settings";

export const ReactView = ({
  app,
  settings,
}: {
  app: App;
  settings: Settings;
}) => {
  const appHelper = useMemo(() => new AppHelper(app), [app]);

  const [date, setDate] = useState<Moment>(moment());
  // デイリーノートが存在しないとnull
  const [currentDailyNote, setCurrentDailyNote] = useState<TFile | null>(null);
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState<PostBlock[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [asTask, setAsTask] = useState(false);
  const canSubmit = useMemo(() => input.length > 0, [input]);

  const updateCurrentDailyNote = () => {
    const n = getDailyNote(date, getAllDailyNotes()) as TFile | null;
    if (n?.path !== currentDailyNote?.path) {
      setCurrentDailyNote(n);
    }
  };

  useEffect(() => {
    updateCurrentDailyNote();
  }, [date]);

  useEffect(() => {
    if (!currentDailyNote) {
      return;
    }

    Promise.all([updatePosts(currentDailyNote), updateTasks(currentDailyNote)]);
  }, [currentDailyNote]);

  const handleClickSubmit = async () => {
    let text = "";
    if (asTask) {
      text = `- [ ] ${input}`
    } else {
      if (settings.enableCalloutFormat) {
        text = `
> [!mfdi] ${moment().toISOString(true)}
${input.split('\n').map(line => `> ${line}`).join('\n')}
`;
      } else {
        text = `
\`\`\`\`fw ${moment().toISOString(true)}
${input}
\`\`\`\`
`;
      }
    }

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
      ((await appHelper.getPostBlocks(note)) ?? [])
        ?.filter((x) => (x.blockType === "fw" || x.blockType === "mfdi"))
        .sort(sorter((x) => x.timestamp.unix(), "desc"))
    );
  };

  const updateTasks = async (note: TFile) => {
    setTasks((await appHelper.getTasks(note)) ?? []);
  };

  const handleClickOpenDailyNote = async () => {
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
  const handleChangeCalendarDate = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setDate(moment(event.target.value));
  };
  const handleClickMovePrevious = () => {
    setDate(date.clone().subtract(1, "day"));
  };
  const handleClickMoveNext = async () => {
    setDate(date.clone().add(1, "day"));
  };
  const handleClickToday = async () => {
    setDate(moment());
  };

  const handleClickTime = (postBlock: PostBlock) => {
    (async () => {
      if (!currentDailyNote) {
        return;
      }

      // TODO: 今後必要に応じてAppHelperにだす
      const leaf = app.workspace.getLeaf(true);
      await leaf.openFile(currentDailyNote);

      const editor = appHelper.getActiveMarkdownEditor()!;
      const pos = editor.offsetToPos(postBlock.offset);
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
        // currentDailyNoteが存在してパスが異なるなら、違う日なので更新は不要
        if (currentDailyNote != null && file.path !== currentDailyNote.path) {
          return;
        }

        if (currentDailyNote == null) {
          const ds = getDailyNoteSettings();
          const dir = ds.folder ? `${ds.folder}/` : "";
          const entry = date.format(ds.format);
          // 更新されたファイルがcurrentDailyNoteになるべきファイルではなければ処理は不要
          if (file.path !== `${dir}${entry}.md`) {
            return;
          }
        }

        // 同期などで裏でDaily Noteが作成されたときに更新する
        updateCurrentDailyNote();
        await Promise.all([updatePosts(file), updateTasks(file)]);
      }
    );

    const deleteEventRef = app.vault.on("delete", async (file) => {
      // currentDailyNoteとは別のファイルなら関係ない
      if (file.path !== currentDailyNote?.path) {
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
  }, [date, currentDailyNote]);

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
              <PostCardView
                postBlock={x}
                settings={settings}
                onClickTime={handleClickTime}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ),
    [posts, tasks, asTask]
  );

  return (
    <Flex
      flexDirection="column"
      gap="0.75rem"
      height="95%"
      maxWidth="30rem"
      position={"relative"}
    >
      <HStack justify="center">
        <ChevronLeftIcon
          boxSize="1.5em"
          cursor="pointer"
          onClick={handleClickMovePrevious}
        />
        <Box textAlign={"center"}>
          <Button
            marginRight={"0.3em"}
            fontSize={"80%"}
            width="3em"
            height="2em"
            cursor="pointer"
            onClick={handleClickToday}
          >
            今日
          </Button>
          <Input
            size="md"
            type="date"
            value={date.format("YYYY-MM-DD")}
            onChange={handleChangeCalendarDate}
            width={"9em"}
          />
          <Box as="span" marginLeft={"0.2em"} fontSize={"95%"}>
            {replaceDayToJa(date.format("(ddd)"))}
          </Box>
        </Box>
        <ChevronRightIcon
          boxSize="1.5em"
          cursor="pointer"
          onClick={handleClickMoveNext}
        />
      </HStack>
      <Box position="absolute" right={0}>
        <ExternalLinkIcon
          boxSize="1.25em"
          cursor="pointer"
          onClick={handleClickOpenDailyNote}
        />
      </Box>

      <Textarea
        placeholder={asTask ? "タスクを入力" : "思ったことなどを記入"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        minHeight={"8em"}
        resize="vertical"
      />
      <HStack>
        <Button
          isDisabled={!canSubmit}
          className={canSubmit ? "mod-cta" : ""}
          minHeight={"2.4em"}
          maxHeight={"2.4em"}
          flexGrow={1}
          cursor={canSubmit ? "pointer" : ""}
          onClick={handleClickSubmit}
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
          _hover={{
            borderColor: "var(--text-success)",
            transitionDuration: "0.5s",
          }}
          transitionDuration={"0.5s"}
          onClick={() => setAsTask(!asTask)}
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
