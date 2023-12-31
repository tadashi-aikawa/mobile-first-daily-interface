import * as React from "react";
import { Task } from "../app-helper";
import { HStack } from "@chakra-ui/react";
import { excludeWikiLink } from "../utils/strings";
import Markdown from "marked-react";

export const TaskView = ({
  task,
  onChange,
}: {
  task: Task;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <HStack>
      <input
        type="checkbox"
        checked={task.mark !== " "}
        value={task.name}
        onChange={(ev) => onChange(ev.target.checked)}
      />
      <label>
        <Markdown gfm breaks isInline>
          {excludeWikiLink(task.name)}
        </Markdown>
      </label>
    </HStack>
  );
};
