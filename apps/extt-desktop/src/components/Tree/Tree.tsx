import { FC, useCallback } from "react";
import { useWorkingFolder } from "#/store/workingFolder";
import { Entry } from "#/store/workingFolder";
import { classNames } from "#/utils/classNames";
import {
  ArchiveIcon,
  CalendarIcon,
  DocumentTextIcon,
  FolderIcon,
  FolderOpenIcon,
  InboxInIcon,
} from "@heroicons/react/outline";

function comparePaths(a: string, b: string) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

const Order: Record<string, number> = {
  Inbox: -3,
  Daily: -2,
  Archive: -1,
};

function getOrder(e: Entry): number {
  if (e.name && e.name in Order) {
    return Order[e.name];
  }

  return 0;
}

export interface TreeProps {
  root?: boolean;
  entry: Entry;
  order?: 1 | -1;
}

export const Tree: FC<TreeProps> = ({ entry, root, order = 1 }) => {
  const entries = useWorkingFolder((s) => s.entries);
  const selected = useWorkingFolder((s) => s.selected);
  const toggleEntry = useWorkingFolder((s) => s.toggleEntry);
  const selectEntry = useWorkingFolder((s) => s.selectEntry);
  const isSelected = entry && entry.path === selected;

  const onToggle = useCallback(
    () => entry && toggleEntry(entry.path),
    [entry && entry.path]
  );

  const onSelect = useCallback(
    () => entry && selectEntry(entry.path),
    [entry && entry.path]
  );

  if (!entry) {
    return null;
  }

  const isInsideDaily = entry.name !== "Daily" || entry.path.includes("Daily/");

  if (entry.type !== "File") {
    console.log(entry.type);
    return (
      <>
        {!root && (
          <button
            onClick={onToggle}
            className={classNames(
              "group relative flex items-center gap-1 p-1 text-xs",
              "text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
            )}
          >
            {entry.type === "Inbox" ? (
              <InboxInIcon className="h-4 w-4 text-current" />
            ) : entry.type === "Archive" ? (
              <ArchiveIcon className="h-4 w-4 text-current" />
            ) : entry.type === "Daily" || entry.path.includes("Daily/") ? (
              <CalendarIcon className="h-4 w-4 text-current" />
            ) : entry.expanded ? (
              <FolderOpenIcon className="h-4 w-4 text-current" />
            ) : (
              <FolderIcon className="h-4 w-4 text-current" />
            )}
            <span>{entry.name}</span>
          </button>
        )}
        {entry.children && (root || entry.expanded) && (
          <ul className={classNames(!root && "pl-4")}>
            {entry.children
              .map((p) => entries[p] as Entry)
              .sort((a, b) => {
                const orderA = getOrder(a);
                const orderB = getOrder(b);

                if (orderA && orderB) {
                  return (orderA - orderB) * order;
                }
                if (orderA && !orderB) {
                  return -1 * order;
                }
                if (orderB && !orderA) {
                  return 1 * order;
                }

                return comparePaths(a.path, b.path) * order;
              })
              .map((childEntry) => {
                return (
                  <li key={childEntry.path}>
                    <Tree
                      entry={childEntry}
                      order={isInsideDaily ? -1 : order}
                    />
                  </li>
                );
              })}
          </ul>
        )}
      </>
    );
  }

  return (
    <button
      onClick={onSelect}
      className={classNames(
        "group relative flex items-center gap-1 p-1 text-xs",
        isSelected
          ? "font-bold text-stone-900 dark:text-stone-100"
          : "text-stone-500 hover:text-stone-900 dark:text-stone-400 hover:dark:text-stone-100"
      )}
    >
      <DocumentTextIcon className="h-4 w-4 text-current" />
      <span>{entry && entry.name}</span>
    </button>
  );
};
