import { useSelector } from "react-redux";
import { MenuIcon, HomeIcon } from "@heroicons/react/outline";
import { Scroller } from "#/components/Scroller";
import { workingFolderRootSelector } from "#/store/workingFolder/workingFolderSelectors";
import { Tree } from "./Tree";
import { Entry } from "#/store/workingFolder/workingFolderReducer";
import { useAppStore } from "#/store/appStore";

export const Sidebar = () => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggle = useAppStore((s) => s.toggleSidebar);

  const root = useSelector(workingFolderRootSelector);

  const buttons = (
    <div className="absolute bottom-0 flex h-[32px] w-full px-2 py-1 backdrop-blur-lg">
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
      <div className="h-full">
        <Scroller padded>
          <div className="p-2 pb-[32px]">
            <Tree root entry={root as Entry} />
          </div>
          {/* <div className="p-2 pb-[32px]">
            {path && entries && (
              <>
                <ul className="mb-2">
                  <TreeEntry
                    root
                    entry={{
                      name: "/",
                      path: path,
                      children: entries.filter(
                        ({ name }) =>
                          name === "Inbox" ||
                          name === "Archive" ||
                          name === "Daily"
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
                        ({ name }) =>
                          name !== "Inbox" &&
                          name !== "Archive" &&
                          name !== "Daily"
                      ),
                    }}
                  />
                </ul>
              </>
            )}
          </div> */}
        </Scroller>
      </div>

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
