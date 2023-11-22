import React from "react";
/**
 * this is a simplified version of use query hook used in "swr" or "@tanstack/react-query"
 */
export function useSimpleQuery<Data>(
  cacheKey: CacheKeyShape,
  fetcher: () => Promise<Data>
) {
  const [state, setState] = React.useState<{ data: Data | undefined }>({
    data: undefined
  });
  React.useEffect(() => {
    setState({ data: undefined });
    // eslint-disable-next-line functional/no-let
    let isActive = true;
    void fetcher().then(data => {
      if (isActive) {
        setState({ data });
      }
    });
    return () => {
      isActive = false;
    };
  }, [stableStringify(cacheKey)]);

  return state;
}

type CacheKeyShape =
  | boolean
  | number
  | string
  | null
  | undefined
  | Array<CacheKeyShape>
  | { [key: string]: CacheKeyShape };

function stableStringify(value: unknown) {
  return JSON.stringify(value, (key, value) => {
    if (typeof value === "object" && value !== null) {
      // eslint-disable-next-line functional/immutable-data
      const keys = Object.keys(value).sort();
      const obj: Record<string, unknown> = {};
      for (const key of keys) {
        // eslint-disable-next-line functional/immutable-data
        obj[key] = value[key];
      }
      return obj;
    }
    return value;
  });
}
