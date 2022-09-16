import { useState, useEffect, useRef } from "react";
import { Command } from "cmdk";
import * as Popover from "@radix-ui/react-popover";
import { styled } from "#/stitches.config";
import { useStore } from "#/store";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "#/components/icons";

const Fade = styled("div", {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  inset: 0,
  backgroundColor: "$bg2",
  opacity: 0.5,
});

const Content = styled("div", {
  "> div": {
    position: "fixed",
    width: 640,
    height: 400,
    left: "calc(100vw / 2 - 320px)",
    top: "calc(100vh / 2 - 200px)",
    backgroundColor: "$bgNormal",
    display: "flex",
    flexFlow: "column",
    borderRadius: "$3",
    border: "1px solid",
    borderColor: "$borderDefault",
    boxShadow: `
      0 2px 8px 0px rgba(0, 0, 0, 0.1),
      0 4px 16px 0px rgba(0, 0, 0, 0.2)
    `,
    fontFamily: "inherit",
    color: "inherit",
    fontSize: 14,
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
  padding: "$2",

  "&>[cmdk-list-sizer]": {
    display: "flex",
    flexFlow: "column",
    gap: "$2",
  },
});

const Item = styled(Command.Item, {
  padding: "$3",
  color: "inherit",
  fontFamily: "inherit",
  borderRadius: "$2",
  cursor: "pointer",
  display: "flex",
  gap: "$3",
  alignItems: "center",

  "&:not([aria-disabled])": {
    "&:hover": {
      backgroundColor: "$bgHover",
    },

    "&:active": {
      backgroundColor: "$bgActive",
    },
  },

  "&[aria-disabled]": {
    color: "$solid1",
    cursor: "default",
  },
});

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");

  const {
    setTheme,
    settings: { theme },
  } = useStore();

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    inputRef?.current?.focus();

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
    <Popover.Root modal open={open} onOpenChange={setOpen}>
      <Popover.Content>
        <Content>
          <Command value={value} onValueChange={(v) => setValue(v)}>
            <Input
              autoFocus
              ref={inputRef}
              placeholder="Search for commands..."
            />
            <List>
              <Item
                disabled={theme === "light"}
                onSelect={() => setTheme("light")}
              >
                <SunIcon /> Theme: light
              </Item>
              <Item
                disabled={theme === "dark"}
                onSelect={() => setTheme("dark")}
              >
                <MoonIcon /> Theme: dark
              </Item>
              <Item
                disabled={theme === "system"}
                onSelect={() => setTheme("system")}
              >
                <ComputerDesktopIcon /> Theme: system
              </Item>
            </List>
          </Command>
        </Content>
      </Popover.Content>
    </Popover.Root>
  );
};
