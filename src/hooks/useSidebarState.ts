import { useCallback } from "react";
import { useStoredState } from "#/hooks/useStoredState";

export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useStoredState<boolean>(
    "sidebarOpen",
    true,
    (v) => String(v),
    (s) => s === "true"
  );
  const toggleSidebar = useCallback(
    () => setSidebarOpen(!sidebarOpen),
    [sidebarOpen]
  );

  return {
    sidebarOpen,
    toggleSidebar,
  };
}
