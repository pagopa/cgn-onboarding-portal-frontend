/* eslint-disable sonarjs/cognitive-complexity */

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Column, useExpanded, useSortBy, useTable } from "react-table";
import { Button, Icon } from "design-react-kit";
import { Link } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { compareAsc, format } from "date-fns";
import { omit } from "lodash";
import { remoteData } from "../../api/common";
import { CREATE_DISCOUNT } from "../../navigation/routes";
import { RootState } from "../../store/store";
import { Severity, useTooltip } from "../../context/tooltip";
import { AgreementState, Discount, EntityType } from "../../api/generated";
import TableHeader from "../Table/TableHeader";
import PublishModal from "./PublishModal";
import DiscountDetailRow, { getDiscountComponent } from "./DiscountDetailRow";
import UnpublishModal from "./UnpublishModal";
import TestModal from "./TestModal";

const Discounts = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [selectedDiscount, setSelectedDiscount] = useState<any>();
  const [publishModal, setPublishModal] = useState(false);
  const [unpublishModal, setUnpublishModal] = useState(false);
  const [testModal, setTestModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const togglePublishModal = () => setPublishModal(!publishModal);
  const toggleUnpublishModal = () => setUnpublishModal(!unpublishModal);
  const toggleTestModal = () => setTestModal(!testModal);
  const [selectedPublish, setSelectedPublish] = useState<any>();
  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = (e: string) => {
    triggerTooltip({
      severity: Severity.DANGER,
      text: e
    });
  };

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
  }, []);
  const discounts = useMemo(() => discountsQuery.data?.items ?? [], [
    discountsQuery.data?.items
  ]);
  const invalidateDiscountsQuery = (
    data: unknown,
    { agreementId }: { agreementId: string }
  ) => {
    remoteData.Index.Discount.getDiscounts.invalidateQueries({
      agreementId
    });
  };

  const deleteDiscountMutation = remoteData.Index.Discount.deleteDiscount.useMutation(
    {
      onSuccess: invalidateDiscountsQuery,
      onError() {
        throwErrorTooltip("Errore nella cancellazione dell'opportunità");
      }
    }
  );
  const deleteDiscount = () => {
    deleteDiscountMutation.mutate({
      agreementId: agreement.id,
      discountId: selectedDiscount
    });
  };

  const publishDiscountMutation = remoteData.Index.Discount.publishDiscount.useMutation(
    {
      onSuccess: invalidateDiscountsQuery,
      onError(error) {
        if (error.status === 409) {
          throwErrorTooltip("Upload codici ancora in corso");
        } else {
          throwErrorTooltip("Errore durante la pubblicazione dell'opportunità");
        }
      }
    }
  );
  const publishDiscount = (discountId: string) => {
    publishDiscountMutation.mutate({
      agreementId: agreement.id,
      discountId
    });
  };

  const unpublishDiscountMutation = remoteData.Index.Discount.unpublishDiscount.useMutation(
    {
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
    }
  );

  const unpublishDiscount = (discountId: string) => {
    unpublishDiscountMutation.mutate({
      agreementId: agreement.id,
      discountId
    });
  };

  const testDiscountMutation = remoteData.Index.Discount.testDiscount.useMutation(
    {
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
    }
  );
  const testDiscount = (discountId: string) => {
    testDiscountMutation.mutate({
      agreementId: agreement.id,
      discountId
    });
  };

  const isVisible = (state: any, startDate: any, endDate: any) => {
    const today = new Date();
    return (
      state === "published" &&
      (compareAsc(today, new Date(startDate)) === 1 ||
        compareAsc(today, new Date(startDate)) === 0) &&
      (compareAsc(new Date(endDate), today) === 1 ||
        compareAsc(new Date(endDate), today) === 0)
    );
  };

  const getVisibleComponent = (isVisible: boolean) => {
    if (isVisible) {
      return (
        <span className="d-flex flex-row align-items-center">
          <Icon icon="it-password-visible" size="sm" className="mr-1" />
          <span className="text-base font-weight-normal text-gray">SI</span>
        </span>
      );
    } else {
      return (
        <span className="d-flex flex-row align-items-center">
          <Icon icon="it-password-invisible" size="sm" className="mr-1" />
          <span className="text-base font-weight-normal text-gray">NO</span>
        </span>
      );
    }
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
          return getVisibleComponent(
            isVisible(
              row.original.state,
              row.original.startDate,
              row.original.endDate
            )
          );
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
          toggle={togglePublishModal}
          publish={() => publishDiscount(selectedPublish)}
          profile={profile}
        />
        <UnpublishModal
          isOpen={unpublishModal}
          toggle={toggleUnpublishModal}
          unpublish={() => unpublishDiscount(selectedDiscount)}
        />
        <TestModal
          isOpen={testModal}
          toggle={toggleTestModal}
          testRequest={() => testDiscount(selectedDiscount)}
        />
        <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
          <ModalHeader toggle={toggleDeleteModal}>
            Elimina opportunità
          </ModalHeader>
          <ModalBody>
            Sei sicuro di voler eliminare questa opportunità?
          </ModalBody>
          <ModalFooter className="d-flex flex-column">
            <Button
              color="primary"
              onClick={() => {
                void deleteDiscount();
                toggleDeleteModal();
              }}
              style={{ width: "100%" }}
            >
              Elimina
            </Button>{" "}
            <Button
              color="primary"
              outline
              onClick={toggleDeleteModal}
              style={{ width: "100%" }}
            >
              Annulla
            </Button>
          </ModalFooter>
        </Modal>
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
                <React.Fragment key={row.getRowProps().key}>
                  <tr
                    className="cursor-pointer"
                    onClick={() => row.toggleRowExpanded()}
                  >
                    {row.cells.map((cell, i) => (
                      // eslint-disable-next-line react/jsx-key
                      <td
                        className={`
                        ${i === 0 ? "pl-6" : ""}
                        ${i === headerGroups.length - 1 ? "pr-6" : ""}
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
                    <tr className="px-8 py-4 border-bottom text-sm font-weight-normal text-black">
                      <td colSpan={visibleColumns.length}>
                        {
                          <DiscountDetailRow
                            row={row}
                            agreement={agreement}
                            profile={profile}
                            onPublish={() => {
                              setSelectedPublish(row.original.id);
                              togglePublishModal();
                            }}
                            onUnpublish={() => {
                              setSelectedDiscount(row.original.id);
                              toggleUnpublishModal();
                            }}
                            onDelete={() => {
                              setSelectedDiscount(row.original.id);
                              toggleDeleteModal();
                            }}
                            onTest={() => {
                              setSelectedDiscount(row.original.id);
                              toggleTestModal();
                            }}
                            maxPublishedDiscountsReached={
                              maxPublishedDiscountsReached
                            }
                          />
                        }
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
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
