import { format } from "date-fns";
import { Badge, Button, Icon } from "design-react-kit";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Column,
  Row,
  useExpanded,
  UseExpandedRowProps,
  usePagination,
  useSortBy,
  useTable
} from "react-table";
import Api from "../../api/backoffice";
import {
  Organizations,
  OrganizationStatus,
  OrganizationWithReferentsAndStatus
} from "../../api/generated_backoffice";
import { makeOrganizationStatusReadable } from "../../utils/strings";
import CenteredLoading from "../CenteredLoading";
import Pager from "../Table/Pager";
import TableHeader from "../Table/TableHeader";
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
  const [operators, setOperators] = useState<Organizations>();
  const [loading, setLoading] = useState(false);
  const refForm = useRef<any>(null);

  const getActivationsApi = (params?: GetOrgsParams) =>
    pipe(
      TE.tryCatch(
        () =>
          Api.AttributeAuthority.getOrganizations(
            params?.searchQuery,
            params?.page,
            PAGE_SIZE,
            params?.sortColumn,
            params?.sortDirection
          ),
        toError
      ),
      TE.map(response => response.data),
      TE.mapLeft(() => setLoading(false)),
      TE.map(response => {
        setLoading(false);
        setOperators(response);
      })
    )();

  const getActivations = (params?: GetOrgsParams) => {
    setLoading(true);
    void getActivationsApi(params);
  };

  const columns: Array<Column<OrganizationWithReferentsAndStatus>> = useMemo(
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
      <ActivationsFilter refForm={refForm} getActivations={getActivations} />
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
