import { all } from "typed-redux-saga/macro";
import { storeSaga } from "./store/storeSaga";
import { workingFolderSaga } from "./workingFolder/workingFolderSaga";

export function* rootSaga() {
  yield* all([workingFolderSaga(), storeSaga()]);
}
