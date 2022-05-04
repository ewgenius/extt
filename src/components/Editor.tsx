import { useEffect, useMemo, useState } from "react";
import { fs } from "@tauri-apps/api";
import { createEditor, BaseEditor, Descendant } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { useAppContext } from "../AppContext";
import { useDebouncedCallback } from "../utils/useDebouncedCallback";
import { Node } from "slate";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string; bold?: true };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Define a serializing function that takes a value and returns a string.
const serialize = (value: any[]) => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map((n) => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join("\n")
  );
};

// Define a deserializing function that takes a string and returns a value.
const deserialize = (str: string) => {
  return str.split("\n").map((line) => {
    const item: Descendant = {
      type: "paragraph",
      children: [{ text: line }],
    };
    return item;
  });
};

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
      <Editable className="container mx-auto max-w-2xl flex-grow p-8 " />
    </Slate>
  );
}

export function Editor() {
  const { selectedEntry } = useAppContext();
  const [value, setValue] = useState<Descendant[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      if (selectedEntry && !selectedEntry.children) {
        setLoaded(false);
        const text = await fs.readTextFile(selectedEntry.path);
        setValue(deserialize(text));
        setTimeout(() => setLoaded(true), 100);
      } else {
        setLoaded(false);
        setValue([]);
      }
    })();
  }, [selectedEntry, selectedEntry?.path]);

  const save = useDebouncedCallback(
    async (value: Descendant[]) => {
      if (selectedEntry) {
        await fs.writeFile({
          path: selectedEntry.path,
          contents: serialize(value),
        });
      }
    },
    500,
    [selectedEntry, selectedEntry?.path]
  );

  if (selectedEntry && loaded) {
    return (
      <div className="flex flex-col flex-grow overflow-y-auto">
        <SlateEditor key={selectedEntry.path} value={value} onSave={save} />
      </div>
    );
  }

  return null;
}

/*

  const [text, setText] = useState("");
  const debouncedSave = useDebouncedCallback(
    async (content: string) => {
      if (selectedEntry) {
        console.log("test", content);
        setText(content);

        await fs.writeFile({
          path: selectedEntry.path,
          contents: content,
        });
      }
    },
    500,
    [selectedEntry]
  );

  useEffect(() => {
    (async () => {
      if (selectedEntry && !selectedEntry.children) {
        const text = await fs.readTextFile(selectedEntry.path);
        setText(text);
      }
    })();
  }, [selectedEntry, selectedEntry?.path]);

  useEffect(() => {
    debouncedSave(text);
  }, [text]);

  if (selectedEntry) {
    return (
      <div className="container mx-auto max-w-2xl px-2 py-8">
        <h1 className="my-8 pb-2 text-4xl font-bold">{selectedEntry.name}</h1>
        <div
          className="mt-8 text-md leading-8 focus:outline-none"
          contentEditable="true"
          key={selectedEntry.path}
          onInput={(e) => {
            const content = e.target as HTMLDivElement;
            debouncedSave(content.innerText);
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  return <div></div>;
}
*/
