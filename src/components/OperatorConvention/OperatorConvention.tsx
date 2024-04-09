import React, { useEffect, useMemo, useRef, useState } from "react";
import { Row, usePagination, useSortBy, useTable } from "react-table";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Button } from "design-react-kit";
import { format } from "date-fns";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";
import {
  ApprovedAgreement,
  ApprovedAgreements
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import { DiscountState } from "../../api/generated";
import { getEntityTypeLabel } from "../../utils/strings";
import ConventionFilter from "./ConventionFilter";
import ConventionDetails, { getBadgeStatus } from "./ConventionDetails";

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
        Header: "Tipologia ente",
        accessor: "entityType",
        Cell: ({ row }: { row: Row<ApprovedAgreement> }) =>
          getEntityTypeLabel(row.original.entityType)
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
        Header: "Opportunità",
        accessor: "publishedDiscounts"
      },
      {
        Header: "TEST",
        accessor: "testPending",
        Cell: ({ row }: { row: Row }) =>
          row.values.testPending && getBadgeStatus(DiscountState.TestPending)
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
      case "publishedDiscounts":
        return "PublishedDiscounts";
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
          getConventions({});
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
            total={conventions?.total}
          />
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
                          className={`
                          ${i === 0 ? "pl-6" : ""}
                          ${i === headerGroups.length - 1 ? "pr-6" : ""}
                          px-3 py-2 border-bottom text-sm
                          `}
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
