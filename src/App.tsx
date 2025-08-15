import { useEffect } from "react";
import { Button } from "./components/ui/button";
import { Tiptap } from "./Tiptap";
import { setTheme } from "@tauri-apps/api/app";
import { getCurrentWindow } from "@tauri-apps/api/window";

async function setAppTheme(theme?: "light" | "dark" | null) {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.remove("dark");
    root.classList.add("light");
  } else if (theme === "dark") {
    root.classList.remove("light");
    root.classList.add("dark");
  } else {
    root.classList.remove("light");
    root.classList.remove("dark");
  }
}

async function init() {
  const window = getCurrentWindow();
  const currentTheme = await window.theme();
  setAppTheme(currentTheme);

  window.show();
  window.onThemeChanged(({ payload: theme }) => {
    console.log("New theme: " + theme);
    setAppTheme(theme);
  });
}

export const App = () => {
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="h-full w-full flex flex-row items-stretch overflow-hidden">
      <div className="bg-base-2 h-full w-64 border-r flex flex-col">
        <div
          className="h-10 min-h-10 p-2 pt-0 flex items-center gap-1 text-sm shrink-0"
          data-tauri-drag-region
        />
        <div className="p-3 pt-0 flex flex-col gap-2">
          sidebar
          <div className="flex items-center gap-2">
            <Button
              onClick={async () => {
                await setTheme("dark");
                setAppTheme("dark");
              }}
            >
              dark
            </Button>
            <Button
              onClick={async () => {
                await setTheme("light");
                setAppTheme("light");
              }}
            >
              light
            </Button>

            <Button
              onClick={async () => {
                await setTheme(null);
                setAppTheme(null);
              }}
            >
              system
            </Button>
          </div>
          <div>
            <Button size="xs">button</Button>
          </div>
          <div>
            <Button>button</Button>
          </div>
          <div>
            <Button size="md">button</Button>
          </div>
        </div>
      </div>

      <div className="grow h-full flex flex-col relative p-0.5">
        <div className="grow flex flex-col overflow-y-auto">
          <Tiptap />
        </div>
      </div>
    </div>
  );
};
