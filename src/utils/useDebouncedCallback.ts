import { useCallback } from "react";

export function useDebouncedCallback<T extends Function>(
  callback: T,
  time: number,
  deps: React.DependencyList
): T {
  let timeout: number;

  return useCallback((...args: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => callback(...args), time);
  }, deps) as any as T;
}
