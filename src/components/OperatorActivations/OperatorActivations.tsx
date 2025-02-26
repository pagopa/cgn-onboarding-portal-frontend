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
import { Badge, Button, Icon } from "design-react-kit";
import { format } from "date-fns";
import { omit } from "lodash";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading";
import {
  OrganizationStatus,
  OrganizationWithReferentsAndStatus
} from "../../api/generated_backoffice";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
import {
  getEntityTypeLabel,
  makeOrganizationStatusReadable
} from "../../utils/strings";
import ActivationsFilter from "./ActivationsFilter";
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
  const refForm = useRef<any>(null);

  const [params, setParams] = useState<GetOrgsParams>();
  const {
    data: operators,
    isLoading,
    refetch
  } = remoteData.Backoffice.AttributeAuthority.getOrganizations.useQuery({
    searchQuery: params?.searchQuery,
    page: params?.page,
    pageSize: PAGE_SIZE,
    sortBy: params?.sortColumn,
    sortDirection: params?.sortDirection
  });

  const columns: Array<Column<OrganizationWithReferentsAndStatus>> = useMemo(
    () => [
      {
        Header: "RAGIONE SOCIALE",
        accessor: "organizationName"
      },
      {
        Header: "TIPOLOGIA ENTE",
        Cell: ({ row }: { row: Row<OrganizationWithReferentsAndStatus> }) =>
          getEntityTypeLabel(row.original.entityType)
      },
      {
        Header: "UTENTI ABILITATI",
        disableSortBy: true,
        accessor: "referents",
        Cell: ({ row }: { row: Row }) => {
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
        Cell: ({ row }: { row: Row }) => (
          <span>{format(new Date(row.values.insertedAt), "dd/MM/yyyy")}</span>
        )
      },
      {
        Header: "STATO",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ row }: { row: Row }) => (
          <Badge
            className="font-weight-semibold"
            color="outline-primary"
            pill
            tag="span"
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
        Cell: ({ row }: { row: UseExpandedRowProps<Row> }) => (
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
      <ActivationsFilter refForm={refForm} getActivations={setParams} />
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
            total={operators?.count}
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
                      onClick={() => row.toggleRowExpanded()}
                    >
                      {row.cells.map((cell, i) => (
                        <td
                          className={`
                          ${i === 0 ? "pl-6" : ""}
                          ${i === headerGroups.length - 1 ? "pr-6" : ""}
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
                      <tr className="px-8 py-4 border-bottom text-sm font-weight-normal text-black">
                        <td colSpan={visibleColumns.length}>
                          <OperatorActivationDetail
                            operator={row.original}
                            getActivations={() => refetch()}
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
                    setParams({});
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
