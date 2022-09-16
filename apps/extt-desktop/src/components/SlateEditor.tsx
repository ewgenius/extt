import { useRef, useState } from "react";
import { createEditor, Descendant, Editor, Range, Transforms } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ElementWithMenu } from "#/components/Element";
import { Leaf } from "#/components/Leaf";
import { Scroller } from "#/components/Scroller";

const renderElement = (props: RenderElementProps) => (
  <ElementWithMenu {...props} />
);

const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

interface ShortcutsEditor extends Editor {}

const withShortcuts: <T extends ShortcutsEditor>(
  editor: T
) => T & ShortcutsEditor = (editor) => {
  const { insertText } = editor;

  editor.insertText = (text: string) => {
    const { selection } = editor;

    if (text === "/" && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      if (anchor.offset === 0) {
        // insertText(text);
        Transforms.setNodes(editor, { type: "command" }, { at: selection });
      }
      // const block = Editor.above(editor, {
      //   match: (n) => Editor.isBlock(editor, n),
      // });
      // const path = block ? block[1] : [];
      // const start = Editor.start(editor, path);
      // const range = { anchor, focus: start };
      // const beforeText = Editor.string(editor, range);
      // console.log(beforeText, range);
    }

    return insertText(text);
  };

  return editor;
};

export function SlateEditor({
  value,
  onSave,
}: {
  value: Descendant[];
  onSave: (value: Descendant[]) => void;
}) {
  const [editor] = useState(() =>
    withShortcuts(withHistory(withReact(createEditor())))
  );

  const editorPortalRoot = useRef<HTMLDivElement>(null);

  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport>
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
            className="prose prose-stone dark:prose-invert container relative mx-auto max-w-4xl select-text py-8 px-16"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onBlur={(e) => {
              console.log(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) {
                  e.preventDefault();
                  editor.insertText("\n");
                } else {
                  e.preventDefault();
                  editor.insertNode({
                    type: "paragraph",
                    children: [{ text: "" }],
                  });
                }
              }

              // if (e.key === "/") {
              //   console.log(e);
              // }

              if (e.metaKey) {
                if (e.key === "a") {
                  Transforms.select(editor, {
                    anchor: Editor.start(editor, []),
                    focus: Editor.end(editor, []),
                  });
                }
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
        <div
          ref={editorPortalRoot}
          id="portal-root"
          className="absolute top-0 left-0 w-full"
        />
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
