import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Column, useExpanded, useSortBy, useTable } from "react-table";
import { Icon } from "design-react-kit";
import { Link } from "react-router-dom";
import { compareAsc, format } from "date-fns";
import { omit } from "lodash";
import { remoteData } from "../../api/common";
import { CREATE_DISCOUNT } from "../../navigation/routes";
import { RootState } from "../../store/store";
import { Severity, useTooltip } from "../../context/tooltip";
import { AgreementState, Discount, EntityType } from "../../api/generated";
import TableHeader from "../Table/TableHeader";
import PublishModal from "./PublishModal";
import { DeleteModal } from "./DeleteModal";
import DiscountDetailRow, { getDiscountComponent } from "./DiscountDetailRow";
import UnpublishModal from "./UnpublishModal";
import TestModal from "./TestModal";

const Discounts = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [selectedDiscountAction, setSelectedDiscountAction] = useState<{
    action: "publish" | "unpublish" | "test" | "delete";
    discountId: string;
  }>();
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

  const columns: Array<Column<Discount>> = useMemo(
    () => [
      {
        Header: "Nome opportunità",
        accessor: "name",
        sortType: "string",
        Cell({ row }) {
          return (
            <div
              style={{
                whiteSpace: "normal",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                width: "calc(190px - 1.5rem)",
                height: "calc(56px - 0.5rem)",
                overflow: "hidden",
                wordBreak: "break-all"
              }}
            >
              {row.original.name}
            </div>
          );
        }
      },
      {
        Header: "Aggiunta il",
        accessor: "startDate",
        Cell({ row }) {
          return (
            <span>{format(new Date(row.values.startDate), "dd/MM/yyyy")}</span>
          );
        }
      },
      {
        Header: "Stato",
        accessor: "state",
        Cell({ row }) {
          return <span>{getDiscountComponent(row.values.state)}</span>;
        },
        disableSortBy: true
      },
      {
        Header: "Visibile",
        Cell({ row }) {
          return <IsVisible discount={row.original} />;
        },
        disableSortBy: true
      },
      {
        Header: () => null,
        id: "expander",
        Cell({ row }) {
          return (
            <span {...omit(row.getToggleRowExpandedProps(), "onClick")}>
              {row.isExpanded ? (
                <Icon icon="it-expand" color="primary" />
              ) : (
                <Icon icon="it-collapse" color="primary" />
              )}
            </span>
          );
        }
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns
  } = useTable<Discount>({ columns, data: discounts }, useSortBy, useExpanded);

  const MAX_PUBLISHED_DISCOUNTS = 5;
  const maxPublishedDiscountsReached =
    discounts.filter(discount => discount.state === "published").length >=
    MAX_PUBLISHED_DISCOUNTS;

  return (
    <div>
      <div>
        <PublishModal
          isOpen={publishModal}
          toggle={closeActionModal}
          publish={() => {
            if (selectedDiscountAction) {
              publishDiscount(selectedDiscountAction.discountId);
            }
          }}
          profile={profile}
        />
        <UnpublishModal
          isOpen={unpublishModal}
          toggle={closeActionModal}
          unpublish={() => {
            if (selectedDiscountAction) {
              unpublishDiscount(selectedDiscountAction.discountId);
            }
          }}
        />
        <TestModal
          isOpen={testModal}
          toggle={closeActionModal}
          testRequest={() => {
            if (selectedDiscountAction) {
              testDiscount(selectedDiscountAction.discountId);
            }
          }}
        />
        <DeleteModal
          isOpen={deleteModal}
          onToggle={closeActionModal}
          onDelete={() => {
            if (selectedDiscountAction) {
              deleteDiscount(selectedDiscountAction.discountId);
            }
          }}
        />
      </div>
      {(agreement.state === AgreementState.ApprovedAgreement ||
        entityType === EntityType.Private) && (
        <table
          {...getTableProps()}
          style={{ width: "100%" }}
          className="mt-2 bg-white"
        >
          <TableHeader headerGroups={headerGroups} />
          <tbody {...getTableBodyProps()}>
            {maxPublishedDiscountsReached && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "24px 32px" }}
                  className="border-bottom"
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
                    className="d-flex flex-row align-items-center"
                  >
                    <Icon
                      icon="it-warning-circle"
                      style={{ fill: "#FFCB46" }}
                    />
                    <div style={{ fontSize: "16px", fontWeight: 600 }}>
                      Hai raggiunto il numero massimo di opportunità pubblicate
                      nello stesso momento
                    </div>
                  </div>
                </td>
              </tr>
            )}
            {rows.map(row => {
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
                        key={i}
                        style={
                          cell.column.id === "expander"
                            ? { width: "calc(32px + 0.75rem * 2)" }
                            : {}
                        }
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                  {row.isExpanded ? (
                    <tr className="px-8 py-4 border-bottom text-sm fw-normal text-black">
                      <td colSpan={visibleColumns.length}>
                        {
                          <DiscountDetailRow
                            row={row}
                            agreement={agreement}
                            profile={profile}
                            onPublish={() => {
                              setSelectedDiscountAction({
                                action: "publish",
                                discountId: row.original.id
                              });
                            }}
                            onUnpublish={() => {
                              setSelectedDiscountAction({
                                action: "unpublish",
                                discountId: row.original.id
                              });
                            }}
                            onDelete={() => {
                              setSelectedDiscountAction({
                                action: "delete",
                                discountId: row.original.id
                              });
                            }}
                            onTest={() => {
                              setSelectedDiscountAction({
                                action: "test",
                                discountId: row.original.id
                              });
                            }}
                            maxPublishedDiscountsReached={
                              maxPublishedDiscountsReached
                            }
                          />
                        }
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}
      {agreement.state === AgreementState.ApprovedAgreement ? (
        <div className="bg-white px-8 pt-10 pb-10 flex align-items-center flex-column">
          {discounts.length === 0 && (
            <div className="text-center text-gray pb-10">
              Non è presente nessuna opportunità.
            </div>
          )}
          <div className="text-center">
            <Link to={CREATE_DISCOUNT} className="btn btn-outline-primary">
              Nuova opportunità
            </Link>
          </div>
        </div>
      ) : (
        (() => {
          switch (entityType) {
            case EntityType.PublicAdministration:
              return (
                <div className="bg-white px-8 pt-10 pb-10 flex d-flex justify-content-center flex-column align-items-center">
                  <p className="text-center m-10">
                    Non è presente nessuna opportunità.
                    <br />
                    Potrai creare nuove opportunità quando la convezione sarà
                    attiva.
                  </p>
                  <a
                    href="https://docs.pagopa.it/carta-giovani-nazionale/richiesta-di-convenzione/dati-delle-agevolazioni"
                    className="btn btn-outline-primary m-8"
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
    </div>
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
      <span className="d-flex flex-row align-items-center">
        <Icon icon="it-password-visible" size="sm" className="me-1" />
        <span className="text-base fw-normal text-gray">SI</span>
      </span>
    );
  } else {
    return (
      <span className="d-flex flex-row align-items-center">
        <Icon icon="it-password-invisible" size="sm" className="me-1" />
        <span className="text-base fw-normal text-gray">NO</span>
      </span>
    );
  }
}
