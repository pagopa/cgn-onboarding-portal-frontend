import { useMemo, useState, useCallback } from "react";
import { format } from "date-fns";
import isEqual from "lodash/isEqual";
import {
  createColumnHelper,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { remoteData } from "../../api/common";
import TableFooter from "../Table/TableFooter";
import {
  AgreementApiGetApprovedAgreementsRequest,
  ApprovedAgreement,
  GetApprovedAgreementsSortColumnEnum
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import TableBody from "../Table/TableBody";
import { DiscountState } from "../../api/generated";
import { getEntityTypeLabel } from "../../utils/strings";
import { useDebouncedValue } from "../../utils/useDebounce";
import { useSyncSorting } from "../../utils/useSyncSorting";
import { usePaginationHelpers } from "../../utils/usePaginationHelpers";
import { BadgePill } from "../BadgePill";
import { agreementBadgePill, discountBadgePill } from "../../utils/badges";
import ConventionFilter from "./ConventionFilter";
import ConventionDetails from "./ConventionDetails";

export type ConventionFilterFormValues = {
  fullName: string | undefined;
  lastUpdateDateFrom: Date | undefined;
  lastUpdateDateTo: Date | undefined;
  sortColumn: GetApprovedAgreementsSortColumnEnum | undefined;
  sortDirection: "ASC" | "DESC" | undefined;
};

const conventionFilterFormInitialValues: ConventionFilterFormValues = {
  fullName: undefined,
  lastUpdateDateFrom: undefined,
  lastUpdateDateTo: undefined,
  sortColumn: undefined,
  sortDirection: undefined
};

const getConventionSortColumn = (id: string) => {
  switch (id) {
    case "fullName":
      return "Operator";
    case "agreementStartDate":
      return "AgreementDate";
    case "agreementLastUpdateDate":
      return "LastModifyDate";
    case "publishedDiscounts":
      return "PublishedDiscounts";
  }
};

const OperatorConvention = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<
    ApprovedAgreement | undefined
  >();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20
  });

  const [values, setValues] = useState<ConventionFilterFormValues>(
    conventionFilterFormInitialValues
  );

  const hasActiveFitlers = !isEqual(values, conventionFilterFormInitialValues);

  const fullNameDebounced = useDebouncedValue({
    value: values.fullName,
    delay: 500,
    leading: false,
    trailing: true,
    maxWait: 3000
  });

  const params = useMemo(
    (): AgreementApiGetApprovedAgreementsRequest => ({
      profileFullName: fullNameDebounced,
      lastUpdateDateFrom: values.lastUpdateDateFrom
        ? format(values.lastUpdateDateFrom, "yyyy-MM-dd")
        : undefined,
      lastUpdateDateTo: values.lastUpdateDateTo
        ? format(values.lastUpdateDateTo, "yyyy-MM-dd")
        : undefined,
      sortColumn: values.sortColumn,
      sortDirection: values.sortDirection,
      pageSize: pagination.pageSize,
      page: pagination.pageIndex
    }),
    [
      fullNameDebounced,
      pagination.pageIndex,
      pagination.pageSize,
      values.lastUpdateDateFrom,
      values.lastUpdateDateTo,
      values.sortColumn,
      values.sortDirection
    ]
  );

  const {
    data: conventions,
    isPending,
    refetch
  } = remoteData.Backoffice.Agreement.getApprovedAgreements.useQuery(params);

  const data = useMemo(() => conventions?.items || [], [conventions]);
  const columnHelper = createColumnHelper<ApprovedAgreement>();

  const columns = [
    columnHelper.accessor("fullName", {
      header: "Operatore",
      cell: ({ getValue, row }) =>
        getValue()
          ? `[${getEntityTypeLabel(row.original.entityType)}] ${getValue()}`
          : "-"
    }),
    columnHelper.accessor("agreementStartDate", {
      header: "Convenzionato il",
      cell: ({ getValue }) => {
        const v = getValue();
        return v ? format(new Date(v), "dd/MM/yyyy") : "-";
      }
    }),
    columnHelper.accessor("agreementLastUpdateDate", {
      header: "Ultima modifica",
      cell: ({ getValue }) => {
        const v = getValue();
        return v ? format(new Date(v), "dd/MM/yyyy") : "-";
      }
    }),
    columnHelper.accessor("publishedDiscounts", {
      header: "Opportunità"
    }),
    columnHelper.accessor("testPending", {
      header: "TEST",
      enableSorting: false,
      cell: ({ getValue }) =>
        getValue() ? (
          <BadgePill {...discountBadgePill[DiscountState.TestPending]} />
        ) : null
    }),
    columnHelper.accessor("state", {
      header: "Stato",
      enableSorting: false,
      cell: ({ getValue }) => <BadgePill {...agreementBadgePill[getValue()]} />
    })
  ];

  const pageCount = Math.ceil((conventions?.total ?? 0) / pagination.pageSize);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      expanded
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    manualPagination: true,
    manualSorting: true,
    sortDescFirst: false,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const handleFilterChange = useCallback(
    (
      update:
        | ConventionFilterFormValues
        | ((prev: ConventionFilterFormValues) => ConventionFilterFormValues)
    ) => {
      setValues(update);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  useSyncSorting(sorting, setValues, getConventionSortColumn);
  const { canPreviousPage, canNextPage, previousPage, nextPage, gotoPage } =
    usePaginationHelpers(table);

  const handleCloseDetails = useCallback(() => {
    setShowDetails(false);
    setSelectedConvention(undefined);
    setValues(conventionFilterFormInitialValues);
    void refetch();
  }, [refetch]);

  if (showDetails && selectedConvention) {
    return (
      <ConventionDetails
        agreement={selectedConvention}
        onClose={handleCloseDetails}
      />
    );
  }

  const startRowIndex: number = pagination.pageIndex * pagination.pageSize + 1;
  // eslint-disable-next-line functional/no-let
  let endRowIndex: number = startRowIndex - 1 + pagination.pageSize;

  if (endRowIndex > (conventions?.total || 0)) {
    endRowIndex = conventions?.total || 0;
  }

  const pageArray = Array.from(Array(pageCount).keys());

  return (
    <section className="px-8 py-10 bg-white">
      <ConventionFilter
        values={values}
        onChange={handleFilterChange}
        hasActiveFitlers={hasActiveFitlers}
        onReset={() => {
          handleFilterChange(conventionFilterFormInitialValues);
          setSorting([]);
        }}
      />
      <Pager
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        startRowIndex={startRowIndex}
        endRowIndex={endRowIndex}
        pageIndex={pagination.pageIndex}
        onPreviousPage={previousPage}
        onNextPage={nextPage}
        onGotoPage={gotoPage}
        pageArray={pageArray}
        total={conventions?.total}
        isPending={isPending}
      />
      <div className="overflow-auto">
        <table style={{ width: "100%" }} className="mt-2 bg-white">
          <TableHeader headerGroups={table.getHeaderGroups()} />

          <TableBody
            table={table}
            onRowClick={row => {
              setShowDetails(true);
              setSelectedConvention(row.original);
            }}
          />
        </table>
      </div>
      <TableFooter
        isPending={isPending}
        isEmpty={!conventions?.items.length}
        hasActiveFilters={hasActiveFitlers}
        emptyMessage="Nessuna convenzione trovata"
        onReset={() => handleFilterChange(conventionFilterFormInitialValues)}
      />
    </section>
  );
};

export default OperatorConvention;
