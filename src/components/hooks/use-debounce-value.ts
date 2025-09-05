/**
 * @file useDebounceValue — debounces a changing value (e.g., search query).
 */
import * as React from "react";

export function useDebounceValue<T>(value: T, delay = 300) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}
