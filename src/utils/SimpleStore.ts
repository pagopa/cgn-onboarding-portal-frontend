type Store<Value> = {
  get(): Value;
  set(value: Value): void;
  subscribe(callback: () => void): () => void;
};

export function makeStore<Value>(initial: Value): Store<Value> {
  // eslint-disable-next-line functional/no-let
  let value: Value = initial;
  const listeners = new Set<() => void>();
  return {
    get() {
      return value;
    },
    set(newValue: Value) {
      value = newValue;
      listeners.forEach(listener => listener());
    },
    subscribe(callback: () => void) {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    }
  };
}
