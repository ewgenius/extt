import { fs, dialog } from "@tauri-apps/api";
import { watch } from "tauri-plugin-fs-watch-api";
import create from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getStorage } from "#/lib/storage";
import { darkTheme, lightTheme, themes } from "#/stitches.config";

export type Theme = "light" | "dark" | "system";

export interface Settings {
  theme: Theme;
  color: string;
}

export interface Workspace {
  loaded: boolean;
  path: string | null;
  selectedPath: string | null;
  stopFsWatcher: (() => Promise<void>) | null;
}

export interface State {
  settings: Settings;
  workspace: Workspace;

  init: () => void;

  setTheme: (theme: Theme) => void;
  setColor: (color: string) => void;
  onSystemThemeChange: (event: MediaQueryListEvent) => void;
  initWorkspace: (path: string) => Promise<void>;
  loadWorkspace: () => Promise<void>;
  openWorkspace: () => Promise<void>;
}

const themeMatcher = window.matchMedia("(prefers-color-scheme:dark)");

function applyTheme(isDark: boolean, color: string) {
  document.documentElement.className = isDark
    ? themes[color + "Dark"]
    : themes[color];
}

export const options: PersistOptions<State, State> = {
  name: "extt-store",
  getStorage,
  partialize: (s) => s,
};

export const useStore = create<State>()(
  persist(
    immer((set, get) => ({
      settings: {
        theme: "light" as Theme,
        color: Object.keys(themes)[0],
      },

      workspace: {
        loaded: false,
        path: null,
        selectedPath: null,
        stopFsWatcher: null,
      },

      init() {
        const { settings, workspace, setTheme, initWorkspace } = get();

        setTheme(settings.theme);

        if (workspace.path) {
          initWorkspace(workspace.path);
        }
      },

      setColor(color) {
        const {
          settings: { theme },
        } = get();

        const isDark =
          (theme === "system" && themeMatcher.matches) || theme === "dark";

        applyTheme(isDark, color);

        set((s) => {
          s.settings.color = color;
        });
      },

      setTheme(theme) {
        set((s) => {
          const {
            onSystemThemeChange,
            settings: { color },
          } = get();
          s.settings.theme = theme;

          const isDark =
            (theme === "system" && themeMatcher.matches) || theme === "dark";

          if (theme === "system") {
            themeMatcher.addEventListener("change", onSystemThemeChange);
          } else {
            themeMatcher.removeEventListener("change", onSystemThemeChange);
          }

          applyTheme(isDark, color);
        });
      },

      onSystemThemeChange({ matches: isDark }) {
        const {
          settings: { color },
        } = get();
        applyTheme(isDark, color);
      },

      async initWorkspace(path) {
        const {
          workspace: { stopFsWatcher },
          loadWorkspace,
        } = get();

        if (stopFsWatcher) {
          await stopFsWatcher();
        }

        const stopWatching = await watch(path, { recursive: true }, (event) => {
          const { type } = event;
          switch (type) {
            case "Create":
            case "Remove":
            case "Rename":
            case "NoticeRemove":
              loadWorkspace();
              break;

            default:
              break;
          }
        });

        set((s) => {
          s.workspace.path = path;
          s.workspace.stopFsWatcher = stopWatching;
        });

        await loadWorkspace();
      },

      async loadWorkspace() {
        const {
          workspace: { path },
        } = get();

        if (!path) {
          return;
        }

        const root = await fs.readDir(path, {
          recursive: true,
        });

        console.log(root);

        set((s) => {
          s.workspace.loaded = true;
        });
      },

      async openWorkspace() {
        const { initWorkspace } = get();

        const path = (await dialog.open({
          directory: true,
          multiple: false,
        })) as string | null;

        if (path) {
          initWorkspace(path);
        }
      },
    })),
    options
  )
);
