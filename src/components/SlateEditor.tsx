import { useCallback, useState } from "react";
import { createEditor, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";
import { Element } from "./Element";
import { Leaf } from "./Leaf";

const renderElement = (props: RenderElementProps) => <Element {...props} />;

const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

export function SlateEditor({
  value,
  onSave,
}: {
  value: Descendant[];
  onSave: (value: Descendant[]) => void;
}) {
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
        renderLeaf={renderLeaf}
        onKeyDown={(e) => {
          // console.log(e);
        }}
      />
    </Slate>
  );
}
