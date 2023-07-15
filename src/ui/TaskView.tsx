import * as React from "react";
import { Task } from "../app-helper";
import { Box } from "@chakra-ui/react";

export const TaskView = ({
  task,
  onChange,
}: {
  task: Task;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <Box display="flex" alignItems="center">
      <input
        type="checkbox"
        checked={task.mark !== " "}
        value={task.name}
        onChange={(ev) => onChange(ev.target.checked)}
      />
      <label>{task.name}</label>
    </Box>
  );
};
