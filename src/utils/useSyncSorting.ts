import { SortingState } from "@tanstack/react-table";
import { useEffect } from "react";

export function useSyncSorting<T>(
  sorting: SortingState,
  setValues: (fn: (prev: T) => T) => void,
  mapColumnFn: (id: string) => string | undefined
) {
  useEffect(() => {
    const sortField = sorting[0] || {};
    const sortFieldDesc = sortField.desc ? "DESC" : "ASC";
    setValues(values => ({
      ...values,
      sortColumn: sortField ? mapColumnFn(sortField.id) : undefined,
      sortDirection: sortField ? sortFieldDesc : undefined
    }));
  }, [sorting, setValues, mapColumnFn]);
}
