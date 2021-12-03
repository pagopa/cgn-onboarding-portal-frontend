import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useExpanded, useSortBy, useTable } from "react-table";
import {
  Badge,
  Button,
  Callout,
  CalloutText,
  CalloutTitle,
  Icon
} from "design-react-kit";
import { Link, useHistory } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { fromPredicate, tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { compareAsc, format } from "date-fns";
import { AxiosResponse } from "axios";
import Api from "../../api/index";
import { CREATE_DISCOUNT } from "../../navigation/routes";
import ProfileItem from "../Profile/ProfileItem";
import {
  formatPercentage,
  makeProductCategoriesString
} from "../../utils/strings";
import { RootState } from "../../store/store";
import { Severity, useTooltip } from "../../context/tooltip";
import { BucketCodeLoadStatus } from "../../api/generated";
import PublishModal from "./PublishModal";
import ImportationStatus from "./ImportationStatus";

const chainAxios = (response: AxiosResponse) =>
  fromPredicate(
    (_: AxiosResponse) => _.status === 200 || _.status === 204,
    (r: AxiosResponse) =>
      r.status === 409
        ? new Error("Upload codici ancora in corso")
        : new Error("Errore durante la pubblicazione dell'agevolazione")
  )(response);

const Discounts = () => {
  const history = useHistory();
  const [discounts, setDiscounts] = useState<any>([]);
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [selectedDiscount, setSelectedDiscount] = useState<any>();
  const [publishModal, setPublishModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const togglePublishModal = () => setPublishModal(!publishModal);
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

  const getDiscountComponent = (state: string) => {
    switch (state) {
      case "draft":
        return (
          <Badge
            className="font-weight-normal"
            pill
            tag="span"
            style={{
              backgroundColor: "white",
              color: "#5C6F82",
              border: "1px solid #5C6F82"
            }}
          >
            Bozza
          </Badge>
        );

      case "published":
        return (
          <Badge className="font-weight-normal" color="primary" pill tag="span">
            Pubblicata
          </Badge>
        );

      case "suspended":
        return (
          <Badge
            className="font-weight-normal"
            pill
            tag="span"
            style={{
              backgroundColor: "#EA7614",
              border: "1px solid #EA7614",
              color: "white"
            }}
          >
            Sospesa
          </Badge>
        );

      case "expired":
        return (
          <Badge
            className="font-weight-normal"
            pill
            tag="span"
            style={{
              backgroundColor: "white",
              border: "1px solid #C02927",
              color: "#C02927"
            }}
          >
            Scaduta
          </Badge>
        );
    }
  };

  const getDiscountButtons = (row: any) => (
    <div
      className={
        row.original.state !== "suspended" && row.original.state !== "expired"
          ? "mt-10 d-flex flex-row justify-content-between"
          : "mt-10"
      }
    >
      <Button
        className="mr-4"
        color={row.original.state === "expired" ? "primary" : "secondary"}
        outline
        tag="button"
        onClick={() =>
          history.push(
            `/admin/operatori/agevolazioni/modifica/${row.original.id}`
          )
        }
      >
        <Icon
          icon={row.original.state !== "expired" ? "it-pencil" : "it-restore"}
          padding={false}
          size="sm"
          color={row.original.state === "expired" ? "primary" : ""}
        />
        <span>
          {row.original.state !== "expired" ? "Modifica" : "Riattiva"}
        </span>
      </Button>
      <Button
        color={row.original.state !== "expired" ? "primary" : "secondary"}
        className={row.original.state === "expired" ? "mr-4" : ""}
        outline
        icon
        tag="button"
        onClick={() => {
          setSelectedDiscount(row.original.id);
          toggleDeleteModal();
        }}
      >
        <Icon
          icon="it-delete"
          color={row.original.state !== "expired" ? "primary" : "secondary"}
          padding={false}
          size="sm"
        />{" "}
        Elimina
      </Button>
      {row.original.state !== "published" &&
        row.original.state !== "suspended" &&
        row.original.state !== "expired" && (
          <Button
            className="mr-4"
            color="primary"
            tag="button"
            onClick={() => {
              setSelectedPublish(row.original.id);
              togglePublishModal();
            }}
            disabled={
              row.original.lastBucketCodeLoadStatus !==
              BucketCodeLoadStatus.Finished
            }
          >
            <Icon
              icon={"it-external-link"}
              color="white"
              padding={false}
              size="sm"
            />{" "}
            <span>Pubblica</span>
          </Button>
        )}
    </div>
  );

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

  const data = useMemo(() => discounts, [discounts]);
  const columns = useMemo(
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

  const renderRowSubComponent = useCallback(
    ({ row }) => (
      <>
        <section className="px-6 py-4 bg-white">
          {row.original.state === "suspended" && (
            <Callout
              highlight
              tag="div"
              style={{
                borderLeftColor: "#ea7614"
              }}
            >
              <CalloutTitle tag="div" className="py-2 text-base text-black">
                Questa agevolazione è stata sospesa dal Dipartimento
              </CalloutTitle>
              <CalloutText
                bigText={false}
                tag="p"
                className="py-2 text-base text-dark-gray"
              >
                {row.original.suspendedReasonMessage}
              </CalloutText>
            </Callout>
          )}
          {row.original.lastBucketCodeFileUid !== null && (
            <ImportationStatus
              discountId={row.original.id}
              status={row.original.lastBucketCodeLoadStatus}
            />
          )}
          <h1 className="h5 font-weight-bold text-dark-blue">Dettagli</h1>
          <table className="table">
            <tbody>
              <ProfileItem
                label="Nome agevolazione"
                value={row.original.name}
              />
              {row.original.description && (
                <ProfileItem
                  label="Descrizione agevolazione"
                  value={row.original.description}
                />
              )}
              <tr>
                <td className={`px-0 text-gray border-bottom-0`}>
                  Stato Agevolazione
                </td>
                <td className={`border-bottom-0`}>
                  {getDiscountComponent(row.values.state)}
                </td>
              </tr>
              <ProfileItem
                label="Data di inizio dell'agevolazione"
                value={format(new Date(row.original.startDate), "dd/MM/yyyy")}
              />
              <ProfileItem
                label="Data di fine agevolazione"
                value={format(new Date(row.original.endDate), "dd/MM/yyyy")}
              />
              <ProfileItem
                label="Entità dello sconto"
                value={formatPercentage(row.original.discount)}
              />
              <tr>
                <td className={`px-0 text-gray border-bottom-0`}>
                  Categorie merceologiche
                </td>
                <td className={`border-bottom-0`}>
                  {makeProductCategoriesString(
                    row.original.productCategories
                  ).map((productCategory, index) => (
                    <p key={index}>{productCategory}</p>
                  ))}
                </td>
              </tr>
              {row.original.conditions && (
                <ProfileItem
                  label="Condizioni dell’agevolazione"
                  value={row.original.conditions}
                />
              )}
            </tbody>
          </table>
          {agreement.state === "ApprovedAgreement" && getDiscountButtons(row)}
        </section>
      </>
    ),
    [discounts]
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
                      {renderRowSubComponent({ row })}
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
