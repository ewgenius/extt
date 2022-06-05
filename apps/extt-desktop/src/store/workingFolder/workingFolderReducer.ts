import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WorkingFolderState {
  initialized: boolean;
  path: string | null;
}

export const initialState: WorkingFolderState = {
  initialized: false,
  path: null,
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
