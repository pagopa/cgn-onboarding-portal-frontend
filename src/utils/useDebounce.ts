import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

export function useDebouncedValue<Value>({
  value,
  delay,
  maxWait,
  leading,
  trailing
}: {
  value: Value;
  delay: number;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const debouncedSetter = useMemo(
    () => debounce(setDebouncedValue, delay, { leading, trailing, maxWait }),
    [delay, leading, maxWait, trailing]
  );
  useEffect(() => {
    debouncedSetter(value);
  }, [debouncedSetter, value]);
  return debouncedValue;
}
