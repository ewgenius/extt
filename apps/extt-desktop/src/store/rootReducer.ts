import { combineReducers } from "@reduxjs/toolkit";
import { appRedcuer } from "#/store/app/appReducer";
import { workingFolderReducer } from "#/store/workingFolder/workingFolderReducer";

export const rootReducer = combineReducers({
  app: appRedcuer,
  workingFolder: workingFolderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
