import { useCallback, useState } from "react";
import { createEditor, Descendant, Editor, Transforms } from "slate";
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
        className="container mx-auto max-w-4xl flex-grow p-8 prose prose-stone dark:prose-invert"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(e) => {
          console.log(e);

          if (e.key === "Enter") {
            if (e.shiftKey) {
              e.preventDefault();
              editor.insertText("\n");
            }
          }

          if (e.key === "/") {
          }

          if (e.metaKey && e.key === "a") {
            Transforms.select(editor, {
              anchor: Editor.start(editor, []),
              focus: Editor.end(editor, []),
            });
          }

          if (e.key === "Escape") {
            Transforms.deselect(editor);
          }

          if (e.ctrlKey) {
            switch (e.key) {
              case "`": {
                e.preventDefault();
                const [match] = Editor.nodes(editor, {
                  match: (n) => (n as any).type === "code",
                });
                Transforms.setNodes(
                  editor,
                  { type: match ? null : "code" } as any,
                  { match: (n) => Editor.isBlock(editor, n) }
                );
                break;
              }

              // case 'b': {
              //   e.preventDefault()
              //   Transforms.setNodes(
              //     editor,
              //     { bold: true },
              //     { match: n => Text.(n), split: true }
              //   )
              //   break
              // }
            }
          }
        }}
      />
    </Slate>
  );
}
