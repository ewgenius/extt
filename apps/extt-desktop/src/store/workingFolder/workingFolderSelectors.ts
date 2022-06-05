import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "#/store/rootReducer";

export const workingFolderState = (state: RootState) => state.workingFolder;

export const workingFolderPathSelector = createSelector(
  workingFolderState,
  (state) => state.path
);
