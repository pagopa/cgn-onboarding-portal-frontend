import { useMemo, useState } from "react";
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
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
    <Box sx={{ mt: 1, px: 4, py: 5, backgroundColor: "white" }}>
      <ConventionFilter
        values={values}
        onChange={setValues}
        hasActiveFitlers={hasActiveFitlers}
        onReset={() => {
          setValues(conventionFilterFormInitialValues);
          setSorting([]);
        }}
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
          <Box sx={{ overflowX: "auto" }}>
            <Table
              sx={{
                width: "100%",
                marginTop: "8px",
                backgroundColor: "white"
              }}
            >
              <TableHeader headerGroups={table.getHeaderGroups()} />

              <TableBody>
                {table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowDetails(true);
                      setSelectedConvention(row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell, i, arr) => (
                      <TableCell
                        key={cell.id}
                        sx={{
                          paddingLeft: i === 0 ? "24px" : "12px",
                          paddingRight: i === arr.length - 1 ? "24px" : "12px",
                          paddingTop: "8px",
                          paddingBottom: "8px",
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          fontSize: "0.875rem"
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          {!conventions?.items.length &&
            (hasActiveFitlers ? (
              <Box
                sx={{
                  m: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <Typography variant="body2">
                  Nessun risultato corrisponde alla tua ricerca
                </Typography>
                <Button
                  color="primary"
                  variant="outlined"
                  type="button"
                  sx={{ mt: 1.5 }}
                  onClick={() => {
                    setValues(conventionFilterFormInitialValues);
                  }}
                >
                  Reimposta Tutto
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  m: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <Typography variant="body2">
                  Nessuna convenzione trovata
                </Typography>
              </Box>
            ))}
        </>
      )}
    </Box>
  );
};

export default OperatorConvention;
