import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTable, usePagination, Row, useSortBy } from "react-table";
import cx from "classnames";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Button, Icon } from "design-react-kit";
import { format } from "date-fns";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";
import {
  ApprovedAgreements,
  ApprovedAgreement
} from "../../api/generated_backoffice";
import ConventionFilter from "./ConventionFilter";
import ConventionDetails from "./ConventionDetails";

// eslint-disable-next-line sonarjs/cognitive-complexity
const OperatorConvention = () => {
  const pageSize = 20;
  const [conventions, setConventions] = useState<ApprovedAgreements>();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<
    ApprovedAgreement | undefined
  >();
  const refForm = useRef<any>(null);

  const getConventionsApi = async (params?: any) =>
    await tryCatch(
      () =>
        Api.Agreement.getApprovedAgreements(
          params.profileFullName,
          params.lastUpdateDateFrom,
          params.lastUpdateDateTo,
          pageSize,
          params.page,
          params.sortColumn,
          params.sortDirection
        ),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        response => {
          setLoading(false);
          setConventions(response);
        }
      )
      .run();

  const getConventions = (params?: any) => {
    setLoading(true);
    void getConventionsApi(params);
  };

  const data = useMemo(() => conventions?.items || [], [conventions]);
  const columns = useMemo(
    () => [
      {
        Header: "Operatore",
        accessor: "fullName"
      },
      {
        Header: "Data Convenzionamento",
        accessor: "agreementStartDate",
        Cell: ({ row }: { row: Row }) =>
          format(new Date(row.values.agreementStartDate), "dd/MM/yyyy")
      },
      {
        Header: "Data Ultima Modifica",
        accessor: "agreementLastUpdateDate",
        Cell: ({ row }: { row: Row }) =>
          format(new Date(row.values.agreementLastUpdateDate), "dd/MM/yyyy")
      },
      {
        Header: "Agevolazioni",
        accessor: "publishedDiscounts"
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
  } = useTable<any>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
      manualPagination: true,
      manualSortBy: true,
      disableMultiSort: true,
      pageCount: conventions?.total
        ? Math.ceil(conventions?.total / pageSize)
        : 0
    },
    useSortBy,
    usePagination
  );

  const getSortColumn = (id: string) => {
    switch (id) {
      case "fullName":
        return "Operator";
      case "agreementStartDate":
        return "AgreementDate";
      case "agreementLastUpdateDate":
        return "LastModifyDate";
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

  if (showDetails && selectedConvention) {
    return (
      <ConventionDetails
        agreement={selectedConvention}
        onClose={() => {
          setShowDetails(false);
          setSelectedConvention(undefined);
        }}
      />
    );
  }

  const startRowIndex: number = pageIndex * pageSize + 1;
  // eslint-disable-next-line functional/no-let
  let endRowIndex: number = startRowIndex - 1 + pageSize;

  if (endRowIndex > (conventions?.total || 0)) {
    endRowIndex = conventions?.total || 0;
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
            {!!conventions?.total && (
              <strong>
                {startRowIndex}-{endRowIndex} di {conventions?.total}
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
                        setSelectedConvention(row.original);
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
          {!conventions?.items.length &&
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
