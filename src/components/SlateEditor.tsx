import { FC, useCallback, useState } from "react";
import { createEditor, Text, BaseEditor, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { Node } from "slate";

type CustomText = { text: string; bold?: true };
type ElementType =
  | "heading-one"
  | "heading-two"
  | "heading-three"
  | "heading-four"
  | "paragraph"
  | "bold"
  | "italic"
  | "blockquote"
  | "code";

type CustomElement = { type: ElementType; children: CustomText[] };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export function SlateEditor({
  value,
  onSave,
}: {
  value: Descendant[];
  onSave: (value: Descendant[]) => void;
}) {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          onSave(value);
        }
      }}
    >
      <Editable
        className="container mx-auto max-w-2xl flex-grow p-8 prose prose-stone dark:prose-invert"
        renderElement={renderElement}
        onKeyDown={(e) => {
          // console.log(e);
        }}
      />
    </Slate>
  );
}

export const Element: FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  switch (element.type) {
    case "heading-one":
      return (
        <h1 className="relative decorator decorator-h1" {...attributes}>
          {children}
        </h1>
      );

    case "heading-two":
      return (
        <h2 className="relative decorator decorator-h2" {...attributes}>
          {children}
        </h2>
      );

    case "heading-three":
      return (
        <h3 className="relative decorator decorator-h3" {...attributes}>
          {children}
        </h3>
      );

    case "heading-four":
      return (
        <h4 className="relative decorator decorator-h4" {...attributes}>
          {children}
        </h4>
      );

    case "paragraph":
      return <p {...attributes}>{children}</p>;

    case "bold":
      return <b {...attributes}>{children}</b>;

    case "blockquote":
      return <blockquote {...attributes}>{children}</blockquote>;

    case "code":
      return <pre {...attributes}>{children}</pre>;

    default:
      return <p>{children}</p>;
  }
  // return (
  //   <span
  //     {...attributes}
  //     className={classNames(
  //       leaf.bold && "font-bold",
  //       leaf.italic && "italic",
  //       leaf.underlined && "underline",
  //       leaf.title && "text-lg font-bold"
  //     )}
  //   >
  //     {children}
  //   </span>
  // );
};
