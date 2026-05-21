import { useState, useMemo, useCallback, Fragment } from "react";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";
import isEqual from "lodash/isEqual";
import { keepPreviousData } from "@tanstack/react-query";
import {
  createColumnHelper,
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

  const columnHelper = createColumnHelper<NormalizedBackofficeAgreement>();

  const columns = [
    columnHelper.accessor(row => row.profile?.fullName ?? null, {
      id: "profile.fullName",
      header: "Operatore",
      cell: ({ getValue }) => getValue() ?? "-"
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
      cell: ({ getValue }) => RequestStateBadge(getValue())
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
    <Box
      component="section"
      sx={{ mt: 1, px: 4, py: 5, backgroundColor: "white" }}
    >
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
          <div>
            <table style={{ width: "100%" }}>
              <TableHeader headerGroups={table.getHeaderGroups()} />
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <Fragment key={row.id}>
                    <tr onClick={() => row.toggleExpanded()}>
                      {row.getVisibleCells().map((cell, i) => (
                        <td
                          key={cell.id}
                          style={{
                            width:
                              cell.column.id === "expander"
                                ? "calc(32px + 0.75rem * 2)"
                                : undefined,
                            paddingTop: "0.5rem",
                            paddingBottom: "0.5rem",
                            paddingLeft: i === 0 ? "1.5rem" : "0.75rem",
                            paddingRight:
                              i ===
                              table.getHeaderGroups()[0].headers.length - 1
                                ? "1.5rem"
                                : "0.75rem",
                            borderBottom: "1px solid #D9E0E6",
                            fontSize: "0.875rem"
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>

                    {row.getIsExpanded() && (
                      <tr>
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
              <div>
                <p>Nessun risultato corrisponde alla tua ricerca</p>
                <Button
                  color="primary"
                  variant="outlined"
                  type="button"
                  onClick={() => {
                    setValues(requestFilterFormInitialValues);
                  }}
                >
                  Reimposta Tutto
                </Button>
              </div>
            ) : (
              <div>
                <p>Nessuna richiesta da elaborare</p>
              </div>
            ))}
        </>
      )}
    </Box>
  );
};

export default Requests;
