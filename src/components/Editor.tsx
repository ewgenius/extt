import { useEffect, useState } from "react";
import { fs } from "@tauri-apps/api";
import { Descendant } from "slate";

import { useAppContext } from "../AppContext";
import { useDebouncedCallback } from "../utils/useDebouncedCallback";
import { Node } from "slate";
import { SlateEditor } from "./SlateEditor";

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

const initialValue: Descendant[] = [
  {
    type: "heading-one",
    children: [
      {
        text: "Heading 1",
      },
    ],
  },
  {
    type: "heading-two",
    children: [
      {
        text: "Heading 2",
      },
    ],
  },
  {
    type: "heading-three",
    children: [
      {
        text: "Heading 3",
      },
    ],
  },
  {
    type: "heading-four",
    children: [
      {
        text: "Heading 4",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "paragraph",
      },
    ],
  },
  {
    type: "blockquote",
    children: [
      {
        text: "test blockquote",
      },
    ],
  },
  {
    type: "code",
    children: [
      {
        text: `const a = Test`,
      },
    ],
  },
];

export function Editor() {
  const { selectedEntry } = useAppContext();
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      if (selectedEntry && !selectedEntry.children) {
        setLoaded(false);
        const text = await fs.readTextFile(selectedEntry.path);
        // setValue(deserialize(text));
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
