import isEqual from "lodash/isEqual";
import { useRef } from "react";

/** Returns the value as it is, but retains old object instance if it is structurally the same */
export function useStableValue<T>(
  value: T,
  compare: <V>(a: V, b: V) => boolean = isEqual
): T {
  const ref = useRef(value);
  if (!compare(ref.current, value)) {
    // eslint-disable-next-line functional/immutable-data
    ref.current = value;
  }
  return ref.current;
}
