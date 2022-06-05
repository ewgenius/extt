import type { Immutable } from "immer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileEntry } from "@tauri-apps/api/fs";

export interface Entry {
  path: string;
  name: string;
  expanded: boolean;
  relativePath?: string;
  type?: "Inbox" | "Daily" | "Archive";
  children?: string[];
}

export type WorkingFolderState = Immutable<{
  initialized: boolean;
  path: string | null;
  root: Entry | null;
  entries: Record<string, Entry>;
  selected: string | null;
}>;

export const initialState: WorkingFolderState = {
  initialized: false,
  path: null,
  root: null,
  entries: {},
  selected: null,
};

export const workingFolderSlice = createSlice({
  name: "workingFolder",
  initialState,
  reducers: {
    setPath: (state, { payload }: PayloadAction<string | null>) => {
      state.path = payload;
    },
    setEntries: (
      state,
      {
        payload,
      }: PayloadAction<{
        root: Entry;
        entries: Record<string, Entry>;
      }>
    ) => {
      state.root = payload.root;
      state.entries = payload.entries;
      state.initialized = true;
    },
    toggleEntry: (state, { payload }: PayloadAction<string>) => {
      state.entries[payload].expanded = !state.entries[payload].expanded;
    },
    selectEntry: (state, { payload }: PayloadAction<string | null>) => {
      state.selected = payload;
    },
  },
});

export const workingFolderReducer = workingFolderSlice.reducer;

export const { setPath, setEntries, toggleEntry, selectEntry } =
  workingFolderSlice.actions;
