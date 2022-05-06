import { createContext, useContext } from "react";

export interface StoreContextState {
  set(key: string, value: unknown): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  has(key: string): Promise<boolean>;
  // delete(key: string): Promise<boolean>;
}

export const StoreContext = createContext<StoreContextState>({
  set: (k, v) => Promise.resolve(),
  get: (k) => Promise.resolve(null),
  has: (k) => Promise.resolve(false),
  // delete: (k) => Promise.resolve(false),
});

export const useStore = () => useContext(StoreContext);
