import { Store } from "tauri-plugin-store-api";
import type { StateStorage } from "zustand/middleware";

export const store = new Store(".settings.dat");

export function getStorage(): StateStorage {
  return localStorage;
}
