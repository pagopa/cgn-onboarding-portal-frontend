import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTable, usePagination, Row, useSortBy, Column } from "react-table";
import cx from "classnames";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Button, Icon } from "design-react-kit";
import { format } from "date-fns";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";
import { OrganizationWithReferents } from "../../api/generated_backoffice";
import ConventionFilter from "../OperatorConvention/ConventionFilter";
import ConventionDetails from "../OperatorConvention/ConventionDetails";

const PAGE_SIZE = 20;

type OrderType = "fiscalCode" | "name" | "pec" | "insertedAt";

type GetOrgsParams = {
  searchQuery?: string;
  page?: number;
  sortColumn?: OrderType;
  sortDirection?: "ASC" | "DESC";
};
// eslint-disable-next-line sonarjs/cognitive-complexity
const OperatorConvention = () => {
  const [operators, setOperators] = useState<
    ReadonlyArray<OrganizationWithReferents>
  >([]);
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

  const getConventions = (params?: GetOrgsParams) => {
    setLoading(true);
    void getActivationsApi(params);
  };

  const columns: ReadonlyArray<Column<OrganizationWithReferents>> = useMemo(
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
        Cell: ({ row }: { row: Row }) => row.values.referents
      },
      {
        Header: "AGGIUNTO IL",
        accessor: "insertedAt",
        Cell: ({ row }: { row: Row }) =>
          format(new Date(row.values.insertedAt), "dd/MM/yyyy")
      }
    ],
    []
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
    state: { pageIndex, sortBy }
  } = useTable<OrganizationWithReferents>(
    {
      columns: [...columns],
      data: [...operators],
      initialState: { pageIndex: 0, pageSize: PAGE_SIZE },
      manualPagination: true,
      manualSortBy: true,
      disableMultiSort: true,
      pageCount: operators.length ? Math.ceil(operators.length / PAGE_SIZE) : 0
    },
    useSortBy,
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

  if (showDetails && selectedOperator) {
    return (
      <ConventionDetails
        agreement={selectedOperator}
        onClose={() => {
          setShowDetails(false);
          setSelectedOperator(undefined);
        }}
      />
    );
  }

  const startRowIndex: number = pageIndex * PAGE_SIZE + 1;
  // eslint-disable-next-line functional/no-let
  let endRowIndex: number = startRowIndex - 1 + PAGE_SIZE;

  if (endRowIndex > operators.length) {
    endRowIndex = operators.length;
  }

  const pageArray = Array.from(Array(pageCount).keys());

  return (
    <section className="mt-2 px-8 py-10 bg-white">
      <ConventionFilter refForm={refForm} getConventions={getConventions} />
      {loading ? (
        <CenteredLoading />
      ) : (
        <>
          <div className="mb-2 mt-4 d-flex justify-content-between">
            {!!operators.length && (
              <strong>
                {startRowIndex}-{endRowIndex} di {operators.length}
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
                      onClick={() => {
                        setShowDetails(true);
                        setSelectedOperator(row.original);
                      }}
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
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {!operators.length &&
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
                    getConventions({});
                  }}
                >
                  Reimposta Tutto
                </Button>
              </div>
            ) : (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessuna convenzione trovata</p>
              </div>
            ))}
        </>
      )}
    </section>
  );
};

export default OperatorConvention;
