export function load<T>({
  key,
  validate,
  empty
}: {
  key: string;
  validate(value: unknown): T;
  empty: T;
}): T {
  const value = localStorage.getItem(key);
  if (!value) {
    return empty;
  }
  try {
    const parsedValue = JSON.parse(value);
    return validate(parsedValue);
  } catch (error) {
    return empty;
  }
}

export function save<T>({ key, value }: { key: string; value: T }) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
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
  window.addEventListener("storage", event => {
    if (event.key === key) {
      const newValue = event.newValue;
      if (newValue) {
        try {
          const parsedValue = JSON.parse(newValue);
          listener(validate(parsedValue));
        } catch (error) {
          return;
        }
      }
    }
  });
}
