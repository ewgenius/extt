import { Descendant } from "slate";
import { SlateEditor } from "#/components/SlateEditor";
import { Scroller } from "#/components/Scroller";

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

export function App() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-row">
      <div className="h-full relative flex flex-col flex-grow">
        <div className="h-full flex flex-col flex-grow">
          <Scroller>
            <SlateEditor value={value} onSave={(e) => {}} />
          </Scroller>
        </div>
      </div>
    </div>
  );
}
