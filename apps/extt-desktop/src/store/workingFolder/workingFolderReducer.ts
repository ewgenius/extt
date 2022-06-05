import type { Immutable } from "immer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileEntry } from "@tauri-apps/api/fs";

export interface Entry {
  path: string;
  relativePath?: string;
  type?: "Inbox" | "Daily" | "Archive";
  children?: string[];
}

export type WorkingFolderState = Immutable<{
  initialized: boolean;
  path: string | null;
  root: Entry | null;
  entries: Record<string, Entry>;
}>;

export const initialState: WorkingFolderState = {
  initialized: false,
  path: null,
  root: null,
  entries: {},
};

export const workingFolderSlice = createSlice({
  name: "workingFolder",
  initialState,
  reducers: {
    setPath: (state, { payload }: PayloadAction<string | null>) => {
      state.path = payload;
    },
  },
});

export const workingFolderReducer = workingFolderSlice.reducer;

export const { setPath } = workingFolderSlice.actions;
