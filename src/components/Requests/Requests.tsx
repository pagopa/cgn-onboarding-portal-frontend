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
  usePagination,
  useSortBy
} from "react-table";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Icon, Button } from "design-react-kit";
import { format } from "date-fns";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";
import { Agreements } from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
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
    state: { pageIndex, sortBy }
  } = useTable<any>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
      manualPagination: true,
      manualSortBy: true,
      disableMultiSort: true,
      pageCount: agreements?.total ? Math.ceil(agreements?.total / pageSize) : 0
    },
    useSortBy,
    useExpanded,
    usePagination
  );

  const getSortColumn = (id: string) => {
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
            total={agreements?.total}
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
                    <tr className="cursor-pointer">
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
