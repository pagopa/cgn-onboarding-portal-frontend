import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Fragment
} from "react";
import {
  useTable,
  useExpanded,
  usePagination,
  useSortBy,
  Column
} from "react-table";
import { Icon, Button } from "design-react-kit";
import { format } from "date-fns";
import { omit } from "lodash";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading";
import {
  AgreementApiGetAgreementsRequest,
  Agreement
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import RequestFilter from "./RequestsFilter";
import RequestStateBadge from "./RequestStateBadge";
import RequestsDetails from "./RequestsDetails";

const Requests = () => {
  const pageSize = 20;
  const refForm = useRef<any>(null);

  const [agreementsQueryParams, setAgreementsQueryParams] =
    useState<AgreementApiGetAgreementsRequest>({});
  const agreementsQuery =
    remoteData.Backoffice.Agreement.getAgreements.useQuery(
      { ...agreementsQueryParams, pageSize },
      { keepPreviousData: true, refetchOnWindowFocus: false } // this fixes page reset when uploading a file since it defocuses the window
    );
  const updateAgreementsQueryParams = useCallback(
    (params: AgreementApiGetAgreementsRequest) => {
      setAgreementsQueryParams(params);
      remoteData.Backoffice.Agreement.getAgreements.invalidateQueries({
        ...params,
        pageSize
      });
    },
    []
  );
  const agreements = agreementsQuery.data;

  const isLoading = agreementsQuery.isLoading;

  const data = useMemo(() => agreements?.items || [], [agreements]);
  const columns = useMemo(
    (): Array<Column<Agreement>> => [
      {
        Header: "Operatore",
        accessor: data => data.profile?.fullName
      },
      {
        Header: "Data Richiesta",
        accessor: "requestDate",
        Cell: ({ row }) =>
          format(new Date(row.values.requestDate), "dd/MM/yyyy")
      },
      {
        Header: "Stato",
        accessor: "state",
        Cell: ({ row }) => RequestStateBadge(row.values.state)
      },
      {
        Header: "Revisore",
        accessor: data => (data as any).assignee?.fullName
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

  const renderRowSubComponent = useCallback(
    ({ row: { original } }: { row: { original: Agreement } }) => (
      <RequestsDetails
        updateList={() => refForm.current?.submitForm()}
        original={original}
      />
    ),
    []
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
  } = useTable<Agreement>(
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
      <RequestFilter
        getAgreements={updateAgreementsQueryParams}
        refForm={refForm}
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
                    {row.isExpanded ? (
                      <tr className="px-8 py-4 border-bottom text-sm fw-normal text-black">
                        <td colSpan={visibleColumns.length}>
                          {renderRowSubComponent({ row })}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
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
                    setAgreementsQueryParams({});
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
