import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Prism from "prismjs";
import { fs } from "@tauri-apps/api";
import { createEditor, Text, BaseEditor, Descendant } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { useAppContext } from "../AppContext";
import { useDebouncedCallback } from "../utils/useDebouncedCallback";
import { Node } from "slate";
import { classNames } from "../utils/classNames";

// eslint-disable-next-line
Prism.languages.markdown=Prism.languages.extend("markup",{}),Prism.languages.insertBefore("markdown","prolog",{blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},code:[{pattern:/^(?: {4}|\t).+/m,alias:"keyword"},{pattern:/``.+?``|`[^`\n]+`/,alias:"keyword"}],title:[{pattern:/\w+.*(?:\r?\n|\r)(?:==+|--+)/,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#+.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore

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
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  // @ts-ignore
  const decorate = useCallback(([node, path]) => {
    // @ts-ignore
    const ranges = [];

    // @ts-ignore
    if (!Text.isText(node)) {
      // @ts-ignore
      return ranges;
    }

    // @ts-ignore
    const getLength = (token) => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        // @ts-ignore
        return token.content.reduce((l, t) => l + getLength(t), 0);
      }
    };

    // @ts-ignore
    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

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
        className="container mx-auto max-w-2xl flex-grow p-8"
        decorate={decorate}
        renderLeaf={renderLeaf}
      />
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

interface LeafProps {
  attributes: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >;
  leaf: {
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    title?: boolean;
    list?: boolean;
    hr?: boolean;
    blockquote?: boolean;
    code?: boolean;
  };
}

const Leaf: FC<PropsWithChildren<LeafProps>> = ({
  attributes,
  children,
  leaf,
}) => {
  return (
    <span
      {...attributes}
      className={
        classNames(
          leaf.bold && "font-bold",
          leaf.italic && "italic",
          leaf.underlined && "underline",
          leaf.title && "text-lg font-bold"
        )
        // css`
        // font-weight: ${leaf.bold && 'bold'};
        // font-style: ${leaf.italic && 'italic'};
        // text-decoration: ${leaf.underlined && 'underline'};
        // ${leaf.title &&
        //   css`
        //     display: inline-block;
        //     font-weight: bold;
        //     font-size: 20px;
        //     margin: 20px 0 10px 0;
        //   `}
        // ${leaf.list &&
        //   css`
        //     padding-left: 10px;
        //     font-size: 20px;
        //     line-height: 10px;
        //   `}
        // ${leaf.hr &&
        //   css`
        //     display: block;
        //     text-align: center;
        //     border-bottom: 2px solid #ddd;
        //   `}
        // ${leaf.blockquote &&
        //   css`
        //     display: inline-block;
        //     border-left: 2px solid #ddd;
        //     padding-left: 10px;
        //     color: #aaa;
        //     font-style: italic;
        //   `}
        // ${leaf.code &&
        //   css`
        //     font-family: monospace;
        //     background-color: #eee;
        //     padding: 3px;
        //   `}
      }
    >
      {children}
    </span>
  );
};

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
