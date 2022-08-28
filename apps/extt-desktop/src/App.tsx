import { styled, globalStyles } from "#/stitches.config";
import { Entry, useStore } from "#/store";
import { CommandMenu } from "#/components/CommandMenu";
import { Button } from "#/components/Button";
import { Editor } from "#/components/Editor";
import { ColorsSelector } from "#/components/ColorsSelector";
import {
  SunIcon,
  MoonIcon,
  FolderOpenIcon,
  DocumentPlusIcon,
  ComputerDesktopIcon,
  FolderIcon,
} from "#/components/icons";

export const AppShell = styled("div", {
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexFlow: "column",
});

export const Layout = styled("div", {
  flexGrow: 1,
  display: "flex",
});

const Toolbar = styled("div", {
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

const Sidebar = styled("div", {
  display: "flex",
  flexFlow: "column",
  borderRight: "1px solid",
  borderRightColor: "$borderDefault",
  padding: "$2",
  minWidth: 320,
});

const TreeEntryComponent = styled("div", {
  fontSize: 12,

  "& > div": {
    display: "flex",
    gap: "$3",
    alignContent: "center",
    padding: "$2",
  },

  "& > ul": {
    paddingLeft: "$4",

    "&> li": {
      listStyleType: "none",
    },
  },

  variants: {
    root: {
      true: {
        "& > ul": {
          paddingLeft: 0,
        },
      },
    },
  },
});

const TreeEntry = ({ entry, root }: { entry: Entry; root?: boolean }) => {
  const {
    workspace: { entries },
  } = useStore();
  return (
    <TreeEntryComponent>
      {!root && (
        <div>
          <FolderIcon />
          {entry.name}
        </div>
      )}
      {entry.children && (
        <ul>
          {entry.children.map((child) => (
            <li>
              <TreeEntry entry={entries![child]} />
            </li>
          ))}
        </ul>
      )}
    </TreeEntryComponent>
  );
};

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

          <ColorsSelector />
        </Toolbar>

        <Layout>
          <Sidebar>
            {workspace.root && <TreeEntry root entry={workspace.root} />}
          </Sidebar>
          <Editor />
        </Layout>
      </AppShell>
      <CommandMenu />
    </>
  );
};
