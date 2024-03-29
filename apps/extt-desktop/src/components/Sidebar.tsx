import { MenuIcon, HomeIcon } from "@heroicons/react/outline";
import { Scroller } from "#/components/Scroller";
import { Tree } from "./Tree";
import { Entry } from "#/store/workingFolder";
import { useApp } from "#/store/app";
import { useWorkingFolder } from "#/store/workingFolder";

export const Sidebar = () => {
  const sidebarOpen = useApp((s) => s.sidebarOpen);
  const root = useWorkingFolder((s) => s.root);
  const toggle = useApp((s) => s.toggleSidebar);

  const buttons = (
    <div className="flex h-[32px] w-full px-2 py-1 backdrop-blur-lg">
      <button
        onClick={toggle}
        className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
      >
        <MenuIcon className="h-4 w-4 text-current" />
      </button>

      <button
        // onClick={goHome}
        className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
      >
        <HomeIcon className="h-4 w-4 text-current" />
      </button>
    </div>
  );

  return sidebarOpen ? (
    <div className="flex h-full max-h-full min-w-[220px] shrink-0 flex-col">
      <Scroller padded>
        <div className="p-2 pb-[32px]">
          <Tree root entry={root as Entry} />
        </div>
      </Scroller>

      {buttons}

      {/*
        <div className="flex-grow" />
        
        <button className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
          <FolderAddIcon className="w-4 h-4 text-current" />
        </button>

        <button className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
          <DocumentAddIcon className="w-4 h-4 text-current" />
        </button> */}
    </div>
  ) : (
    <div className="fixed left-0 bottom-0 z-10">{buttons}</div>
  );
};
