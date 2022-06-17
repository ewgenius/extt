import { useEffect, useState } from "react";
import { fs } from "@tauri-apps/api";
import { Descendant } from "slate";
import { useDebouncedCallback } from "#/utils/useDebouncedCallback";
import { SlateEditor } from "#/components/SlateEditor";
import { serialize } from "#/lib/serialize";
import { deserialize } from "#/lib/deserialize";
import { useWorkingFolder } from "#/store/workingFolder";

const initialValue: Descendant[] = [];

export function Editor() {
  const selectedEntry = useWorkingFolder((s) =>
    s.selected ? s.entries[s.selected] : null
  );
  const [value, setValue] = useState<Descendant[]>(initialValue);
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
        // console.log(serialize(value));
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
      <div className="flex h-full flex-grow flex-col">
        <SlateEditor key={selectedEntry.path} value={value} onSave={save} />
      </div>
    );
  }

  return null;
}
