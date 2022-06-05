import { all } from "typed-redux-saga/macro";
import { workingFolderSaga } from "./workingFolder/workingFolderSaga";

export function* rootSaga() {
  yield* all([workingFolderSaga()]);
}
