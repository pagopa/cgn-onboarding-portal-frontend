import { Fragment, useEffect, useMemo, useState } from "react";
import { Column, Row, usePagination, useSortBy, useTable } from "react-table";
import { Button } from "design-react-kit";
import { format } from "date-fns";
import { isEqual } from "lodash";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import {
  AgreementApiGetApprovedAgreementsRequest,
  ApprovedAgreement,
  GetApprovedAgreementsSortColumnEnum
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import { DiscountState } from "../../api/generated";
import { getEntityTypeLabel } from "../../utils/strings";
import { useDebouncedValue } from "../../utils/useDebounce";
import ConventionFilter from "./ConventionFilter";
import ConventionDetails from "./ConventionDetails";
import { BadgeStatus } from "./BadgeStatus";

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

const OperatorConvention = () => {
  const pageSize = 20;
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<
    ApprovedAgreement | undefined
  >();

  const [pageParam, setPageParam] = useState(0);

  const [values, setValues] = useState<ConventionFilterFormValues>(
    conventionFilterFormInitialValues
  );

  const isDirty = !isEqual(values, conventionFilterFormInitialValues);

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
      lastUpdateDateFrom: values.lastUpdateDateFrom?.toISOString(),
      lastUpdateDateTo: values.lastUpdateDateTo?.toISOString(),
      sortColumn: values.sortColumn,
      sortDirection: values.sortDirection,
      pageSize,
      page: pageParam
    }),
    [
      fullNameDebounced,
      pageParam,
      values.lastUpdateDateFrom,
      values.lastUpdateDateTo,
      values.sortColumn,
      values.sortDirection
    ]
  );

  const { data: conventions, isLoading } =
    remoteData.Backoffice.Agreement.getApprovedAgreements.useQuery(params);

  const data = useMemo(() => conventions?.items || [], [conventions]);
  const columns = useMemo(
    (): Array<Column<ApprovedAgreement>> => [
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
        Cell: ({ row }) =>
          format(new Date(row.values.agreementStartDate), "dd/MM/yyyy")
      },
      {
        Header: "Data Ultima Modifica",
        accessor: "agreementLastUpdateDate",
        Cell: ({ row }) =>
          format(new Date(row.values.agreementLastUpdateDate), "dd/MM/yyyy")
      },
      {
        Header: "Opportunità",
        accessor: "publishedDiscounts"
      },
      {
        Header: "TEST",
        accessor: "testPending",
        Cell: ({ row }) =>
          row.values.testPending && (
            <BadgeStatus discountState={DiscountState.TestPending} />
          )
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
  } = useTable<ApprovedAgreement>(
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

  useEffect(() => {
    const sortField = sortBy[0];
    if (sortField) {
      setValues(values => ({
        ...values,
        sortColumn: getSortColumn(sortField.id),
        sortDirection: sortField.desc ? "DESC" : "ASC"
      }));
    } else {
      setValues(values => ({
        ...values,
        sortColumn: undefined,
        sortDirection: undefined
      }));
    }
  }, [pageIndex, sortBy]);

  useEffect(() => {
    setPageParam(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    setPageParam(0);
  }, [values]);

  if (showDetails && selectedConvention) {
    return (
      <ConventionDetails
        agreement={selectedConvention}
        onClose={() => {
          setShowDetails(false);
          setSelectedConvention(undefined);
          setValues(conventionFilterFormInitialValues);
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
      <ConventionFilter
        values={values}
        onChange={setValues}
        isDirty={isDirty}
        onReset={() => setValues(conventionFilterFormInitialValues)}
      />
      {isLoading ? (
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
                  <Fragment key={row.getRowProps().key}>
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
                          ${i === 0 ? "ps-6" : ""}
                          ${i === headerGroups.length - 1 ? "pe-6" : ""}
                          px-3 py-2 border-bottom text-sm
                          `}
                          {...cell.getCellProps()}
                          key={i}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {!conventions?.items.length &&
            (isDirty ? (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessun risultato corrisponde alla tua ricerca</p>
                <Button
                  color="primary"
                  outline
                  tag="button"
                  className="mt-3"
                  onClick={() => {
                    setValues(conventionFilterFormInitialValues);
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
