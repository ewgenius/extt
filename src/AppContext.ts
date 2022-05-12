import { createContext, useContext } from "react";
import { FileEntry } from "@tauri-apps/api/fs";

export interface RootEntry extends FileEntry {
  relativePath?: string;
  type?: "Inbox" | "Daily" | "Archive";
}

export function isRootEntry(e: RootEntry): e is RootEntry {
  return "relativePath" in e;
}

export interface AppContextState {
  goHome: () => void;
  path: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  entries: RootEntry[];
  setEntries: (entries: RootEntry[]) => any;
  selectedEntry: FileEntry | null;
  selectEntry: (e: FileEntry) => any;
}

export const AppContext = createContext<AppContextState>({
  goHome: () => {},
  path: "",
  sidebarOpen: true,
  toggleSidebar: () => {},
  entries: [],
  setEntries: (e) => {},
  selectedEntry: null,
  selectEntry: (e) => {},
});

export function useAppContext() {
  return useContext(AppContext);
}
