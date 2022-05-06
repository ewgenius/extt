import { useAppContext } from "#/AppContext";
import { MenuIcon } from "@heroicons/react/outline";
import { TreeEntry } from "#/components/TreeEntry";

export function Sidebar({}) {
  const { path, entries, toggleSidebar, sidebarOpen } = useAppContext();

  return sidebarOpen ? (
    <div className="flex flex-col min-w-[220px]">
      <div className="flex-grow overflow-auto">
        <div className="p-2">
          {path && entries && (
            <>
              <ul className="mb-2">
                <TreeEntry
                  root
                  entry={{
                    name: "/",
                    path: path,
                    children: entries.filter(
                      ({ name }) => name === "Inbox" || name === "Archive"
                    ),
                  }}
                />
              </ul>

              <ul>
                <TreeEntry
                  root
                  entry={{
                    name: "/",
                    path: path,
                    children: entries.filter(
                      ({ name }) => name !== "Inbox" && name !== "Archive"
                    ),
                  }}
                />
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="p-2 flex flex-row gap-1">
        <button
          onClick={toggleSidebar}
          className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
        >
          <MenuIcon className="w-4 h-4 text-current" />
        </button>

        {/*
        <div className="flex-grow" />
        
        <button className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
          <FolderAddIcon className="w-4 h-4 text-current" />
        </button>

        <button className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
          <DocumentAddIcon className="w-4 h-4 text-current" />
        </button> */}
      </div>
    </div>
  ) : (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-2 z-10 left-2 p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
    >
      <MenuIcon className="w-4 h-4 text-current" />
    </button>
  );
}
