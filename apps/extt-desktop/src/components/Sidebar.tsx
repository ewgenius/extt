import { useSelector } from "react-redux";
import { MenuIcon, HomeIcon } from "@heroicons/react/outline";
import { useAppContext } from "#/AppContext";
import { Scroller } from "#/components/Scroller";
import { TreeEntry } from "#/components/TreeEntry";
import { useAppDispatch } from "#/store";
import { toggleSidebar } from "#/store/app/appReducer";
import { sidebarOpenSelector } from "#/store/app/appSelectors";
import { workingFolderPathSelector } from "#/store/workingFolder/workingFolderSelectors";

export const Sidebar = () => {
  const { entries, goHome } = useAppContext();

  const dispatch = useAppDispatch();
  const path = useSelector(workingFolderPathSelector);
  const sidebarOpen = useSelector(sidebarOpenSelector);
  const onToggle = () => dispatch(toggleSidebar());

  const buttons = (
    <div className="flex px-2 py-1 h-[32px] absolute bottom-0 backdrop-blur-lg w-full">
      <button
        onClick={onToggle}
        className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
      >
        <MenuIcon className="w-4 h-4 text-current" />
      </button>

      <button
        onClick={goHome}
        className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
      >
        <HomeIcon className="w-4 h-4 text-current" />
      </button>
    </div>
  );

  return sidebarOpen ? (
    <div className="h-full max-h-full flex flex-col min-w-[220px] shrink-0">
      <div className="h-full">
        <Scroller padded>
          <div className="p-2 pb-[32px]">
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
          </div>
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
