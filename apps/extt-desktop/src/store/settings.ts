import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getStorage } from "#/lib/storage";

export type Theme = "system" | "dark" | "light";

export type SettingsState = {
  theme: Theme;

  setTheme: (theme: Theme) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    immer((set) => ({
      theme: "system",

      setTheme: (theme: Theme) =>
        set((s) => {
          s.theme = theme;
        }),
    })),
    {
      name: "extt-settings",
      getStorage,
    }
  )
);
