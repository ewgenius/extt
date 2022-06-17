import { useEffect } from "react";
import { useSettings } from "#/store/settings";

export function useTheme() {
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");

    const matchTheme = ({ matches }: MediaQueryListEvent) => {
      if (matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (theme === "system") {
      matcher.addEventListener("change", matchTheme);
    } else {
      matcher.removeEventListener("change", matchTheme);
    }

    return () => {
      matcher.removeEventListener("change", matchTheme);
    };
  }, [theme]);
}
