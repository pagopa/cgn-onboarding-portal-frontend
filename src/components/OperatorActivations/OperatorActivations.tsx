import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  useTable,
  usePagination,
  Row,
  useSortBy,
  Column,
  UseExpandedRowProps,
  useExpanded
} from "react-table";
import cx from "classnames";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Button, Icon } from "design-react-kit";
import { format } from "date-fns";
import { constNull } from "fp-ts/lib/function";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";
import {
  Organizations,
  OrganizationWithReferents
} from "../../api/generated_backoffice";
import ActivationsFilter from "./ActivationsFilter";
import { mockActivations } from "./mockActivations";
import OperatorActivationDetail from "./OperatorActivationDetail";

const PAGE_SIZE = 20;

type OrderType = "fiscalCode" | "name" | "pec" | "insertedAt";

export type GetOrgsParams = {
  searchQuery?: string;
  page?: number;
  sortColumn?: OrderType;
  sortDirection?: "ASC" | "DESC";
};
// eslint-disable-next-line sonarjs/cognitive-complexity
const OperatorActivations = () => {
  const [operators, setOperators] = useState<Organizations>();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<
    OrganizationWithReferents
  >();
  const refForm = useRef<any>(null);

  const getActivationsApi = async (params?: GetOrgsParams) =>
    await tryCatch(
      () =>
        Api.Activations.getOrganizations(
          params?.searchQuery,
          params?.page,
          PAGE_SIZE,
          params?.sortColumn,
          params?.sortDirection
        ),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        response => {
          setLoading(false);
          setOperators(response);
        }
      )
      .run();

  const getActivations = (params?: GetOrgsParams) => {
    // setLoading(true);
    setOperators(mockActivations);
    // void getActivationsApi(params);
  };

  const columns: Array<Column<OrganizationWithReferents>> = useMemo(
    () => [
      {
        Header: "RAGIONE SOCIALE",
        accessor: "organizationName"
      },
      {
        Header: "CF/P.IVA",
        accessor: "organizationFiscalCode"
      },
      {
        Header: "UTENTI ABILITATI",
        accessor: "referents",
        Cell: ({ row }: { row: Row }) => {
          if (Array.isArray(row.values.referents)) {
            return row.values.referents.reduce(
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
            );
          }
          return row.values.referents;
        }
      },
      {
        Header: "AGGIUNTO IL",
        accessor: "insertedAt",
        Cell: ({ row }: { row: Row }) =>
          format(new Date(row.values.insertedAt), "dd/MM/yyyy")
      },
      {
        Header: () => null,
        id: "expander",
        Cell: ({ row }: { row: UseExpandedRowProps<Row> }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <Icon icon="it-expand" color="primary" />
            ) : (
              <Icon icon="it-collapse" color="primary" />
            )}
          </span>
        )
      }
    ],
    [operators]
  );

  const data: Array<OrganizationWithReferents> = useMemo(
    () => (operators?.items ? [...operators?.items] : []),
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
  } = useTable<OrganizationWithReferents>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: PAGE_SIZE },
      manualPagination: true,
      manualSortBy: true,
      disableMultiSort: true,
      pageCount: mockActivations.count
        ? Math.ceil(mockActivations.count / PAGE_SIZE)
        : 0
    },
    useSortBy,
    useExpanded,
    usePagination
  );

  const getSortColumn = (id: string): OrderType => {
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

  useEffect(() => {
    const sortField = sortBy[0];
    if (sortField) {
      refForm.current?.setFieldValue("sortColumn", getSortColumn(sortField.id));
      refForm.current?.setFieldValue(
        "sortDirection",
        sortField.desc ? "DESC" : "ASC"
      );
    } else {
      refForm.current?.setFieldValue("sortColumn", undefined);
      refForm.current?.setFieldValue("sortDirection", undefined);
    }
    refForm.current?.setFieldValue("page", pageIndex);
    refForm.current?.submitForm();
  }, [pageIndex, sortBy]);

  const startRowIndex: number = pageIndex * PAGE_SIZE + 1;
  // eslint-disable-next-line functional/no-let
  let endRowIndex: number = startRowIndex - 1 + PAGE_SIZE;

  if (operators?.count && endRowIndex > operators?.count) {
    endRowIndex = operators.count;
  }

  const pageArray = Array.from(Array(pageCount).keys());

  return (
    <section className="mt-2 px-8 py-10 bg-white">
      <ActivationsFilter refForm={refForm} getActivations={getActivations} />
      {loading ? (
        <CenteredLoading />
      ) : (
        <>
          <div className="mb-2 mt-4 d-flex justify-content-between">
            {!!operators?.count && (
              <strong>
                {startRowIndex}-{endRowIndex} di {operators.count}
              </strong>
            )}
            <div className="d-flex align-items-center">
              {canPreviousPage && (
                <Icon
                  icon="it-arrow-left"
                  size="sm"
                  color="primary"
                  className="cursor-pointer mx-1"
                  onClick={() => previousPage()}
                />
              )}
              {pageArray.map(page => (
                <div
                  className={cx(
                    "font-weight-bold mx-1",
                    page !== pageIndex ? "cursor-pointer primary-color" : false
                  )}
                  key={page}
                  onClick={() => {
                    if (page !== pageIndex) {
                      gotoPage(page);
                    }
                  }}
                >
                  {page + 1}
                </div>
              ))}
              {canNextPage && (
                <Icon
                  icon="it-arrow-right"
                  size="sm"
                  color="primary"
                  className="cursor-pointer mx-1"
                  onClick={() => nextPage()}
                />
              )}
            </div>
          </div>
          <table
            {...getTableProps()}
            style={{ width: "100%" }}
            className="mt-2 bg-white"
          >
            <thead>
              {headerGroups.map((headerGroup, i) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={i}
                  style={{
                    backgroundColor: "#F8F9F9",
                    borderBottom: "1px solid #5A6772"
                  }}
                >
                  {headerGroup.headers.map((column, i) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={i}
                      className="px-6 py-2 text-sm font-weight-bold text-gray
                    text-uppercase"
                    >
                      {column.render("Header")}
                      <span>
                        {column.canSort && (
                          <>
                            {column.isSorted ? (
                              <>
                                {column.isSortedDesc ? (
                                  <Icon
                                    icon="it-arrow-up-triangle"
                                    style={{ color: "#5C6F82" }}
                                  />
                                ) : (
                                  <Icon
                                    icon="it-arrow-down-triangle"
                                    style={{ color: "#5C6F82" }}
                                  />
                                )}
                              </>
                            ) : (
                              <Icon
                                icon="it-arrow-up-triangle"
                                style={{ color: "#5C6F82" }}
                              />
                            )}
                          </>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <React.Fragment key={row.getRowProps().key}>
                    <tr
                      className="cursor-pointer"
                      onClick={() => row.toggleRowExpanded()}
                    >
                      {row.cells.map((cell, i) => (
                        <td
                          className="px-6 py-2 border-bottom text-sm"
                          {...cell.getCellProps()}
                          key={i}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                    {row.isExpanded && (
                      <tr className="px-8 py-4 border-bottom text-sm font-weight-normal text-black">
                        <td colSpan={visibleColumns.length}>
                          <OperatorActivationDetail
                            operator={row.original}
                            getActivations={getActivations}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {!operators?.items?.length &&
            (refForm.current?.dirty ? (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessun risultato corrisponde alla tua ricerca</p>
                <Button
                  color="primary"
                  outline
                  tag="button"
                  className="mt-3"
                  onClick={() => {
                    refForm.current?.resetForm();
                    getActivations({});
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
