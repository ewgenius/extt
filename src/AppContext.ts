import { createContext, useContext } from "react";
import { FileEntry } from "@tauri-apps/api/fs";

export interface AppContextState {
  path: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  entries: FileEntry[];
  setEntries: (entries: FileEntry[]) => any;
  selectedEntry: FileEntry | null;
  selectEntry: (e: FileEntry) => any;
}

export const AppContext = createContext<AppContextState>({
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
