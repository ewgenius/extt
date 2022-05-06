import { Dispatch, SetStateAction, useState } from "react";
import { useStore } from "#/StoreContext";
import { useAsyncEffect } from "#/hooks/useAsyncEffect";

export function useStoredState<S>(
  key: string,
  initialState: S,
  serialize: (value: S) => string = (value) => value as any as string,
  deserialize: (value: string) => S = (value) => value as any as S
): [S, Dispatch<SetStateAction<S>>] {
  const { set, get, remove } = useStore();
  const [state, setState] = useState<S>(initialState);

  useAsyncEffect(async () => {
    const stored = await get<string>(key);
    if (stored !== null) {
      setState(deserialize(stored));
    }
  }, [key]);

  const setStoredState: Dispatch<SetStateAction<S>> = (s) => {
    if (typeof s === "function") {
      setState((p) => {
        const newValue = (s as Function)(p);
        if (newValue === null) {
          remove(key);
        } else {
          set(key, serialize(newValue));
        }
        return newValue;
      });
    } else {
      if (s === null) {
        remove(key);
      } else {
        set(key, serialize(s));
      }
      setState(s);
    }
  };

  return [state, setStoredState];
}
