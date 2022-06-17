import { FC, useCallback } from "react";
import { useWorkingFolder } from "#/store/workingFolder";
import { Entry } from "#/store/workingFolder";
import { classNames } from "#/utils/classNames";
import {
  ArchiveIcon,
  CalendarIcon,
  DocumentTextIcon,
  FolderIcon,
  InboxInIcon,
} from "@heroicons/react/outline";

export interface TreeProps {
  root?: boolean;
  entry: Entry;
}

export const Tree: FC<TreeProps> = ({ entry, root }) => {
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

  if (entry && entry.children) {
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
            {entry.name === "Inbox" ? (
              <InboxInIcon className="h-4 w-4 text-current" />
            ) : entry.name === "Archive" ? (
              <ArchiveIcon className="h-4 w-4 text-current" />
            ) : entry.name === "Daily" || entry.path.includes("Daily/") ? (
              <CalendarIcon className="h-4 w-4 text-current" />
            ) : (
              <FolderIcon className="h-4 w-4 text-current" />
            )}
            <span>{entry.name}</span>
          </button>
        )}
        {(root || entry.expanded) && (
          <ul className={classNames(!root && "pl-4")}>
            {entry.children.map((p) => {
              const childEntry = entries[p] as Entry;
              return (
                <li key={childEntry.path}>
                  <Tree entry={childEntry} />
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
