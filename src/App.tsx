import { Button } from "./components/ui/button";
import { Tiptap } from "./Tiptap";

export const App = () => {
  return (
    <div className="h-full w-full flex flex-row items-stretch overflow-hidden">
      <div className="bg-base-2 h-full w-64 border-r flex flex-col">
        <div
          className="h-10 min-h-10 p-2 pt-0 flex items-center gap-1 text-sm shrink-0"
          data-tauri-drag-region
        />
        <div className="p-3 pt-0">
          sidebar
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
