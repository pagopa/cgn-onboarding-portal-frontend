import {
  AuthenticationState,
  authenticationStateSchema,
  empty
} from "./authenticationState";
import { Store } from "./authenticationStore";

function load<T>({
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
    // eslint-disable-next-line no-console
    console.error(`Failed to load ${key} from localStorage`, error);
    return empty;
  }
}

function save<T>({ key, value }: { key: string; value: T }) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to save ${key} to localStorage`, error);
  }
}

function watch<T>({
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
          // eslint-disable-next-line no-console
          console.error("Failed to parse new value from localStorage", error);
        }
      }
    }
  });
}

const LOCAL_STORAGE_KEY = "oneidentity";

export const localStorageInitialState = load({
  key: LOCAL_STORAGE_KEY,
  validate: authenticationStateSchema.parse,
  empty
});

export function localStorageSetup(store: Store<AuthenticationState>) {
  store.subscribe(() => {
    save({ key: LOCAL_STORAGE_KEY, value: store.get() });
  });
  watch({
    key: LOCAL_STORAGE_KEY,
    validate: authenticationStateSchema.parse,
    listener: store.set
  });
}
