import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
// import { RightSidebar } from "./RightSidebar";
import { Tiptap } from "./Tiptap";

export const App = () => {
  return (
    <div className="w-full h-full">
      <SidebarProvider>
        <AppSidebar />

        <main className="relative w-full h-full">
          <SidebarTrigger className="absolute left-2 top-2" />
          <Tiptap />
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
