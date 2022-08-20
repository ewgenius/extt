import { useState, useEffect } from "react";
import { Command } from "cmdk";
import * as Popover from "@radix-ui/react-popover";
import { styled } from "#/stitches.config";

const Fade = styled("div", {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  inset: 0,
  backgroundColor: "$bg2",
  opacity: 0.5,
});

const Content = styled("div", {
  $$shadow: "$colors$bg1",

  "> div": {
    position: "fixed",
    width: 640,
    height: 400,
    left: "calc(100vw / 2 - 320px)",
    top: "calc(100vh / 2 - 200px)",
    backgroundColor: "$bgNormal",
    display: "flex",
    flexFlow: "column",
    borderRadius: "$2",
    border: "1px solid",
    borderColor: "$borderDefault",
    boxShadow: "0 0 4px 4px $$shadow",
    fontFamily: "inherit",
  },
});

const Input = styled(Command.Input, {
  background: "none",
  border: "none",
  outline: "none",
  padding: "$4",
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  borderBottom: "1px solid",
  borderColor: "$borderDefault",
});

const List = styled(Command.List, {
  padding: "$3",
});

const Item = styled(Command.Item, {
  padding: 8,
  color: "inherit",
  fontFamily: "inherit",
  borderRadius: "$3",

  "&:hover": {
    backgroundColor: "$bgHover",
  },
});

export const CommandMenu = () => {
  const [open, setOpen] = useState(true);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Popover.Root open={open} modal onOpenChange={setOpen}>
      <Popover.Content>
        <Content>
          <Command>
            <Input />
            <List>
              <Item>Apple 0</Item>
              <Item>Apple 2</Item>
              <Item>Apple 3</Item>
              <Item>Apple 4</Item>
              <Item>Apple 5</Item>
            </List>
          </Command>
        </Content>
      </Popover.Content>
    </Popover.Root>
  );
};
