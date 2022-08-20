import { styled, globalStyles } from "#/stitches.config";
import { useStore } from "#/store";

export const AppShell = styled("div", {
  width: "100vw",
  height: "100vh",
});

export const App = () => {
  globalStyles();

  const { setTheme } = useStore();

  return (
    <AppShell>
      <button onClick={() => setTheme("dark")}>dark</button>
      <button onClick={() => setTheme("light")}>light</button>
      <button onClick={() => setTheme("system")}>system</button>
      app
    </AppShell>
  );
};
