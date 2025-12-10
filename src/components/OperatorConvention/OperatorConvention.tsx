import { useMemo, useState } from "react";
import { Button } from "design-react-kit";
import { format } from "date-fns";
import isEqual from "lodash/isEqual";
import {
  createColumnHelper,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
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
import { useSyncSorting } from "../../utils/useSyncSorting";
import { usePaginationHelpers } from "../../utils/usePaginationHelpers";
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

const getConventionSortColumn = (id: string) => {
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
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<
    ApprovedAgreement | undefined
  >();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20
  });

  const [values, setValues] = useState<ConventionFilterFormValues>(
    conventionFilterFormInitialValues
  );

  const hasActiveFitlers = !isEqual(values, conventionFilterFormInitialValues);

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
      lastUpdateDateFrom: values.lastUpdateDateFrom
        ? format(values.lastUpdateDateFrom, "yyyy-MM-dd")
        : undefined,
      lastUpdateDateTo: values.lastUpdateDateTo
        ? format(values.lastUpdateDateTo, "yyyy-MM-dd")
        : undefined,
      sortColumn: values.sortColumn,
      sortDirection: values.sortDirection,
      pageSize: pagination.pageSize,
      page: pagination.pageIndex
    }),
    [
      fullNameDebounced,
      pagination.pageIndex,
      pagination.pageSize,
      values.lastUpdateDateFrom,
      values.lastUpdateDateTo,
      values.sortColumn,
      values.sortDirection
    ]
  );

  const { data: conventions, isPending } =
    remoteData.Backoffice.Agreement.getApprovedAgreements.useQuery(params);

  const data = useMemo(() => conventions?.items || [], [conventions]);
  const columnHelper = createColumnHelper<ApprovedAgreement>();

  const columns = [
    columnHelper.accessor("fullName", {
      header: "Operatore"
    }),
    columnHelper.accessor("entityType", {
      header: "Tipologia ente",
      enableSorting: false,
      cell: ({ row }) => getEntityTypeLabel(row.original.entityType)
    }),
    columnHelper.accessor("agreementStartDate", {
      header: "Data Convenzionamento",
      cell: ({ getValue }) => {
        const v = getValue();
        return v ? format(new Date(v), "dd/MM/yyyy") : "-";
      }
    }),
    columnHelper.accessor("agreementLastUpdateDate", {
      header: "Data Ultima Modifica",
      cell: ({ getValue }) => {
        const v = getValue();
        return v ? format(new Date(v), "dd/MM/yyyy") : "-";
      }
    }),
    columnHelper.accessor("publishedDiscounts", {
      header: "Opportunità"
    }),
    columnHelper.accessor("testPending", {
      header: "TEST",
      enableSorting: false,
      cell: ({ getValue }) =>
        getValue() ? (
          <BadgeStatus discountState={DiscountState.TestPending} />
        ) : null
    })
  ];

  const pageCount = Math.ceil((conventions?.total ?? 0) / pagination.pageSize);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      expanded
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    manualPagination: true,
    manualSorting: true,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  useSyncSorting(sorting, setValues, getConventionSortColumn);
  const { canPreviousPage, canNextPage, previousPage, nextPage, gotoPage } =
    usePaginationHelpers(table);

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

  const startRowIndex: number = pagination.pageIndex * pagination.pageSize + 1;
  // eslint-disable-next-line functional/no-let
  let endRowIndex: number = startRowIndex - 1 + pagination.pageSize;

  if (endRowIndex > (conventions?.total || 0)) {
    endRowIndex = conventions?.total || 0;
  }

  const pageArray = Array.from(Array(pageCount).keys());

  return (
    <section className="mt-2 px-8 py-10 bg-white">
      <ConventionFilter
        values={values}
        onChange={setValues}
        hasActiveFitlers={hasActiveFitlers}
        onReset={() => setValues(conventionFilterFormInitialValues)}
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
            pageIndex={pagination.pageIndex}
            onPreviousPage={previousPage}
            onNextPage={nextPage}
            onGotoPage={gotoPage}
            pageArray={pageArray}
            total={conventions?.total}
          />
          <div className="overflow-auto">
            <table style={{ width: "100%" }} className="mt-2 bg-white">
              <TableHeader headerGroups={table.getHeaderGroups()} />

              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setShowDetails(true);
                      setSelectedConvention(row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell, i, arr) => (
                      <td
                        key={cell.id}
                        className={`${i === 0 ? "ps-6" : ""} ${
                          i === arr.length - 1 ? "pe-6" : ""
                        } px-3 py-2 border-bottom text-sm`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!conventions?.items.length &&
            (hasActiveFitlers ? (
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
