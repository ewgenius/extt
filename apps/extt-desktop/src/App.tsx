import * as SelectPrimitive from "@radix-ui/react-select";
import * as colors from "@radix-ui/colors";
import {
  styled,
  css,
  globalStyles,
  themes,
  themeColors,
} from "#/stitches.config";
import { useStore } from "#/store";
import { CommandMenu } from "#/components/CommandMenu";
import { Button } from "#/components/Button";
import { Editor } from "#/components/Editor";
import {
  SunIcon,
  MoonIcon,
  FolderOpenIcon,
  DocumentPlusIcon,
  ComputerDesktopIcon,
} from "#/components/icons";

export const AppShell = styled("div", {
  width: "100vw",
  height: "100vh",
  paddingTop: 43,
});

const Toolbar = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "$bg1",
  display: "flex",
  alignItems: "center",
  gap: "$3",
  padding: "$3",
  borderBottom: "1px solid",
  borderBottomColor: "$borderDefault",
});

const ButtonGroup = styled("div", {
  display: "flex",

  "> :not(:first-child)": {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,

    // borderLeft: "1px solid",
    // borderLeftColor: "$borderDefault",
  },

  "> :not(:last-child)": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});

const Separator = styled("div", {
  borderLeft: "1px solid",
  borderLeftColor: "$borderDefault",
});

const StatePreview = styled("div", {
  fontSize: 12,
  padding: "$3",
});

export const ColorButton = styled("button", {
  border: "1px solid",
  borderRadius: "50%",
  width: 16,
  height: 16,
  cursor: "pointer",
});

export const App = () => {
  globalStyles();

  const { setTheme, setColor, settings, openWorkspace, workspace } = useStore();

  return (
    <>
      <AppShell>
        <Toolbar>
          <ButtonGroup>
            <Button
              disabled={settings.theme === "light"}
              onClick={() => setTheme("light")}
            >
              <SunIcon /> theme: light
            </Button>
            <Button
              disabled={settings.theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              <MoonIcon />
              theme: dark
            </Button>
            <Button
              disabled={settings.theme === "system"}
              onClick={() => setTheme("system")}
            >
              <ComputerDesktopIcon />
              theme: system
            </Button>
          </ButtonGroup>

          <Separator />

          <Button onClick={openWorkspace}>
            <FolderOpenIcon />
            open
          </Button>
          <Button onClick={openWorkspace}>
            <DocumentPlusIcon />
            new note
          </Button>

          <Separator />

          {themeColors.map((color) => {
            return (
              <ColorButton
                onClick={() => setColor(color)}
                style={{
                  backgroundColor: (colors as any)[color][color + "12"],
                  borderColor: (colors as any)[color][color + "11"],
                }}
              />
            );
          })}
        </Toolbar>

        <StatePreview>
          <p>{JSON.stringify(settings)}</p>
          <p>{JSON.stringify(workspace)}</p>
        </StatePreview>
        <Editor />
      </AppShell>
      <CommandMenu />
    </>
  );
};
