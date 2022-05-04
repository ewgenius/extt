import React, { useCallback, useEffect, useState } from "react";
import { fs } from "@tauri-apps/api";
import { useAppContext } from "../AppContext";

function useDebouncedCallback<T extends Function>(
  callback: T,
  time: number,
  deps: React.DependencyList
): T {
  let timeout: number;

  return useCallback((...args: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => callback(...args), time);
  }, deps) as any as T;
}

export function Editor() {
  const { selectedEntry } = useAppContext();
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
