import { useState, useEffect, useMemo, Fragment } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  Column,
  useExpanded
} from "react-table";
import { Badge, Button, Icon } from "design-react-kit";
import { format } from "date-fns";
import omit from "lodash/omit";
import isEqual from "lodash/isEqual";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import {
  AttributeauthorityApiGetOrganizationsRequest,
  OrganizationStatus,
  OrganizationWithReferentsAndStatus
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import {
  getEntityTypeLabel,
  makeOrganizationStatusReadable
} from "../../utils/strings";
import { useDebouncedValue } from "../../utils/useDebounce";
import { useStableValue } from "../../utils/useStableValue";
import ActivationsFilter from "./ActivationsFilter";
import OperatorActivationDetail from "./OperatorActivationDetail";

const PAGE_SIZE = 20;

type OrderType = "fiscalCode" | "name" | "pec" | "insertedAt";

export type ActivationsFilterFormValues = {
  searchQuery: string | undefined;
  sortColumn: OrderType | undefined;
  sortDirection: "ASC" | "DESC" | undefined;
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

const activationsFilterFormInitialValues: ActivationsFilterFormValues = {
  searchQuery: undefined,
  sortColumn: undefined,
  sortDirection: undefined
};

const OperatorActivations = () => {
  const [pageParam, setPageParam] = useState(0);

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
      page: pageParam,
      pageSize: PAGE_SIZE,
      sortBy: values.sortColumn,
      sortDirection: values.sortDirection
    }),
    [pageParam, searchQueryDebounced, values.sortColumn, values.sortDirection]
  );

  const {
    data: operators,
    isPending,
    refetch
  } = remoteData.Backoffice.AttributeAuthority.getOrganizations.useQuery(
    params
  );

  const columns = useMemo(
    (): Array<Column<OrganizationWithReferentsAndStatus>> => [
      {
        Header: "RAGIONE SOCIALE",
        accessor: "organizationName"
      },
      {
        Header: "TIPOLOGIA ENTE",
        Cell: ({ row }) => getEntityTypeLabel(row.original.entityType)
      },
      {
        Header: "UTENTI ABILITATI",
        disableSortBy: true,
        accessor: "referents",
        Cell: ({ row }) => {
          if (Array.isArray(row.values.referents)) {
            return (
              <span>
                {row.values.referents.reduce(
                  (acc: string, curr: string, i: number) => {
                    if (i > 1) {
                      return `${acc} +1`;
                    }
                    if (i > 2) {
                      return acc;
                    }
                    return `${curr}, ${acc}`;
                  },
                  ""
                )}
              </span>
            );
          }
          return <span>row.values.referents</span>;
        }
      },
      {
        Header: "AGGIUNTO IL",
        accessor: "insertedAt",
        Cell: ({ row }) => (
          <span>{format(new Date(row.values.insertedAt), "dd/MM/yyyy")}</span>
        )
      },
      {
        Header: "STATO",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ row }) => (
          <Badge
            className="fw-semibold border border-primary text-bg-light text-primary"
            pill
            tag="span"
            color="white"
          >
            {makeOrganizationStatusReadable(
              row.values.status as OrganizationStatus
            )}
          </Badge>
        )
      },
      {
        Header: () => null,
        id: "expander",
        Cell: ({ row }) => (
          <span {...omit(row.getToggleRowExpandedProps(), "onClick")}>
            {row.isExpanded ? (
              <Icon icon="it-expand" color="primary" />
            ) : (
              <Icon icon="it-collapse" color="primary" />
            )}
          </span>
        )
      }
    ],
    []
  );

  const data: Array<OrganizationWithReferentsAndStatus> = useMemo(
    () => (operators?.items ? [...operators.items] : []),
    [operators]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, sortBy },
    visibleColumns
  } = useTable<OrganizationWithReferentsAndStatus>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: PAGE_SIZE },
      manualPagination: true,
      manualSortBy: true,
      disableMultiSort: true,
      pageCount: operators?.count ? Math.ceil(operators?.count / PAGE_SIZE) : 0
    },
    useSortBy,
    useExpanded,
    usePagination
  );

  useEffect(() => {
    const sortField = sortBy[0];
    if (sortField) {
      setValues(values => ({
        ...values,
        sortColumn: getActivationsSortColumn(sortField.id),
        sortDirection: sortField.desc ? "DESC" : "ASC"
      }));
    } else {
      setValues(values => ({
        ...values,
        sortColumn: undefined,
        sortDirection: undefined
      }));
    }
  }, [sortBy]);

  useEffect(() => {
    setPageParam(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    gotoPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useStableValue(values)]);

  const startRowIndex: number = pageIndex * PAGE_SIZE + 1;
  // eslint-disable-next-line functional/no-let
  let endRowIndex: number = startRowIndex - 1 + PAGE_SIZE;

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
            pageIndex={pageIndex}
            onPreviousPage={previousPage}
            onNextPage={nextPage}
            onGotoPage={gotoPage}
            pageArray={pageArray}
            total={operators?.count}
          />
          <div className="overflow-auto">
            <table
              {...getTableProps()}
              style={{ width: "100%" }}
              className="mt-2 bg-white"
            >
              <TableHeader headerGroups={headerGroups} />
              <tbody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row);
                  return (
                    <Fragment key={row.getRowProps().key}>
                      <tr
                        className="cursor-pointer"
                        onClick={() => row.toggleRowExpanded()}
                      >
                        {row.cells.map((cell, i) => (
                          <td
                            className={`
                          ${i === 0 ? "ps-6" : ""}
                          ${i === headerGroups.length - 1 ? "pe-6" : ""}
                          px-3 py-2 border-bottom text-sm
                          `}
                            {...cell.getCellProps()}
                            style={
                              cell.column.id === "expander"
                                ? { width: "calc(32px + 0.75rem * 2)" }
                                : {}
                            }
                            key={i}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                      {row.isExpanded && (
                        <tr className="px-8 py-4 border-bottom text-sm fw-normal text-black">
                          <td colSpan={visibleColumns.length}>
                            <OperatorActivationDetail
                              operator={row.original}
                              getActivations={() => refetch()}
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
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
