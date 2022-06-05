import { FileEntry } from "@tauri-apps/api/fs";
import { useCallback, useState } from "react";
import {
  FolderIcon,
  FolderOpenIcon,
  DocumentTextIcon,
  InboxIcon,
  ArchiveIcon,
  CalendarIcon,
} from "@heroicons/react/outline";
import { classNames } from "#/utils/classNames";
// import { useAppContext } from "#/AppContext";
import { useSelector } from "react-redux";
import { workingFolderPathSelector } from "#/store/workingFolder/workingFolderSelectors";

interface TreeEntryProps {
  root?: boolean;
  entry: FileEntry;
}

export function TreeEntry({ entry, root }: TreeEntryProps) {
  const [expanded, setExpanded] = useState(true);
  const toggle = useCallback(() => setExpanded(!expanded), [expanded]);

  // const { selectedEntry, selectEntry } = useAppContext();
  const path = useSelector(workingFolderPathSelector) || "";

  const click = useCallback(() => {
    selectEntry(entry);
  }, [entry]);

  const isSelected = selectedEntry?.path === entry.path;
  const isFolder = !!entry.children;

  const relativePath = entry.path.slice(path.length);
  const isInbox = isFolder && relativePath === "/Inbox";
  const isArchive = isFolder && relativePath === "/Archive";
  const isDaily = isFolder && relativePath === "/Daily";
  const isInsideDaily = relativePath.startsWith("/Daily");

  const Order: Record<string, number> = {
    Inbox: -3,
    Daily: -2,
    Archive: -1,
  };

  function getOrder(e: FileEntry): number {
    if (e.name && e.name in Order) {
      return Order[e.name];
    }

    return 0;
  }

  const direction = isInsideDaily ? -1 : 1;
  const children = entry.children && expanded && (
    <ul className={classNames(!root && "pl-4")}>
      {entry.children
        .sort((a, b) => {
          const orderA = getOrder(a);
          const orderB = getOrder(b);

          if (orderA && orderB) {
            return orderA - orderB;
          }
          if (orderA && !orderB) {
            return -1;
          }
          if (orderB && !orderA) {
            return 1;
          }

          if (!a.children || !b.children) {
            if (a.children) {
              return -1;
            } else if (b.children) {
              return 1;
            }
          }

          if (a.name && b.name) {
            if (a.name > b.name) {
              return direction * 1;
            }
            if (a.name < b.name) {
              return direction * -1;
            }
          }
          return 0;
        })
        .map((e) => (
          <TreeEntry key={e.path} entry={e} />
        ))}
    </ul>
  );

  if (root) {
    return <>{children}</>;
  }

  return (
    <li>
      <button
        className={classNames(
          "relative group flex items-center gap-1 text-xs p-1",
          isSelected
            ? "text-stone-900 dark:text-stone-100 font-bold"
            : "text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
        )}
        onClick={isFolder ? toggle : click}
      >
        {/* {isSelected && !isFolder && (
          <div className="absolute bg-current w-1 h-1 -left-2 rounded-lg" />
        )} */}
        {entry.children ? (
          isInbox ? (
            <InboxIcon className="w-4 h-4 text-current" />
          ) : isArchive ? (
            <ArchiveIcon className="w-4 h-4 text-current" />
          ) : isDaily ? (
            <CalendarIcon className="w-4 h-4 text-current" />
          ) : expanded ? (
            <FolderOpenIcon className="w-4 h-4 text-current" />
          ) : (
            <FolderIcon className="w-4 h-4 text-current" />
          )
        ) : (
          <DocumentTextIcon className="w-4 h-4 text-current" />
        )}
        <span>{entry.name || entry.path}</span>
        {/* {isFolder && (
          <div className="invisible group-hover:visible flex flex-row gap-1 ml-2">
            <button className="text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
              <FolderAddIcon className="w-4 h-4 text-current" />
            </button>
            <button className="text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100">
              <DocumentAddIcon className="w-4 h-4 text-current" />
            </button>
          </div>
        )} */}
      </button>

      {children}
    </li>
  );
}
