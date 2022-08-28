import { styled, globalStyles } from "#/stitches.config";
import { useStore } from "#/store";
import { CommandMenu } from "#/components/CommandMenu";
import { Button } from "#/components/Button";
import {
  SunIcon,
  MoonIcon,
  FolderOpenIcon,
  DocumentPlusIcon,
} from "#/components/icons";

export const AppShell = styled("div", {
  width: "100vw",
  height: "100vh",
});

const Toolbar = styled("div", {
  display: "flex",
  gap: "$3",
  padding: "$3",
  borderBottom: "1px solid",
  borderBottomColor: "$borderDefault",
});

const Separator = styled("div", {
  borderLeft: "1px solid",
  borderLeftColor: "$borderDefault",
});

const StatePreview = styled("div", {
  fontSize: 12,
  padding: "$3",
});

export const App = () => {
  globalStyles();

  const { setTheme, settings, openWorkspace, workspace } = useStore();

  return (
    <>
      <AppShell>
        <Toolbar>
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
            theme: system
          </Button>

          <Separator />

          <Button onClick={openWorkspace}>
            <FolderOpenIcon />
            open
          </Button>
          <Button onClick={openWorkspace}>
            <DocumentPlusIcon />
            new note
          </Button>
        </Toolbar>

        <StatePreview>
          <p>{JSON.stringify(settings)}</p>
          <p>{JSON.stringify(workspace)}</p>
        </StatePreview>
        {/* <Editor /> */}
      </AppShell>
      <CommandMenu />
    </>
  );
};
