import { useEffect, useState } from "react";
import { fs } from "@tauri-apps/api";
import { Descendant } from "slate";
import { useDebouncedCallback } from "#/utils/useDebouncedCallback";
import { SlateEditor } from "#/components/SlateEditor";
import { serialize } from "#/lib/serialize";
import { deserialize } from "#/lib/deserialize";
import { useWorkingFolder } from "#/store/workingFolder";
import { styled } from "#/stitches.config";

const EditorContainer = styled("div", {
  padding: "$4",
  maxWidth: 748,
  margin: "0px auto",
});

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
        text: "paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph paragraph ",
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
  // const selectedEntry = useWorkingFolder((s) =>
  //   s.selected ? s.entries[s.selected] : null
  // );
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      // if (selectedEntry && !selectedEntry.children) {
      //   setLoaded(false);
      //   const text = await fs.readTextFile(selectedEntry.path);
      //   setValue(deserialize(text));
      //   setTimeout(() => setLoaded(true), 100);
      // } else {
      setLoaded(false);
      setValue([]);
      // }
    })();
  }, []);

  const save = useDebouncedCallback(
    async (value: Descendant[]) => {
      // if (selectedEntry) {
      //   // console.log(serialize(value));
      //   await fs.writeFile({
      //     path: selectedEntry.path,
      //     contents: serialize(value),
      //   });
      // }
    },
    500,
    []
  );

  // if (loaded) {
  return (
    <EditorContainer>
      <SlateEditor value={value} onSave={save} />
    </EditorContainer>
  );
  // }

  // return null;
}
