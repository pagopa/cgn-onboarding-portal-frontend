export function load<T>({
  key,
  validate,
  empty
}: {
  key: string;
  validate(value: unknown): T;
  empty: T;
}): T {
  if (typeof localStorage === "undefined") {
    return empty;
  }
  const value = localStorage.getItem(key);
  if (!value) {
    return empty;
  }
  try {
    const parsedValue = JSON.parse(value);
    return validate(parsedValue);
  } catch {
    return empty;
  }
}

export function save<T>({ key, value }: { key: string; value: T }) {
  if (typeof localStorage === "undefined") {
    return;
  }
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch {
    return;
  }
}

export function watch<T>({
  key,
  validate,
  listener
}: {
  key: string;
  validate(value: unknown): T;
  listener(value: T): void;
}) {
  if (typeof localStorage === "undefined") {
    return;
  }
  window.addEventListener("storage", event => {
    if (event.key === key) {
      const newValue = event.newValue;
      if (newValue) {
        try {
          const parsedValue = JSON.parse(newValue);
          listener(validate(parsedValue));
        } catch {
          return;
        }
      }
    }
  });
}
