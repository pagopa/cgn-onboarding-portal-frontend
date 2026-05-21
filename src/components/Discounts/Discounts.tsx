import { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  getExpandedRowModel,
  createColumnHelper,
  getPaginationRowModel
} from "@tanstack/react-table";
import { Box } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import { compareAsc, format } from "date-fns";
import { remoteData } from "../../api/common";
import { CREATE_DISCOUNT } from "../../navigation/routes";
import { Severity, useTooltip } from "../../context/tooltip";
import { AgreementState, Discount, EntityType } from "../../api/generated";
import TableHeader from "../Table/TableHeader";
import { ExpanderCell } from "../ExpanderCell/ExpanderCell";
import { selectAgreement } from "../../store/agreement/selectors";
import { useCgnSelector } from "../../store/hooks";
import Pager from "../Table/Pager";
import { usePaginationHelpers } from "../../utils/usePaginationHelpers";
import PublishModal from "./PublishModal";
import { DeleteModal } from "./DeleteModal";
import DiscountDetailRow from "./DiscountDetailRow";
import { DiscountComponent } from "./getDiscountComponent";
import UnpublishModal from "./UnpublishModal";
import TestModal from "./TestModal";
import { TestErrorModal } from "./TestErrorModal";

const Discounts = () => {
  const agreement = useCgnSelector(selectAgreement);
  const [selectedDiscountAction, setSelectedDiscountAction] = useState<{
    action: "publish" | "unpublish" | "test" | "delete";
    discountId: string;
  }>();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20
  });

  const closeActionModal = () => setSelectedDiscountAction(undefined);
  const publishModal = selectedDiscountAction?.action === "publish";
  const unpublishModal = selectedDiscountAction?.action === "unpublish";
  const testModal = selectedDiscountAction?.action === "test";
  const deleteModal = selectedDiscountAction?.action === "delete";

  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = useCallback(
    (e: string) => {
      triggerTooltip({
        severity: Severity.DANGER,
        text: e
      });
    },
    [triggerTooltip]
  );

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });
  const profile = profileQuery.data;

  const discountsQuery = remoteData.Index.Discount.getDiscounts.useQuery({
    agreementId: agreement.id
  });
  useEffect(() => {
    if (discountsQuery.error) {
      throwErrorTooltip("Errore nel caricamento delle opportunità");
    }
  }, [discountsQuery.error, throwErrorTooltip]);
  const discounts = useMemo(
    () => discountsQuery.data?.items ?? [],
    [discountsQuery.data?.items]
  );
  const invalidateDiscountsQuery = (
    _: unknown,
    { agreementId }: { agreementId: string }
  ) => {
    remoteData.Index.Discount.getDiscounts.invalidateQueries({
      agreementId
    });
  };

  const deleteDiscountMutation =
    remoteData.Index.Discount.deleteDiscount.useMutation({
      onSuccess: invalidateDiscountsQuery,
      onError() {
        throwErrorTooltip("Errore nella cancellazione dell'opportunità");
      }
    });
  const deleteDiscount = (discountId: string) => {
    deleteDiscountMutation.mutate({
      agreementId: agreement.id,
      discountId
    });
  };

  const publishDiscountMutation =
    remoteData.Index.Discount.publishDiscount.useMutation({
      onSuccess: invalidateDiscountsQuery,
      onError(error) {
        if (error.status === 409) {
          throwErrorTooltip("Upload codici ancora in corso");
        } else {
          throwErrorTooltip("Errore durante la pubblicazione dell'opportunità");
        }
      }
    });
  const publishDiscount = (discountId: string) => {
    publishDiscountMutation.mutate({
      agreementId: agreement.id,
      discountId
    });
  };

  const unpublishDiscountMutation =
    remoteData.Index.Discount.unpublishDiscount.useMutation({
      onSuccess: invalidateDiscountsQuery,
      onError(error) {
        if (error.status === 409) {
          throwErrorTooltip("Upload codici ancora in corso");
        } else {
          throwErrorTooltip(
            "Errore durante la richiesta di cambio di stato dell'opportunità"
          );
        }
      }
    });

  const unpublishDiscount = (discountId: string) => {
    unpublishDiscountMutation.mutate({
      agreementId: agreement.id,
      discountId
    });
  };

  const [showTestBucketErrorModal, setShowTestBucketErrorModal] =
    useState(false);

  const testDiscountMutation =
    remoteData.Index.Discount.testDiscount.useMutation({
      onSuccess: invalidateDiscountsQuery,
      async onError(error) {
        if (
          error.status === 400 &&
          error.response?.data === "CANNOT_PROCEED_WITH_EXPIRED_DISCOUNT"
        ) {
          throwErrorTooltip(
            "Le date di validità dell'opportunità sono scadute. Aggiorna le date e riprova."
          );
        } else if (
          error.status === 400 &&
          error.response?.data ===
            "CANNOT_PROCEED_WITH_DISCOUNT_WITH_EMPTY_BUCKET"
        ) {
          setShowTestBucketErrorModal(true);
        } else {
          throwErrorTooltip(
            "Errore durante la richiesta di test dell'opportunità"
          );
        }
      }
    });
  const testDiscount = (discountId: string) => {
    testDiscountMutation.mutate({
      agreementId: agreement.id,
      discountId
    });
  };

  const entityType = agreement.entityType;

  const columnHelper = createColumnHelper<Discount>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Nome opportunità",
      sortingFn: "alphanumeric",
      cell: ({ getValue }) => (
        <div
          style={{
            whiteSpace: "normal",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            maxWidth: "calc(190px - 1.5rem)",
            maxHeight: "calc(56px - 0.5rem)",
            overflow: "hidden",
            wordBreak: "break-all"
          }}
        >
          {getValue()}
        </div>
      )
    }),
    columnHelper.accessor("startDate", {
      header: "Aggiunta il",
      cell: ({ getValue }) => {
        const v = getValue();
        return <span>{v ? format(new Date(v), "dd/MM/yyyy") : "-"}</span>;
      }
    }),
    columnHelper.accessor("state", {
      header: "Stato",
      enableSorting: false,
      cell: ({ getValue }) => (
        <span>
          <DiscountComponent discountState={getValue()} />
        </span>
      )
    }),
    columnHelper.display({
      id: "visibile",
      header: "Visibile",
      enableSorting: false,
      cell: ({ row }) => <IsVisible discount={row.original} />
    }),
    columnHelper.display({
      id: "expander",
      header: () => null,
      enableSorting: false,
      size: 48,
      cell: ({ row }) => <ExpanderCell row={row} />
    })
  ];

  const pageCount = Math.ceil((discounts.length ?? 0) / pagination.pageSize);
  const tableInstance = useReactTable({
    state: {
      pagination
    },
    columns,
    data: discounts,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const { canPreviousPage, canNextPage, previousPage, nextPage, gotoPage } =
    usePaginationHelpers(tableInstance);

  const startRowIndex =
    tableInstance.getState().pagination.pageIndex *
      tableInstance.getState().pagination.pageSize +
    1;

  const endRowIndex = Math.min(
    (tableInstance.getState().pagination.pageIndex + 1) *
      tableInstance.getState().pagination.pageSize,
    discounts.length
  );
  const pageArray = Array.from(Array(pageCount).keys());

  const headerGroups = tableInstance.getHeaderGroups();
  const MAX_PUBLISHED_DISCOUNTS = 5;
  const maxPublishedDiscountsReached =
    discounts.filter(discount => discount.state === "published").length >=
    MAX_PUBLISHED_DISCOUNTS;

  return (
    <Box sx={{ mt: 1, px: 4, py: 5, backgroundColor: "white" }}>
      <div>
        <PublishModal
          isOpen={publishModal}
          onToggle={closeActionModal}
          isPending={publishDiscountMutation.isPending}
          actionRequest={() => {
            if (selectedDiscountAction) {
              publishDiscount(selectedDiscountAction.discountId);
            }
          }}
        />
        <UnpublishModal
          isOpen={unpublishModal}
          onToggle={closeActionModal}
          isPending={unpublishDiscountMutation.isPending}
          actionRequest={() => {
            if (selectedDiscountAction) {
              unpublishDiscount(selectedDiscountAction.discountId);
            }
          }}
        />
        <TestModal
          isOpen={testModal}
          onToggle={closeActionModal}
          isPending={testDiscountMutation.isPending}
          actionRequest={() => {
            if (selectedDiscountAction) {
              testDiscount(selectedDiscountAction.discountId);
            }
          }}
        />
        <DeleteModal
          isOpen={deleteModal}
          onToggle={closeActionModal}
          isPending={deleteDiscountMutation.isPending}
          actionRequest={() => {
            if (selectedDiscountAction) {
              deleteDiscount(selectedDiscountAction.discountId);
            }
          }}
        />
        <TestErrorModal
          isOpen={showTestBucketErrorModal}
          onClose={() => setShowTestBucketErrorModal(false)}
        />
      </div>
      {(agreement.state === AgreementState.ApprovedAgreement ||
        entityType === EntityType.Private) && (
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
            total={discounts.length}
          />
          <div>
            <table style={{ width: "100%" }}>
              <TableHeader headerGroups={headerGroups} />
              <tbody>
                {maxPublishedDiscountsReached && (
                  <tr>
                    <td
                      colSpan={tableInstance.getVisibleLeafColumns().length}
                      style={{ padding: "24px 32px" }}
                    >
                      <div
                        style={{
                          borderRadius: "4px",
                          borderLeft: "4px solid #FFCB46",
                          padding: "16px",
                          gap: "16px",
                          boxShadow:
                            "0px 1px 10px 0px #002B551A, 0px 4px 5px 0px #002B550D, 0px 2px 4px -1px #002B551A"
                        }}
                      >
                        <WarningAmberIcon sx={{ fill: "#FFCB46" }} />
                        <div style={{ fontSize: "16px", fontWeight: 600 }}>
                          Hai raggiunto il numero massimo di opportunità
                          pubblicate nello stesso momento
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {tableInstance.getRowModel().rows.map(row => (
                  <Fragment key={row.id}>
                    <tr onClick={() => row.toggleExpanded()}>
                      {row.getVisibleCells().map((cell, i) => (
                        <td
                          key={cell.id}
                          style={{
                            width:
                              cell.column.id === "expander"
                                ? "calc(32px + 0.75rem * 2)"
                                : undefined,
                            paddingTop: "0.5rem",
                            paddingBottom: "0.5rem",
                            paddingLeft: i === 0 ? "1.5rem" : "0.75rem",
                            paddingRight:
                              i === headerGroups[0].headers.length - 1
                                ? "1.5rem"
                                : "0.75rem",
                            borderBottom: "1px solid #D9E0E6",
                            fontSize: "0.875rem",
                            verticalAlign: "middle"
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>

                    {row.getIsExpanded() && (
                      <tr>
                        <td
                          colSpan={tableInstance.getVisibleLeafColumns().length}
                        >
                          <DiscountDetailRow
                            row={row}
                            agreement={agreement}
                            profile={profile}
                            onPublish={() =>
                              setSelectedDiscountAction({
                                action: "publish",
                                discountId: row.original.id
                              })
                            }
                            isPendingPublish={publishDiscountMutation.isPending}
                            isPendingUnpublish={
                              unpublishDiscountMutation.isPending
                            }
                            isPendingTest={testDiscountMutation.isPending}
                            isPendingDelete={deleteDiscountMutation.isPending}
                            onUnpublish={() =>
                              setSelectedDiscountAction({
                                action: "unpublish",
                                discountId: row.original.id
                              })
                            }
                            onDelete={() =>
                              setSelectedDiscountAction({
                                action: "delete",
                                discountId: row.original.id
                              })
                            }
                            onTest={() =>
                              setSelectedDiscountAction({
                                action: "test",
                                discountId: row.original.id
                              })
                            }
                            maxPublishedDiscountsReached={
                              maxPublishedDiscountsReached
                            }
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {agreement.state === AgreementState.ApprovedAgreement ? (
        <div>
          {discounts.length === 0 && (
            <div>Non è presente nessuna opportunità.</div>
          )}
          <div>
            <Link to={CREATE_DISCOUNT}>Nuova opportunità</Link>
          </div>
        </div>
      ) : (
        (() => {
          switch (entityType) {
            case EntityType.PublicAdministration:
              return (
                <div>
                  <p>
                    Non è presente nessuna opportunità.
                    <br />
                    Potrai creare nuove opportunità quando la convezione sarà
                    attiva.
                  </p>
                  <a
                    href="https://docs.pagopa.it/carta-giovani-nazionale/richiesta-di-convenzione/dati-delle-agevolazioni"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Scopri di più
                  </a>
                </div>
              );
          }
        })()
      )}
    </Box>
  );
};

export default Discounts;

function IsVisible({ discount }: { discount: Discount }) {
  const today = new Date();
  const isVisible =
    discount.state === "published" &&
    (compareAsc(today, new Date(discount.startDate)) === 1 ||
      compareAsc(today, new Date(discount.startDate)) === 0) &&
    (compareAsc(new Date(discount.endDate), today) === 1 ||
      compareAsc(new Date(discount.endDate), today) === 0);
  if (isVisible) {
    return (
      <span>
        <VisibilityIcon fontSize="small" />
        <span>SI</span>
      </span>
    );
  } else {
    return (
      <span>
        <VisibilityOffIcon fontSize="small" />
        <span>NO</span>
      </span>
    );
  }
}
