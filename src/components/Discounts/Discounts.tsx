import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Column, useExpanded, useSortBy, useTable } from "react-table";
import { Button, Icon } from "design-react-kit";
import { Link } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { fromPredicate, tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { compareAsc, format } from "date-fns";
import { AxiosResponse } from "axios";
import Api from "../../api/index";
import { CREATE_DISCOUNT } from "../../navigation/routes";
import { RootState } from "../../store/store";
import { Severity, useTooltip } from "../../context/tooltip";
import { Discount } from "../../api/generated";
import PublishModal from "./PublishModal";
import DiscountDetailRow, { getDiscountComponent } from "./DiscountDetailRow";
import UnpublishModal from "./UnpublishModal";

const chainAxios = (response: AxiosResponse) =>
  fromPredicate(
    (_: AxiosResponse) => _.status === 200 || _.status === 204,
    (r: AxiosResponse) =>
      r.status === 409
        ? new Error("Upload codici ancora in corso")
        : new Error("Errore durante la pubblicazione dell'agevolazione")
  )(response);

const Discounts = () => {
  const [discounts, setDiscounts] = useState<ReadonlyArray<Discount>>([]);
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [selectedDiscount, setSelectedDiscount] = useState<any>();
  const [publishModal, setPublishModal] = useState(false);
  const [unpublishModal, setUnpublishModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const togglePublishModal = () => setPublishModal(!publishModal);
  const toggleUnpublishModal = () => setUnpublishModal(!unpublishModal);
  const [selectedPublish, setSelectedPublish] = useState<any>();
  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = (e: string) => {
    triggerTooltip({
      severity: Severity.DANGER,
      text: e
    });
  };

  const getDiscounts = async () =>
    await tryCatch(() => Api.Discount.getDiscounts(agreement.id), toError)
      .map(response => response.data.items)
      .fold(
        _ => throwErrorTooltip("Errore nel caricamento delle agevolazioni"),
        discounts => setDiscounts(discounts)
      )
      .run();

  const deleteDiscount = async () =>
    await tryCatch(
      () => Api.Discount.deleteDiscount(agreement.id, selectedDiscount),
      toError
    )
      .fold(
        _ => throwErrorTooltip("Errore nella cancellazione dell'agevolazione"),
        () =>
          setDiscounts(
            discounts.filter(
              (discount: any) => discount.id !== selectedDiscount
            )
          )
      )
      .run();

  const publishDiscount = async (discountId: string) =>
    await tryCatch(
      () => Api.Discount.publishDiscount(agreement.id, discountId),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        e => throwErrorTooltip(e.message),
        () => void getDiscounts()
      )
      .run();

  const unpublishDiscount = async (discountId: string) =>
    await tryCatch(
      () => Api.Discount.unpublishDiscount(agreement.id, discountId),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        e => throwErrorTooltip(e.message),
        () => void getDiscounts()
      )
      .run();

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

  useEffect(() => {
    void getDiscounts();
  }, []);

  const data = useMemo(() => [...discounts], [discounts]);
  const columns: Array<Column<Discount>> = useMemo(
    () => [
      {
        Header: "Nome agevolazione",
        accessor: "name",
        sortType: "string"
      },
      {
        Header: "Aggiunta il",
        accessor: "startDate",
        Cell: ({ row }: any) =>
          format(new Date(row.values.startDate), "dd/MM/yyyy")
      },
      {
        Header: "Stato",
        accessor: "state",
        Cell: ({ row }: any) => getDiscountComponent(row.values.state),
        disableSortBy: true
      },
      {
        Header: "Visibile",
        Cell: ({ row }: any) =>
          getVisibleComponent(
            isVisible(
              row.original.state,
              row.original.startDate,
              row.original.endDate
            )
          ),
        disableSortBy: true
      },
      {
        Header: () => null,
        id: "expander",
        Cell: ({ row }: any) => (
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns
  } = useTable({ columns, data }, useSortBy, useExpanded);

  return (
    <div>
      <div>
        <PublishModal
          isOpen={publishModal}
          toggle={togglePublishModal}
          publish={() => publishDiscount(selectedPublish)}
        />
        <UnpublishModal
          isOpen={unpublishModal}
          toggle={toggleUnpublishModal}
          unpublish={() => unpublishDiscount(selectedDiscount)}
        />
        <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
          <ModalHeader toggle={toggleDeleteModal}>
            Elimina agevolazione
          </ModalHeader>
          <ModalBody>
            Sei sicuro di voler eliminare questa agevolazione?
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
      <table
        {...getTableProps()}
        style={{ width: "100%" }}
        className="mt-2 bg-white"
      >
        <thead>
          {headerGroups.map(headerGroup => (
            // eslint-disable-next-line react/jsx-key
            <tr
              {...headerGroup.getHeaderGroupProps()}
              style={{
                backgroundColor: "#F8F9F9",
                borderBottom: "1px solid #5A6772"
              }}
            >
              {headerGroup.headers.map(column => (
                // eslint-disable-next-line react/jsx-key
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-2 text-sm font-weight-bold text-gray text-uppercase"
                >
                  <span className="d-flex flex-row align-items-center justify-items-between">
                    {column.render("Header")}
                    {
                      <span>
                        {column.canSort && (
                          <>
                            {column.isSorted ? (
                              <>
                                {column.isSortedDesc ? (
                                  <Icon
                                    icon="it-arrow-up-triangle"
                                    style={{ color: "#5C6F82" }}
                                  />
                                ) : (
                                  <Icon
                                    icon="it-arrow-down-triangle"
                                    style={{ color: "#5C6F82" }}
                                  />
                                )}
                              </>
                            ) : (
                              <Icon
                                icon="it-arrow-up-triangle"
                                style={{ color: "#5C6F82" }}
                              />
                            )}
                          </>
                        )}
                      </span>
                    }
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <React.Fragment key={row.getRowProps().key}>
                <tr>
                  {row.cells.map(cell => (
                    // eslint-disable-next-line react/jsx-key
                    <td
                      className="px-6 py-2 border-bottom text-sm"
                      {...cell.getCellProps()}
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
      {agreement.state === "ApprovedAgreement" && (
        <div className="bg-white px-8 pt-10 pb-10">
          <Link to={CREATE_DISCOUNT} className="btn btn-outline-primary">
            Nuova agevolazione
          </Link>
        </div>
      )}
    </div>
  );
};

export default Discounts;
