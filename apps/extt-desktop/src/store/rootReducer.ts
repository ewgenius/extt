import { combineReducers } from "@reduxjs/toolkit";
import { appRedcuer } from "#/store/app/appReducer";

export const rootReducer = combineReducers({
  app: appRedcuer,
});

export type RootState = ReturnType<typeof rootReducer>;
