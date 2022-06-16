import { useAppDispatch } from "#/store";
import {
  Entry,
  selectEntry,
  toggleEntry,
} from "#/store/workingFolder/workingFolderReducer";
import {
  workingFolderSelectedSelector,
  workingFolderEntriesSelector,
} from "#/store/workingFolder/workingFolderSelectors";
import { classNames } from "#/utils/classNames";
import { DocumentTextIcon, FolderIcon } from "@heroicons/react/outline";
import { FC, useCallback } from "react";
import { useSelector } from "react-redux";

export interface TreeProps {
  root?: boolean;
  entry: Entry;
}

export const Tree: FC<TreeProps> = ({ entry, root }) => {
  const dispatch = useAppDispatch();
  const entries = useSelector(workingFolderEntriesSelector);
  const selected = useSelector(workingFolderSelectedSelector);
  const isSelected = entry.path === selected;

  const onToggle = useCallback(
    () => dispatch(toggleEntry(entry.path)),
    [entry.path]
  );

  const onSelect = useCallback(
    () => dispatch(selectEntry(entry.path)),
    [entry.path]
  );

  if (entry.children) {
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
            <FolderIcon className="h-4 w-4 text-current" />
            <span>{entry.name}</span>
          </button>
        )}
        {(root || entry.expanded) && (
          <ul className={classNames(!root && "pl-4")}>
            {entry.children.map((p) => {
              const childEntry = entries[p] as Entry;
              return (
                <li>
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
      <span>{entry.name}</span>
    </button>
  );
};
