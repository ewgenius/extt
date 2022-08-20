import create from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getStorage } from "#/lib/storage";

export interface State {
  sidebarOpen: boolean;
}

export const options: PersistOptions<State, State> = {
  name: "extt-store",
  getStorage,
  partialize: (s) => s,
};

export const useStore = create<State>()(
  persist(
    immer((set) => ({
      sidebarOpen: false,
    })),
    options
  )
);
