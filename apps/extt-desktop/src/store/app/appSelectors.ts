import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "#/store/rootReducer";

export const appState = (state: RootState) => state.app;

export const sidebarOpenSelector = createSelector(
  appState,
  (state) => state.sidebarOpen
);
