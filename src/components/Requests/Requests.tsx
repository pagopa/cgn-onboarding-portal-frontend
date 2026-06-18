import { useState, useMemo, useCallback } from "react";
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
  AgreementApiGetAgreementsRequest,
  AgreementState,
  GetAgreementsAssigneeEnum,
  GetAgreementsSortColumnEnum
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import TableBody from "../Table/TableBody";
import { getEntityTypeLabel } from "../../utils/strings";
import { useDebouncedValue } from "../../utils/useDebounce";
import { NormalizedBackofficeAgreement } from "../../api/dtoTypeFixes";
import { useSyncSorting } from "../../utils/useSyncSorting";
import { usePaginationHelpers } from "../../utils/usePaginationHelpers";
import { ExpanderCell } from "../ExpanderCell/ExpanderCell";
import { BadgePill } from "../BadgePill";
import { requestBadgePill } from "../../utils/badges";
import RequestFilter from "./RequestsFilter";
import RequestsDetails from "./RequestsDetails";

export type RequestsFilterFormValues = {
  profileFullName: string | undefined;
  requestDateFrom: Date | undefined;
  requestDateTo: Date | undefined;
  states: string | undefined;
  assignee: GetAgreementsAssigneeEnum | undefined;
  sortColumn: GetAgreementsSortColumnEnum | undefined;
  sortDirection: "ASC" | "DESC" | undefined;
};

const requestFilterFormInitialValues: RequestsFilterFormValues = {
  profileFullName: "",
  requestDateFrom: undefined,
  requestDateTo: undefined,
  states: undefined,
  assignee: undefined,
  sortColumn: undefined,
  sortDirection: undefined
};

const getRequetsSortColumn = (id: string) => {
  switch (id) {
    case "organizationName":
      return "Operator";
    case "requestDate":
      return "RequestDate";
    case "state":
      return "State";
    case "assignee.fullName":
      return "Assignee";
  }
};

const Requests = () => {
  const pageSize = 20;

  const [values, setValues] = useState<RequestsFilterFormValues>(
    requestFilterFormInitialValues
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20
  });

  const hasActiveFitlers = !isEqual(values, requestFilterFormInitialValues);

  const debouncedProfileFullName = useDebouncedValue({
    value: values.profileFullName,
    delay: 500,
    leading: false,
    trailing: true,
    maxWait: 3000
  });

  const params = useMemo((): AgreementApiGetAgreementsRequest => {
    const requestAssignedAgreements =
      values.states?.includes("AssignedAgreement");
    return {
      profileFullName: debouncedProfileFullName,
      requestDateFrom: values.requestDateFrom
        ? format(values.requestDateFrom, "yyyy-MM-dd")
        : undefined,
      requestDateTo: values.requestDateTo
        ? format(values.requestDateTo, "yyyy-MM-dd")
        : undefined,
      assignee: requestAssignedAgreements
        ? (values.states
            ?.split("AssignedAgreement")
            .at(-1) as GetAgreementsAssigneeEnum)
        : undefined,
      states: requestAssignedAgreements ? "AssignedAgreement" : values.states,
      sortColumn: values.sortColumn,
      sortDirection: values.sortDirection,
      page: pagination.pageIndex,
      pageSize
    };
  }, [
    values.states,
    values.requestDateFrom,
    values.requestDateTo,
    values.sortColumn,
    values.sortDirection,
    debouncedProfileFullName,
    pagination.pageIndex
  ]);

  const { data: agreements, isPending } =
    remoteData.Backoffice.Agreement.getAgreements.useQuery(params);

  const data = useMemo(
    () => agreements?.items || [],
    [agreements]
  ) as Array<NormalizedBackofficeAgreement>;

  const columnHelper = createColumnHelper<NormalizedBackofficeAgreement>();

  const columns = [
    columnHelper.accessor(row => row.organizationName, {
      id: "organizationName",
      header: "Operatore",
      cell: ({ getValue, row }) => {
        const name = getValue();
        if (!name) {
          return "-";
        }
        return `[${getEntityTypeLabel(row.original.entityType)}] ${name}`;
      }
    }),
    columnHelper.accessor(row => row.requestDate ?? null, {
      id: "requestDate",
      header: "Data Richiesta",
      cell: ({ getValue }) => {
        const v = getValue();
        return v ? format(new Date(v), "dd/MM/yyyy") : "-";
      }
    }),
    columnHelper.accessor(row => row.state, {
      id: "state",
      header: "Stato",
      cell: ({ getValue }) => <BadgePill {...requestBadgePill[getValue()]} />
    }),
    columnHelper.accessor(
      row =>
        row.state === AgreementState.AssignedAgreement
          ? (row.assignee?.fullName ?? null)
          : null,
      {
        id: "assignee.fullName",
        header: "Revisore",
        cell: ({ getValue }) => getValue() ?? "-"
      }
    ),
    columnHelper.display({
      id: "expander",
      header: () => null,
      enableSorting: false,
      size: 48,
      cell: ({ row }) => <ExpanderCell row={row} />
    })
  ];

  const renderRowSubComponent = useCallback(
    ({
      row: { original }
    }: {
      row: { original: NormalizedBackofficeAgreement };
    }) => (
      <RequestsDetails
        updateList={() => {
          remoteData.Backoffice.Agreement.getAgreements.invalidateQueries({});
        }}
        original={original}
      />
    ),
    []
  );

  const pageCount = Math.ceil((agreements?.total ?? 0) / pageSize);

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
        | RequestsFilterFormValues
        | ((prev: RequestsFilterFormValues) => RequestsFilterFormValues)
    ) => {
      setValues(update);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  useSyncSorting(sorting, setValues, getRequetsSortColumn);
  const { canPreviousPage, canNextPage, previousPage, nextPage, gotoPage } =
    usePaginationHelpers(table);

  const startRowIndex: number = pagination.pageIndex * pageSize + 1;
  // eslint-disable-next-line functional/no-let
  let endRowIndex: number = startRowIndex - 1 + pageSize;

  if (endRowIndex > (agreements?.total || 0)) {
    endRowIndex = agreements?.total || 0;
  }

  const pageArray = Array.from(Array(pageCount).keys());

  return (
    <section className="px-8 py-10 bg-white">
      <RequestFilter
        values={values}
        onChange={handleFilterChange}
        onReset={() => handleFilterChange(requestFilterFormInitialValues)}
        hasActiveFitlers={hasActiveFitlers}
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
        total={agreements?.total}
        isPending={isPending}
      />
      <div className="overflow-auto">
        <table style={{ width: "100%" }} className="bg-white">
          <TableHeader headerGroups={table.getHeaderGroups()} />
          <TableBody
            table={table}
            renderExpanded={row => renderRowSubComponent({ row })}
          />
        </table>
      </div>
      <TableFooter
        isPending={isPending}
        isEmpty={!agreements?.items.length}
        hasActiveFilters={hasActiveFitlers}
        emptyMessage="Nessuna richiesta da elaborare"
        onReset={() => setValues(requestFilterFormInitialValues)}
      />
    </section>
  );
};

export default Requests;
