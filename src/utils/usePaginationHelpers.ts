import { Dispatch, SetStateAction } from "react";
import { ExpandedState } from "@tanstack/react-table";

interface PaginationTable {
  getCanPreviousPage: () => boolean;
  getCanNextPage: () => boolean;
  previousPage: () => void;
  nextPage: () => void;
  setPageIndex: (page: number) => void;
}

export function usePaginationHelpers(table: PaginationTable) {
  return {
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
    previousPage: () => table.previousPage(),
    nextPage: () => table.nextPage(),
    gotoPage: (page: number) => table.setPageIndex(page)
  };
}

// wraps a state setter so any change (page, sort, filter) collapses expanded rows first —
// prevents stale row-index expansion carrying over onto different data after the change
export function withExpandedReset<T>(
  setExpanded: Dispatch<SetStateAction<ExpandedState>>,
  setState: Dispatch<SetStateAction<T>>
): Dispatch<SetStateAction<T>> {
  return updater => {
    setExpanded({});
    setState(updater);
  };
}
