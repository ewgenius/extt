import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FolderAddIcon, FolderOpenIcon } from "@heroicons/react/outline";
import { fs, dialog } from "@tauri-apps/api";
import { FileEntry } from "@tauri-apps/api/fs";
import { AppContext, RootEntry } from "#/AppContext";
import { Sidebar } from "#/components/Sidebar";
import { Editor } from "#/components/Editor";
import { useAsyncEffect } from "#/hooks/useAsyncEffect";
import { useAppDispatch } from "#/store";
import { setPath } from "#/store/workingFolder/workingFolderReducer";
import { workingFolderPathSelector } from "#/store/workingFolder/workingFolderSelectors";

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
  const dispatch = useAppDispatch();
  const path = useSelector(workingFolderPathSelector);

  const [entries, setEntries] = useState<RootEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<FileEntry | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const selectEntry = async (entry: FileEntry) => {
    setSelectedEntry(entry);
    setSelectedFilePath(entry.path);
  };

  const openFolderDialog = async () => {
    const p = await dialog.open({
      directory: true,
    });

    if (p) {
      setSelectedEntry(null);
      setSelectedFilePath(null);
      dispatch(setPath(p as string));
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

      selectEntry({
        path: `${p}/Inbox/welcome.md`,
      });
      dispatch(setPath(p as string));
    }
  };

  const createNewNote = useCallback(async () => {}, [path]);

  const goHome = () => {
    setSelectedEntry(null);
    setSelectedFilePath(null);
    dispatch(setPath(null));
  };

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
  });

  useAsyncEffect(async () => {
    if (path && path !== "null") {
      const tree = await fs.readDir(path, {
        recursive: true,
      });

      setEntries(
        tree &&
          tree
            .filter((e) => e.children || e.path.endsWith(".md"))
            .map((e) => {
              const relativePath = e.path.slice(path.length);
              const isFolder = !!e.children;

              const rootEntry: RootEntry = {
                ...e,
                relativePath,
              };

              if (isFolder) {
                if (relativePath === "/Inbox") {
                  rootEntry.type = "Inbox";
                }
                if (relativePath === "/Archive") {
                  rootEntry.type = "Archive";
                }
                if (relativePath === "/Daily") {
                  rootEntry.type = "Daily";
                }
              }

              return rootEntry;
            })
      );
    }
  }, [path]);

  useEffect(() => {
    if (selectedFilePath) {
      selectEntry({
        path: selectedFilePath,
      });
    }
  }, [selectedFilePath]);

  if (!path || path === null) {
    return (
      <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
        <div className="flex gap-4 items-center">
          <button
            className="p-2 border border-stone-300 dark:border-stone-700 rounded-lg flex gap-2 items-center text-xs"
            onClick={createFolderDialog}
          >
            <FolderAddIcon className="text-current w-4 h-4" />
            Bootstrap notes folder
          </button>
          or
          <button
            className="p-2 border border-stone-300 dark:border-stone-700 rounded-lg flex gap-2 items-center text-xs"
            onClick={openFolderDialog}
          >
            <FolderOpenIcon className="text-current w-4 h-4" />
            Select notes folder
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        goHome,
        entries,
        setEntries,
        selectedEntry,
        selectEntry,
      }}
    >
      <div className="w-screen h-screen overflow-hidden flex flex-row select-none">
        <Sidebar />

        <div className="h-full relative flex flex-col flex-grow">
          {selectedEntry ? (
            <Editor />
          ) : (
            <div className="h-full flex flex-col justify-center items-center">
              {/* <button className="p-2 border border-stone-300 dark:border-stone-700 rounded-lg flex gap-2 items-center text-xs">
                <DocumentAddIcon className="w-4 h-4 text-current" />
                <span>Create New Note</span>
              </button> */}
            </div>
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
};
