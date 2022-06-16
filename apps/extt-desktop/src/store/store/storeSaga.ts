import { store } from "#/lib/store";
import { fork, call, put, takeLatest } from "typed-redux-saga/macro";
import { setPath } from "../workingFolder/workingFolderReducer";

export async function get(key: string) {
  const value = await store.get(key);
  return value;
}

export async function set(key: string, value: unknown) {
  await store.set(key, value);
}

export function* setPathSaga({ payload }: ReturnType<typeof setPath>) {
  yield* call(set, "extt.path", payload);
}

export function* storeSagaWorker() {
  const path = yield* call(get, "extt.path");
  if (path) {
    yield* put(setPath(path as string));
  }

  yield* takeLatest(setPath, setPathSaga);
}

export function* storeSaga() {
  yield* fork(storeSagaWorker);
}
