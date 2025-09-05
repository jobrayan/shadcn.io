/**
 * @file useBoolean — tiny boolean state helper with stable togglers.
 */
import * as React from "react";

export function useBoolean(initial = false) {
  const [on, set] = React.useState<boolean>(initial);
  const setTrue = React.useCallback(() => set(true), []);
  const setFalse = React.useCallback(() => set(false), []);
  const toggle = React.useCallback(() => set((x) => !x), []);
  return { value: on, setTrue, setFalse, toggle, set };
}
