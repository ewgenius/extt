import { useEffect } from "react";
import { FolderAddIcon, FolderOpenIcon } from "@heroicons/react/outline";
import { fs, dialog } from "@tauri-apps/api";
import { Sidebar } from "#/components/Sidebar";
import { Editor } from "#/components/Editor";
import { useWorkingFolder } from "#/store/workingFolder";
import { useTheme } from "#/hooks/useTheme";

const welcomeTemplate = `# Welcome to Extt!

## What it can do?

> to be done...

\`\`\`scala

Monada([]>=:)

\`\`\`

_Ivag preved!_

![alt text](https://c.tenor.com/CHc0B6gKHqUAAAAj/deadserver.gif)
`;

export const App = () => {
  useTheme();

  const path = useWorkingFolder((s) => s.path);
  const selectedEntry = useWorkingFolder((s) =>
    s.selected ? s.entries[s.selected] : null
  );

  const setPath = useWorkingFolder((s) => s.setPath);

  const openFolderDialog = async () => {
    const p = await dialog.open({
      directory: true,
    });

    if (p) {
      // setSelectedEntry(null);
      // setSelectedFilePath(null);
      setPath(p as string);
    }
  };

  const createFolderDialog = async () => {
    const p = await dialog.save();

    if (p) {
      await fs.createDir(p);
      await Promise.all([
        fs.createDir(`${p}/Inbox`),
        fs.createDir(`${p}/Daily`),
        fs.createDir(`${p}/Archive`),
      ]);

      await fs.writeFile({
        path: `${p}/Inbox/welcome.md`,
        contents: welcomeTemplate,
      });
      await fs.writeFile({
        path: `${p}/Daily/welcome.md`,
        contents: welcomeTemplate,
      });

      // selectEntry({
      //   path: `${p}/Inbox/welcome.md`,
      // });
      setPath(p as string);
    }
  };

  // const createNewNote = useCallback(async () => {}, [path]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "o") {
        openFolderDialog();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!path || path === null) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 rounded-lg border border-stone-300 p-2 text-xs dark:border-stone-700"
            onClick={createFolderDialog}
          >
            <FolderAddIcon className="h-4 w-4 text-current" />
            Bootstrap notes folder
          </button>
          or
          <button
            className="flex items-center gap-2 rounded-lg border border-stone-300 p-2 text-xs dark:border-stone-700"
            onClick={openFolderDialog}
          >
            <FolderOpenIcon className="h-4 w-4 text-current" />
            Select notes folder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen select-none flex-row overflow-hidden">
      <Sidebar />

      <div className="relative flex h-full flex-grow flex-col">
        {selectedEntry ? (
          <Editor />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            {/* <button className="p-2 border border-stone-300 dark:border-stone-700 rounded-lg flex gap-2 items-center text-xs">
                <DocumentAddIcon className="w-4 h-4 text-current" />
                <span>Create New Note</span>
              </button> */}
          </div>
        )}
      </div>
    </div>
  );
};
