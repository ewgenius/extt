import type { Immutable } from "immer";
import { createSlice } from "@reduxjs/toolkit";

export type AppState = Immutable<{
  sidebarOpen: boolean;
}>;

const initialState: AppState = {
  sidebarOpen: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const appRedcuer = appSlice.reducer;

export const { toggleSidebar, openSidebar, closeSidebar } = appSlice.actions;
