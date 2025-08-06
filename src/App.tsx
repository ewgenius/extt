import { AppSidebar } from "./AppSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
// import { RightSidebar } from "./RightSidebar";
import { Tiptap } from "./Tiptap";

export const App = () => {
  return (
    <div className="w-full h-full">
      <SidebarProvider>
        <AppSidebar />
        <main className="relative w-full h-svh select-none flex flex-col">
          <AppTitlebar />
          <div className="grow overflow-y-auto">
            <Tiptap />
          </div>
          {/*<SidebarProvider
            style={
              {
                "--sidebar-width": "24rem",
                "--sidebar-width-mobile": "20rem",
              } as any
            }
          >
            <RightSidebar variant="floating" side="right" />
          </SidebarProvider>*/}
        </main>
      </SidebarProvider>
    </div>
  );
};

const AppTitlebar = () => {
  const { state } = useSidebar();

  return (
    <div
      className={cn(
        "h-10 min-h-10 p-2 flex items-center gap-1 text-sm shrink-0",
        state === "expanded" ? "pl-2" : "pl-18",
      )}
      data-tauri-drag-region
    >
      <SidebarTrigger
        className={cn(
          "transition-opacity duration-150",
          state === "expanded" ? "opacity-0" : "delay-300",
        )}
      />
    </div>
  );
};
