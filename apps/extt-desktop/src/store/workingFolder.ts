import { fs } from "@tauri-apps/api";
import { watch } from "tauri-plugin-fs-watch-api";
import create from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getStorage } from "#/lib/storage";

export type EntryType = "Inbox" | "Daily" | "Archive" | "Folder" | "File";

export interface Entry {
  path: string;
  name: string;
  expanded: boolean;
  relativePath?: string;
  type: "Inbox" | "Daily" | "Archive" | "Folder" | "File";
  children?: string[];
}

export async function loadPath(path: string) {
  const tree = await fs.readDir(path, {
    recursive: true,
  });

  const root: Entry = {
    path,
    name: "/",
    type: "Folder",
    children: [],
    expanded: true,
  };

  const entries: Record<string, Entry> = {};

  function parse(fileEntry: fs.FileEntry, e: Record<string, Entry>) {
    const parsed = fileEntry.path.split("/");
    const name = parsed[parsed.length - 1].toLowerCase();
    const entry: Entry = {
      path: fileEntry.path,
      name,
      type:
        name === "inbox"
          ? "Inbox"
          : name === "archive"
          ? "Archive"
          : name === "daily"
          ? "Daily"
          : name.endsWith("md")
          ? "File"
          : "Folder",
      expanded: true,
    };

    if (fileEntry.children && fileEntry.children.length) {
      entry.children = [];
      fileEntry.children.forEach((child) => {
        if (child.children || child.path.endsWith(".md")) {
          entry.children?.push(child.path);
          parse(child, e);
        }
      });
    }

    e[entry.path] = entry;
  }

  tree.forEach((fileEntry) => {
    if (fileEntry.children || fileEntry.path.endsWith(".md")) {
      root.children?.push(fileEntry.path);
      parse(fileEntry, entries);
    }
  });

  return { root, entries };
}

export type WorkingFolderState = {
  initialized: boolean;
  path: string | null;
  root: Entry | null;
  entries: Record<string, Entry>;
  selected: string | null;
  stopWatcher?: () => Promise<void>;

  initialize: () => void;
  load: (path: string) => void;
  setPath: (path: string) => void;
  setEntries: (root: Entry, entries: Record<string, Entry>) => void;
  toggleEntry: (key: string) => void;
  selectEntry: (key: string) => void;
};

const persistOptions: PersistOptions<
  WorkingFolderState,
  Pick<WorkingFolderState, "path" | "selected">
> = {
  name: "extt-working-folder",
  getStorage,
  partialize: (s) => ({
    path: s.path,
    selected: s.selected,
  }),
};

export const useWorkingFolder = create<WorkingFolderState>()(
  persist(
    immer((set, get) => ({
      initialized: false,
      path: null,
      root: null,
      entries: {},
      selected: null,

      initialize: () => {
        const { path, initialized, setPath } = get();

        if (!initialized && path) {
          setPath(path);
        }
      },

      load: async (path: string) => {
        const { root, entries } = await loadPath(path);

        set((s) => {
          s.entries = entries;
          s.root = root;
          s.initialized = true;
        });
      },

      setPath: async (path) => {
        const { load, stopWatcher } = get();

        set((s) => {
          s.path = path;
        });

        if (stopWatcher) {
          await stopWatcher();
        }

        await load(path);

        const stopWatching = await watch(path, { recursive: true }, (event) => {
          const { type } = event;
          switch (type) {
            case "Create":
            case "Remove":
            case "Rename":
            case "NoticeRemove":
              load(path);
              break;

            default:
              break;
          }
        });

        set((s) => {
          s.stopWatcher = stopWatching;
        });
      },

      setEntries: (root, entries) =>
        set((s) => {
          s.entries = entries;
          s.root = root;
          s.initialized = true;
        }),

      toggleEntry: (key) =>
        set((s) => {
          if (s.entries[key]) {
            s.entries[key].expanded = !s.entries[key].expanded;
          }
        }),

      selectEntry: (key) =>
        set((s) => {
          s.selected = key;
        }),
    })),
    persistOptions
  )
);
