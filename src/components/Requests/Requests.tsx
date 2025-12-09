import { useState, useMemo, useCallback, Fragment } from "react";
import { Button } from "design-react-kit";
import { format } from "date-fns";
import isEqual from "lodash/isEqual";
import { keepPreviousData } from "@tanstack/react-query";
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import {
  AgreementApiGetAgreementsRequest,
  AgreementState,
  GetAgreementsAssigneeEnum,
  GetAgreementsSortColumnEnum
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import { useDebouncedValue } from "../../utils/useDebounce";
import { NormalizedBackofficeAgreement } from "../../api/dtoTypeFixes";
import { useSyncSorting } from "../../utils/useSyncSorting";
import { usePaginationHelpers } from "../../utils/usePaginationHelpers";
import { ExpanderCell } from "../ExpanderCell/ExpanderCell";
import RequestFilter from "./RequestsFilter";
import RequestStateBadge from "./RequestStateBadge";
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
    case "profile.fullName":
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
    remoteData.Backoffice.Agreement.getAgreements.useQuery(
      params,
      { placeholderData: keepPreviousData, refetchOnWindowFocus: false } // this fixes page reset when uploading a file since it defocuses the window
    );

  const data = useMemo(
    () => agreements?.items || [],
    [agreements]
  ) as Array<NormalizedBackofficeAgreement>;

  const columns: Array<ColumnDef<NormalizedBackofficeAgreement, unknown>> = [
    {
      id: "profile.fullName",
      accessorFn: row => row.profile?.fullName ?? null,
      header: "Operatore",
      cell: ({ getValue }) => getValue<string | null>() ?? "-"
    },
    {
      id: "requestDate",
      accessorFn: row => row.requestDate ?? null,
      header: "Data Richiesta",
      cell: ({ getValue }) => {
        const v = getValue<string | null>();
        return v ? format(new Date(v), "dd/MM/yyyy") : "-";
      }
    },
    {
      id: "state",
      accessorFn: row => row.state,
      header: "Stato",
      cell: ({ getValue }) => RequestStateBadge(getValue<AgreementState>())
    },
    {
      id: "assignee.fullName",
      accessorFn: row =>
        row.state === AgreementState.AssignedAgreement
          ? (row.assignee?.fullName ?? null)
          : null,
      header: "Revisore",
      cell: ({ getValue }) => getValue<string | null>() ?? "-"
    },
    {
      id: "expander",
      header: () => null,
      enableSorting: false,
      size: 48,
      cell: ({ row }) => <ExpanderCell row={row} />
    }
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

  const pageCount = agreements?.total
    ? Math.ceil(agreements?.total / pageSize)
    : 0;

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
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

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
    <section className="mt-2 px-8 py-10 bg-white">
      <RequestFilter
        values={values}
        onChange={setValues}
        onReset={() => {
          setValues(requestFilterFormInitialValues);
        }}
        hasActiveFitlers={hasActiveFitlers}
      />
      {isPending ? (
        <CenteredLoading />
      ) : (
        <>
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
          />
          <div className="overflow-auto">
            <table style={{ width: "100%" }} className="mt-2 bg-white">
              <TableHeader headerGroups={table.getHeaderGroups()} />
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <Fragment key={row.id}>
                    <tr
                      className="cursor-pointer"
                      onClick={() => row.toggleExpanded()}
                    >
                      {row.getVisibleCells().map((cell, i) => (
                        <td
                          key={cell.id}
                          className={`
                ${i === 0 ? "ps-6" : ""}
                ${
                  i === table.getHeaderGroups()[0].headers.length - 1
                    ? "pe-6"
                    : ""
                }
                px-3 py-2 border-bottom text-sm
              `}
                          style={
                            cell.column.id === "expander"
                              ? { width: "calc(32px + 0.75rem * 2)" }
                              : {}
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>

                    {row.getIsExpanded() && (
                      <tr className="px-8 py-4 border-bottom text-sm fw-normal text-black">
                        <td colSpan={table.getVisibleLeafColumns().length}>
                          {renderRowSubComponent({ row })}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {!agreements?.items.length &&
            (hasActiveFitlers ? (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessun risultato corrisponde alla tua ricerca</p>
                <Button
                  color="primary"
                  outline
                  tag="button"
                  className="mt-3"
                  onClick={() => {
                    setValues(requestFilterFormInitialValues);
                  }}
                >
                  Reimposta Tutto
                </Button>
              </div>
            ) : (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessuna richiesta da elaborare</p>
              </div>
            ))}
        </>
      )}
    </section>
  );
};

export default Requests;
