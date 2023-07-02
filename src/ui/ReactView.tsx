import * as React from "react";
import { useState } from "react";
import { Box, Button, Textarea } from "@chakra-ui/react";

interface Props {
  onSubmit: (input: string) => void;
}

export const ReactView = ({ onSubmit }: Props) => {
  const [input, setInput] = useState("");
  const handleClickSubmit = () => {
    onSubmit(input);
    setInput("");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      gap="8px"
      maxWidth="800px"
    >
      <Textarea
        placeholder="Input anything"
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button variant="outline" onClick={handleClickSubmit}>
        Submit
      </Button>
    </Box>
  );
};
