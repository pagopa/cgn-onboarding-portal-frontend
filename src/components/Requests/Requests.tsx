import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from "react";
import {
  useTable,
  useExpanded,
  Row,
  UseExpandedRowProps,
  usePagination
} from "react-table";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import cx from "classnames";
import { Icon, Button } from "design-react-kit";
import { format } from "date-fns";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";
import { Agreements } from "../../api/generated_backoffice";
import RequestFilter from "./RequestsFilter";
import RequestStateBadge from "./RequestStateBadge";
import RequestsDetails from "./RequestsDetails";

// eslint-disable-next-line sonarjs/cognitive-complexity
const Requests = () => {
  const pageSize = 20;
  const [agreements, setAgreements] = useState<Agreements>();
  const [loading, setLoading] = useState(false);
  const refForm = useRef<any>(null);

  const getAgreementsApi = async (params?: any) =>
    await tryCatch(
      () =>
        Api.Agreement.getAgreements(
          params.states,
          params.assignee,
          params.profileFullName,
          params.requestDateFrom,
          params.requestDateTo,
          pageSize,
          params.page
        ),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        response => {
          setAgreements(response);
          setLoading(false);
        }
      )
      .run();

  const getAgreements = (params?: any) => {
    setLoading(true);
    void getAgreementsApi(params);
  };

  const data = useMemo(() => agreements?.items || [], [agreements]);
  const columns = useMemo(
    () => [
      {
        Header: "Operatore",
        accessor: "profile.fullName"
      },
      {
        Header: "Data Richiesta",
        accessor: "requestDate",
        Cell: ({ row }: { row: Row }) =>
          format(new Date(row.values.requestDate), "dd/MM/yyyy")
      },
      {
        Header: "Stato",
        accessor: "state",
        Cell: ({ row }: { row: Row }) => RequestStateBadge(row.values.state)
      },
      {
        Header: "Revisore",
        accessor: "assignee.fullName"
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
    []
  );

  const renderRowSubComponent = useCallback(
    ({ row: { original } }) => (
      <RequestsDetails
        updateList={() => refForm.current?.submitForm()}
        original={original}
        setLoading={setLoading}
      />
    ),
    [agreements]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex }
  } = useTable<any>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
      manualPagination: true,
      pageCount: agreements?.total ? Math.ceil(agreements?.total / pageSize) : 0
    },
    useExpanded,
    usePagination
  );

  useEffect(() => {
    refForm.current?.setFieldValue("page", pageIndex);
    refForm.current?.submitForm();
  }, [pageIndex]);

  const startRowIndex: number = pageIndex * pageSize + 1;
  // eslint-disable-next-line functional/no-let
  let endRowIndex: number = startRowIndex - 1 + pageSize;

  if (endRowIndex > (agreements?.total || 0)) {
    endRowIndex = agreements?.total || 0;
  }

  const pageArray = Array.from(Array(pageCount).keys());

  return (
    <section className="mt-2 px-8 py-10 bg-white">
      <RequestFilter getAgreements={getAgreements} refForm={refForm} />
      {loading ? (
        <CenteredLoading />
      ) : (
        <>
          <div className="mb-2 mt-4 d-flex justify-content-between">
            {!!agreements?.total && (
              <strong>
                {startRowIndex}-{endRowIndex} di {agreements?.total}
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
                      {...column.getHeaderProps()}
                      key={i}
                      className="px-6 py-2 text-sm font-weight-bold text-gray text-uppercase"
                    >
                      {column.render("Header")}
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
                    <tr className="cursor-pointer">
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
                    {row.isExpanded ? (
                      <tr className="px-8 py-4 border-bottom text-sm font-weight-normal text-black">
                        <td colSpan={visibleColumns.length}>
                          {renderRowSubComponent({ row })}
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {!agreements?.items.length &&
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
                    getAgreements({});
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
