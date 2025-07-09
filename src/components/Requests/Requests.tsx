import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import {
  useTable,
  useExpanded,
  usePagination,
  useSortBy,
  Column
} from "react-table";
import { Icon, Button } from "design-react-kit";
import { format } from "date-fns";
import omit from "lodash/omit";
import isEqual from "lodash/isEqual";
import { keepPreviousData } from "@tanstack/react-query";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import {
  AgreementApiGetAgreementsRequest,
  Agreement,
  AssignedAgreement,
  GetAgreementsAssigneeEnum,
  GetAgreementsSortColumnEnum
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import { useDebouncedValue } from "../../utils/useDebounce";
import { useStableValue } from "../../utils/useStableValue";
import RequestFilter from "./RequestsFilter";
import RequestStateBadge from "./RequestStateBadge";
import RequestsDetails from "./RequestsDetails";

type BackofficeAgreement = Partial<AssignedAgreement> & Agreement;

export type RequestsFilterFormValues = {
  profileFullName: string | undefined;
  requestDateFrom: Date | undefined;
  requestDateTo: Date | undefined;
  states: string | undefined;
  assignee: GetAgreementsAssigneeEnum | undefined;
  sortColumn: GetAgreementsSortColumnEnum | undefined;
  sortDirection: "ASC" | "DESC" | undefined;
};

const requestFilterFormInitialValues: RequestsFilterFormValues = {
  profileFullName: "",
  requestDateFrom: undefined,
  requestDateTo: undefined,
  states: undefined,
  assignee: undefined,
  sortColumn: undefined,
  sortDirection: undefined
};

const getRequetsSortColumn = (id: string) => {
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

const Requests = () => {
  const pageSize = 20;

  const [values, setValues] = useState<RequestsFilterFormValues>(
    requestFilterFormInitialValues
  );

  const hasActiveFitlers = !isEqual(values, requestFilterFormInitialValues);

  const [pageParam, setPageParam] = useState<number>(0);

  const debouncedProfileFullName = useDebouncedValue({
    value: values.profileFullName,
    delay: 500,
    leading: false,
    trailing: true,
    maxWait: 3000
  });

  const params = useMemo((): AgreementApiGetAgreementsRequest => {
    const requestAssignedAgreements =
      values.states?.includes("AssignedAgreement");
    return {
      profileFullName: debouncedProfileFullName,
      requestDateFrom: values.requestDateFrom
        ? format(values.requestDateFrom, "yyyy-MM-dd")
        : undefined,
      requestDateTo: values.requestDateTo
        ? format(values.requestDateTo, "yyyy-MM-dd")
        : undefined,
      assignee: requestAssignedAgreements
        ? (values.states
            ?.split("AssignedAgreement")
            .at(-1) as GetAgreementsAssigneeEnum)
        : undefined,
      states: requestAssignedAgreements ? "AssignedAgreement" : values.states,
      sortColumn: values.sortColumn,
      sortDirection: values.sortDirection,
      page: pageParam,
      pageSize
    };
  }, [
    values.states,
    values.requestDateFrom,
    values.requestDateTo,
    values.sortColumn,
    values.sortDirection,
    debouncedProfileFullName,
    pageParam
  ]);

  const { data: agreements, isPending } =
    remoteData.Backoffice.Agreement.getAgreements.useQuery(
      params,
      { placeholderData: keepPreviousData, refetchOnWindowFocus: false } // this fixes page reset when uploading a file since it defocuses the window
    );

  const data = useMemo(
    () => agreements?.items || [],
    [agreements]
  ) as Array<BackofficeAgreement>;
  const columns = useMemo(
    (): Array<Column<BackofficeAgreement>> => [
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
        accessor: data => data.assignee?.fullName
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
        updateList={() => {
          remoteData.Backoffice.Agreement.getAgreements.invalidateQueries({});
        }}
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
  } = useTable<BackofficeAgreement>(
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

  useEffect(() => {
    const sortField = sortBy[0];
    if (sortField) {
      setValues(values => ({
        ...values,
        sortColumn: getRequetsSortColumn(sortField.id),
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
        values={values}
        onChange={setValues}
        onReset={() => {
          setValues(requestFilterFormInitialValues);
        }}
        hasActiveFitlers={hasActiveFitlers}
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
            total={agreements?.total}
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
          </div>
          {!agreements?.items.length &&
            (hasActiveFitlers ? (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessun risultato corrisponde alla tua ricerca</p>
                <Button
                  color="primary"
                  outline
                  tag="button"
                  className="mt-3"
                  onClick={() => {
                    setValues(requestFilterFormInitialValues);
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
