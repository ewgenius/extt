import { fs } from "@tauri-apps/api";
import { call, fork, put, takeLatest } from "typed-redux-saga/macro";
import { Entry, setPath, setEntries } from "./workingFolderReducer";

export async function loadPath(path: string) {
  const tree = await fs.readDir(path, {
    recursive: true,
  });

  const root: Entry = {
    path,
    name: "/",
    children: [],
    expanded: true,
  };

  const entries: Record<string, Entry> = {};

  function parse(fileEntry: fs.FileEntry, e: Record<string, Entry>) {
    const parsed = fileEntry.path.split("/");
    const entry: Entry = {
      path: fileEntry.path,
      name: parsed[parsed.length - 1],
      expanded: true,
    };

    if (fileEntry.children && fileEntry.children.length) {
      entry.children = [];
      fileEntry.children.forEach((child) => {
        if (child.children || child.path.endsWith(".md")) {
          entry.children?.push(child.path);
          parse(child, e);
        }
      });
    }

    e[entry.path] = entry;
  }

  tree.forEach((fileEntry) => {
    if (fileEntry.children || fileEntry.path.endsWith(".md")) {
      root.children?.push(fileEntry.path);
      parse(fileEntry, entries);
    }
  });

  return { root, entries };
}

export function* setPathSaga({ payload }: ReturnType<typeof setPath>) {
  if (payload) {
    const result = yield* call(loadPath, payload);

    yield* put(setEntries(result));
  }
}

export function* workingFolderSagaWorker() {
  yield* takeLatest(setPath, setPathSaga);
}

export function* workingFolderSaga() {
  yield* fork(workingFolderSagaWorker);
}
