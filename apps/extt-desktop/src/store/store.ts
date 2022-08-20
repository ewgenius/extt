import create from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getStorage } from "#/lib/storage";

import { darkTheme, lightTheme } from "#/stitches.config";

export type Theme = "light" | "dark" | "system";

export interface State {
  sidebarOpen: boolean;
  theme: Theme;

  init: () => void;
  setTheme: (theme: Theme) => void;
  onSystemThemeChange: (event: MediaQueryListEvent) => void;
}

const themeMatcher = window.matchMedia("(prefers-color-scheme:dark)");

function applyTheme(isDark: boolean) {
  document.documentElement.className = isDark ? darkTheme : lightTheme;
}

export const options: PersistOptions<State, State> = {
  name: "extt-store",
  getStorage,
  partialize: (s) => s,
};

export const useStore = create<State>()(
  persist(
    immer((set, get) => ({
      sidebarOpen: false,
      theme: "light",

      init() {
        const { setTheme, theme } = get();

        setTheme(theme);
      },

      setTheme(theme) {
        set((s) => {
          const { onSystemThemeChange } = get();
          s.theme = theme;

          const isDark =
            (theme === "system" && themeMatcher.matches) || theme === "dark";

          if (theme === "system") {
            themeMatcher.addEventListener("change", onSystemThemeChange);
          } else {
            themeMatcher.removeEventListener("change", onSystemThemeChange);
          }

          applyTheme(isDark);
        });
      },

      onSystemThemeChange({ matches: isDark }) {
        applyTheme(isDark);
      },
    })),
    options
  )
);
