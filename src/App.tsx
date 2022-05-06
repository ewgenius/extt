import { useCallback, useEffect, useState } from "react";
import { DocumentAddIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { fs, dialog } from "@tauri-apps/api";
import { FileEntry } from "@tauri-apps/api/fs";
import { AppContext } from "./AppContext";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";
import { useStore } from "./StoreContext";
import { useAsyncEffect } from "./hooks/useAsyncEffect";

export function App() {
  const { set, get } = useStore();
  const [path, setPath] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = useCallback(
    () => setSidebarOpen(!sidebarOpen),
    [sidebarOpen]
  );

  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<FileEntry | null>(null);

  useAsyncEffect(async () => {
    const storedPath = await get("path");
    if (storedPath) {
      console.log(storedPath);
      setPath(storedPath as string);
    }
  }, []);

  useEffect(() => {
    async function readDirectory(p: string) {
      const e = await fs.readDir(p, {
        recursive: true,
      });

      const filtered =
        e && e.filter((e) => e.children || e.path.endsWith(".md"));
      setEntries(filtered);

      if (filtered) {
        const selectedPath = await get<string>("selectedPath");
        if (selectedPath) {
          selectEntry({
            path: selectedPath,
          });
        }
      }
    }

    if (path) {
      readDirectory(path);
    }
  }, [path]);

  const selectEntry = async (entry: FileEntry) => {
    setSelectedEntry(entry);
    set("selectedPath", entry.path);
  };

  const open = async () => {
    const p = await dialog.open({
      directory: true,
    });
    set("path", p as string);
    setPath(p as string);
  };

  if (!path) {
    return (
      <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
        <button onClick={open}>open</button>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        path,
        sidebarOpen,
        toggleSidebar,
        entries,
        setEntries,
        selectedEntry,
        selectEntry,
      }}
    >
      <div className="w-screen h-screen overflow-hidden flex flex-row">
        <Sidebar />

        <div className="relative flex flex-col flex-grow">
          <div className="fixed top-0 right-0 p-2 pr-4">
            <button className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
              <DotsVerticalIcon className="w-4 h-4 text-current" />
            </button>
          </div>

          {selectedEntry ? (
            <Editor />
          ) : (
            <div className="h-full flex flex-col justify-center items-center">
              <button className="flex gap-2 text-stone-700 text-lg">
                <DocumentAddIcon className="w-6 h-6 text-current" />
                <span>Create New Note</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
}
