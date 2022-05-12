import { useEffect, useState } from "react";
import { fs } from "@tauri-apps/api";
import { Descendant } from "slate";
import { useAppContext } from "#/AppContext";
import { useDebouncedCallback } from "#/utils/useDebouncedCallback";
import { SlateEditor } from "#/components/SlateEditor";
import { serialize } from "#/lib/serialize";
import { deserialize } from "#/lib/deserialize";

const initialValue: Descendant[] = [];

export function Editor() {
  const { selectedEntry } = useAppContext();
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
      <div className="h-full flex flex-col flex-grow">
        <SlateEditor key={selectedEntry.path} value={value} onSave={save} />
      </div>
    );
  }

  return null;
}
