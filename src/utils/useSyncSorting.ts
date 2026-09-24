import { SortingState } from "@tanstack/react-table";
import { isUndefined } from "lodash";
import { useEffect } from "react";

export function useSyncSorting<T>(
  sorting: SortingState,
  setValues: (fn: (prev: T) => T) => void,
  mapColumnFn: (id: string) => string | undefined
) {
  useEffect(() => {
    const sortField = sorting[0];
    if (isUndefined(sortField)) {
      setValues(values => ({
        ...values,
        sortColumn: undefined,
        sortDirection: undefined
      }));
      return;
    }
    setValues(values => ({
      ...values,
      sortColumn: mapColumnFn(sortField.id),
      sortDirection: sortField.desc ? "DESC" : "ASC"
    }));
  }, [sorting, setValues, mapColumnFn]);
}
