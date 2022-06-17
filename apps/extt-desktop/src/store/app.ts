import create from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "system" | "dark" | "light";

export interface AppState {
  sidebarOpen: boolean;
  theme: Theme;

  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const useApp = create(
  persist<AppState>(
    (set) => ({
      sidebarOpen: false,
      theme: "system",

      openSidebar: () =>
        set((s) => ({
          ...s,
          sidebarOpen: true,
        })),

      closeSidebar: () =>
        set((s) => ({
          ...s,
          sidebarOpen: false,
        })),

      toggleSidebar: () =>
        set((s) => ({
          ...s,
          sidebarOpen: !s.sidebarOpen,
        })),

      setTheme: (theme: Theme) =>
        set((s) => ({
          ...s,
          theme,
        })),
    }),
    {
      name: "extt-app",
      getStorage: () => localStorage,
    }
  )
);
