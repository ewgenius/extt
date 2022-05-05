import { useState } from "react";
import { Descendant } from "slate";
import { SlateEditor } from "../components/SlateEditor";

const value: Descendant[] = [
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

export function App() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-row">
      <div className="relative flex flex-col flex-grow">
        <div className="flex flex-col flex-grow overflow-y-auto">
          <SlateEditor value={value} onSave={(e) => {}} />
        </div>
      </div>
    </div>
  );
}
