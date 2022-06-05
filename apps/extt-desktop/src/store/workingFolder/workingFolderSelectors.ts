import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "#/store/rootReducer";

export const workingFolderState = (state: RootState) => state.workingFolder;

export const workingFolderPathSelector = createSelector(
  workingFolderState,
  (state) => state.path
);

export const workingFolderRootSelector = createSelector(
  workingFolderState,
  (state) => state.root
);

export const workingFolderEntriesSelector = createSelector(
  workingFolderState,
  (state) => state.entries
);

export const workingFolderSelectedSelector = createSelector(
  workingFolderState,
  (state) => state.selected
);
