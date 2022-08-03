import { fs } from "@tauri-apps/api";
import create from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getStorage } from "#/lib/storage";

export interface Entry {
  path: string;
  name: string;
  expanded: boolean;
  relativePath?: string;
  type?: "Inbox" | "Daily" | "Archive";
  children?: string[];
}

export async function loadPath(path: string) {
  const tree = await fs.readDir(path, {
    recursive: true,
  });

  const root: Entry = {
    path,
    name: "/",
    children: [],
    expanded: true,
  };

  const entries: Record<string, Entry> = {};

  function parse(fileEntry: fs.FileEntry, e: Record<string, Entry>) {
    const parsed = fileEntry.path.split("/");
    const entry: Entry = {
      path: fileEntry.path,
      name: parsed[parsed.length - 1],
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
    immer((set) => ({
      initialized: false,
      path: null,
      root: null,
      entries: {},
      selected: null,

      setPath: async (path) => {
        set((s) => {
          s.path = path;
        });

        const { root, entries } = await loadPath(path);

        set((s) => {
          s.entries = entries;
          s.root = root;
          s.initialized = true;
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
