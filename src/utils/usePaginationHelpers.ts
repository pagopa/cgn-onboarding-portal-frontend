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
