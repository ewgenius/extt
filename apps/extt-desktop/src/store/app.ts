import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getStorage } from "#/lib/storage";

export type AppState = {
  sidebarOpen: boolean;

  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const useApp = create<AppState>()(
  persist(
    immer((set) => ({
      sidebarOpen: false,

      openSidebar: () =>
        set((s) => {
          s.sidebarOpen = true;
        }),

      closeSidebar: () =>
        set((s) => {
          s.sidebarOpen = false;
        }),

      toggleSidebar: () =>
        set((s) => {
          s.sidebarOpen = !s.sidebarOpen;
        }),
    })),
    {
      name: "extt-app",
      getStorage,
    }
  )
);
