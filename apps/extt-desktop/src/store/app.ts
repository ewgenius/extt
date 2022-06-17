import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Theme = "system" | "dark" | "light";

export type AppState = {
  sidebarOpen: boolean;
  theme: Theme;

  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
};

export const useApp = create<AppState>()(
  persist(
    immer((set) => ({
      sidebarOpen: false,
      theme: "system",

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

      setTheme: (theme: Theme) =>
        set((s) => {
          s.theme = theme;
        }),
    })),
    {
      name: "extt-app",
      getStorage: () => localStorage,
    }
  )
);
