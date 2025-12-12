import { useState, useMemo, Fragment } from "react";
import { Badge, Button } from "design-react-kit";
import { format } from "date-fns";
import isEqual from "lodash/isEqual";
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
  AttributeauthorityApiGetOrganizationsRequest,
  OrganizationWithReferentsAndStatus
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import {
  getEntityTypeLabel,
  makeOrganizationStatusReadable
} from "../../utils/strings";
import { useDebouncedValue } from "../../utils/useDebounce";
import { usePaginationHelpers } from "../../utils/usePaginationHelpers";
import { useSyncSorting } from "../../utils/useSyncSorting";
import { ExpanderCell } from "../ExpanderCell/ExpanderCell";
import ActivationsFilter from "./ActivationsFilter";
import OperatorActivationDetail from "./OperatorActivationDetail";

type OrderType = "fiscalCode" | "name" | "pec" | "insertedAt";

export type ActivationsFilterFormValues = {
  searchQuery: string | undefined;
  sortColumn: OrderType | undefined;
  sortDirection: "ASC" | "DESC" | undefined;
};

const activationsFilterFormInitialValues: ActivationsFilterFormValues = {
  searchQuery: undefined,
  sortColumn: undefined,
  sortDirection: undefined
};

const getActivationsSortColumn = (id: string): OrderType => {
  switch (id) {
    case "organizationFiscalCode":
      return "fiscalCode";
    case "insertedAt":
      return "insertedAt";
    case "organizationName":
    default:
      return "name";
  }
};

const OperatorActivations = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20
  });
  const [values, setValues] = useState<ActivationsFilterFormValues>(
    activationsFilterFormInitialValues
  );

  const hasActiveFitlers = !isEqual(values, activationsFilterFormInitialValues);

  const searchQueryDebounced = useDebouncedValue({
    value: values.searchQuery,
    delay: 500,
    leading: false,
    trailing: true,
    maxWait: 3000
  });

  const params = useMemo(
    (): AttributeauthorityApiGetOrganizationsRequest => ({
      searchQuery: searchQueryDebounced,
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sortBy: values.sortColumn,
      sortDirection: values.sortDirection
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      searchQueryDebounced,
      values.sortColumn,
      values.sortDirection
    ]
  );

  const {
    data: operators,
    isPending,
    refetch
  } = remoteData.Backoffice.AttributeAuthority.getOrganizations.useQuery(
    params
  );

  const columnHelper = createColumnHelper<OrganizationWithReferentsAndStatus>();

  const columns = [
    columnHelper.accessor("organizationName", {
      header: "RAGIONE SOCIALE"
    }),
    columnHelper.display({
      id: "entityType",
      header: "TIPOLOGIA ENTE",
      enableSorting: false,
      cell: ({ row }) => getEntityTypeLabel(row.original.entityType)
    }),
    columnHelper.accessor("referents", {
      header: "UTENTI ABILITATI",
      enableSorting: false,
      cell: ({ getValue }) => {
        const list = getValue() ?? [];
        if (list.length === 0) {
          return <span>-</span>;
        }
        const shown = list.slice(0, 2);
        const extra = list.length - shown.length;
        return (
          <span>
            {shown.join(", ")}
            {extra > 0 ? ` +${extra}` : ""}
          </span>
        );
      }
    }),
    columnHelper.accessor("insertedAt", {
      header: "AGGIUNTO IL",
      cell: ({ getValue }) => {
        const v = getValue();
        return <span>{v ? format(new Date(v), "dd/MM/yyyy") : "-"}</span>;
      }
    }),
    columnHelper.accessor("status", {
      header: "STATO",
      enableSorting: false,
      cell: ({ getValue }) => (
        <Badge
          className="fw-semibold border border-primary text-bg-light text-primary"
          pill
          tag="span"
          color="white"
        >
          {makeOrganizationStatusReadable(getValue())}
        </Badge>
      )
    }),

    columnHelper.display({
      id: "expander",
      header: () => null,
      enableSorting: false,
      size: 48,
      cell: ({ row }) => <ExpanderCell row={row} />
    })
  ];

  const data: Array<OrganizationWithReferentsAndStatus> = useMemo(
    () => (operators?.items ? [...operators.items] : []),
    [operators]
  );

  const pageCount = Math.ceil((operators?.count ?? 0) / pagination.pageSize);

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

  useSyncSorting(sorting, setValues, getActivationsSortColumn);
  const { canPreviousPage, canNextPage, previousPage, nextPage, gotoPage } =
    usePaginationHelpers(table);

  const startRowIndex: number = pagination.pageIndex * pagination.pageSize + 1;
  // eslint-disable-next-line functional/no-let
  let endRowIndex: number = startRowIndex - 1 + pagination.pageSize;

  if (operators?.count && endRowIndex > operators?.count) {
    endRowIndex = operators.count;
  }

  const pageArray = Array.from(Array(pageCount).keys());

  return (
    <section className="mt-2 px-8 py-10 bg-white">
      <ActivationsFilter
        values={values}
        onChange={setValues}
        hasActiveFitlers={hasActiveFitlers}
        onReset={() => {
          setValues(activationsFilterFormInitialValues);
        }}
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
            total={operators?.count}
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
                      {row.getVisibleCells().map((cell, i, arr) => (
                        <td
                          key={cell.id}
                          className={`${i === 0 ? "ps-6" : ""} ${
                            i === arr.length - 1 ? "pe-6" : ""
                          } px-3 py-2 border-bottom text-sm`}
                          style={
                            cell.column.id === "expander"
                              ? { width: "calc(32px + 0.75rem * 2)" }
                              : undefined
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
                          <OperatorActivationDetail
                            operator={row.original}
                            getActivations={() => refetch()}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {!operators?.items?.length &&
            (hasActiveFitlers ? (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessun risultato corrisponde alla tua ricerca</p>
                <Button
                  color="primary"
                  outline
                  tag="button"
                  className="mt-3"
                  onClick={() => {
                    setValues(activationsFilterFormInitialValues);
                  }}
                >
                  Reimposta Tutto
                </Button>
              </div>
            ) : (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessun operatore trovato</p>
              </div>
            ))}
        </>
      )}
    </section>
  );
};

export default OperatorActivations;
