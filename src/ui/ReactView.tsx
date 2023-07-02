import * as React from "react";
import { useMemo, useState } from "react";
import { Box, Button, Textarea } from "@chakra-ui/react";
import { Notice } from "obsidian";

interface Props {
  onSubmit: (input: string) => void;
}

export const ReactView = ({ onSubmit }: Props) => {
  const [input, setInput] = useState("");
  const canSubmit = useMemo(() => input.length > 0, [input]);
  const handleClickSubmit = () => {
    onSubmit(input);
    setInput("");
    new Notice("Submitted", 1000);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      gap="1rem"
      maxWidth="800px"
      marginTop="8rem"
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
    </Box>
  );
};
