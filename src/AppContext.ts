import { createContext, useContext } from "react";
import { FileEntry } from "@tauri-apps/api/fs";

export interface AppContextState {
  goHome: () => void;
  path: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  entries: FileEntry[];
  setEntries: (entries: FileEntry[]) => any;
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
