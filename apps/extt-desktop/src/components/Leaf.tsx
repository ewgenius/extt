import { FC } from "react";
import { RenderLeafProps } from "slate-react";
import { classNames } from "#/utils/classNames";

export const Leaf: FC<RenderLeafProps> = ({ attributes, leaf, children }) => {
  if (leaf.image) {
    return (
      <div className="flex justify-center">
        <img src={leaf.image} alt={leaf.text} className="rounded-sm" />
      </div>
    );
  }

  if (leaf.href) {
    return (
      <a
        {...attributes}
        href={leaf.href}
        className={classNames(
          leaf.bold && "font-bold",
          leaf.italic && "italic",
          leaf.code &&
            "font-mono bg-stone-200 dark:bg-stone-700 -m-1 p-1 rounded-lg"
        )}
      >
        {children}
      </a>
    );
  }

  return (
    <span
      {...attributes}
      className={classNames(
        leaf.bold && "font-bold",
        leaf.italic && "italic",
        leaf.code &&
          "font-mono bg-stone-200 dark:bg-stone-700 -m-1 p-1 rounded-lg"
      )}
    >
      {children}
    </span>
  );
};
