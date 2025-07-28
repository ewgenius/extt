import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "./components/ui/textarea";

export function RightSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <div className="grow">content</div>
        <div className="p-2">
          <Textarea className="resize-none" />
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
