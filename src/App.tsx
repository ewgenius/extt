import { fs, dialog } from "@tauri-apps/api";
import { FileEntry } from "@tauri-apps/api/fs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  FolderIcon,
  FolderOpenIcon,
  DocumentTextIcon,
  DocumentAddIcon,
  FolderAddIcon,
  MenuIcon,
  DotsVerticalIcon,
  InboxIcon,
  ArchiveIcon,
} from "@heroicons/react/outline";

interface AppContextState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedEntry: FileEntry | null;
  selectEntry: (e: FileEntry) => any;
}

const AppContext = createContext<AppContextState>({
  sidebarOpen: true,
  toggleSidebar: () => {},
  selectedEntry: null,
  selectEntry: (e) => {},
});

function classNames(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TreeEntryProps {
  root?: boolean;
  entry: FileEntry;
}

function TreeEntry({ entry, root }: TreeEntryProps) {
  const [expanded, setExpanded] = useState(true);
  const toggle = useCallback(() => setExpanded(!expanded), [expanded]);

  const { selectedEntry, selectEntry } = useContext(AppContext);

  const click = useCallback(() => {
    selectEntry(entry);
  }, [entry]);

  const isSelected = selectedEntry?.path === entry.path;

  const isInbox = entry.children && entry.name === "Inbox";
  const isArchive = entry.children && entry.name === "Archive";

  const children = entry.children && expanded && (
    <ul className="pl-4">
      {entry.children
        .sort((a, b) => {
          if (a.children) {
            return -1;
          } else if (b.children) {
            return 1;
          }

          if (a.name && b.name) {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
          }
          return 0;
        })
        .map((e) => (
          <TreeEntry key={e.path} entry={e} />
        ))}
    </ul>
  );

  if (root) {
    return <>{children}</>;
  }

  return (
    <li className={classNames((isInbox || isArchive) && "mb-3")}>
      <button
        className={classNames(
          "relative flex items-center gap-1 text-xs p-1",
          isSelected
            ? "text-stone-900 dark:text-stone-100 font-bold"
            : "text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
        )}
        onClick={click}
      >
        {isSelected && (
          <div className="absolute bg-current w-1 h-1 -left-2 rounded-lg" />
        )}
        {entry.children ? (
          isInbox ? (
            <InboxIcon className="w-4 h-4 text-current" />
          ) : isArchive ? (
            <ArchiveIcon className="w-4 h-4 text-current" />
          ) : expanded ? (
            <FolderOpenIcon className="w-4 h-4 text-current" />
          ) : (
            <FolderIcon className="w-4 h-4 text-current" />
          )
        ) : (
          <DocumentTextIcon className="w-4 h-4 text-current" />
        )}
        <span>{entry.name || entry.path}</span>
      </button>

      {children}
    </li>
  );
}

function App() {
  const [path, setPath] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = useCallback(
    () => setSidebarOpen(!sidebarOpen),
    [sidebarOpen]
  );

  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<FileEntry | null>(null);

  const [text, setText] = useState("");

  useEffect(() => {
    async function readDirectory(p: string) {
      const e = await fs.readDir(p, {
        recursive: true,
      });

      setEntries(e && e.filter((e) => e.children || e.path.endsWith(".md")));
    }

    if (path) {
      readDirectory(path);
    }
  }, [path]);

  const selectEntry = async (entry: FileEntry) => {
    setSelectedEntry(entry);
    if (!entry.children) {
      const text = await fs.readTextFile(entry.path);
      setText(text);
    }
  };

  const open = async () => {
    const p = await dialog.open({
      directory: true,
    });
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
        sidebarOpen,
        toggleSidebar,
        selectedEntry,
        selectEntry,
      }}
    >
      <div className="w-screen h-screen overflow-hidden flex flex-row">
        {sidebarOpen ? (
          <div className="flex flex-col w-[220px]">
            <div className="flex-grow overflow-y-auto">
              <div className="p-2">
                {path && entries && (
                  <ul>
                    <TreeEntry
                      root
                      entry={{ name: "/", path: path, children: entries }}
                    />
                  </ul>
                )}
              </div>
            </div>

            <div className="p-2 flex flex-row gap-1">
              <button
                onClick={toggleSidebar}
                className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
              >
                <MenuIcon className="w-4 h-4 text-current" />
              </button>

              <div className="flex-grow" />

              <button className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
                <FolderAddIcon className="w-4 h-4 text-current" />
              </button>

              <button className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
                <DocumentAddIcon className="w-4 h-4 text-current" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={toggleSidebar}
            className="fixed bottom-2 z-10 left-2 p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
          >
            <MenuIcon className="w-4 h-4 text-current" />
          </button>
        )}

        <div className="relative flex-grow overflow-y-auto">
          <div className="fixed top-0 right-0 p-2 pr-4">
            <button className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
              <DotsVerticalIcon className="w-4 h-4 text-current" />
            </button>
          </div>

          {selectedEntry && (
            <>
              {selectedEntry.children ? (
                <div className="container mx-auto px-8 py-16">
                  <div className="grid grid-cols-4 gap-4">
                    {selectedEntry.children.map((entry) => {
                      return (
                        <div
                          key={entry.path}
                          className="p-2 rounded-lg border border-stone-700 text-xs"
                        >
                          {entry.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="container mx-auto max-w-2xl px-2 py-8">
                  <h1 className="pt-8 pb-2 text-4xl font-bold">
                    {selectedEntry.name}
                  </h1>
                  <div
                    className="text-md leading-8 focus:outline-none"
                    contentEditable="true"
                  >
                    {text}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
