import React, { useState } from "react";
import { Button } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { format } from "date-fns";
import { useTooltip, Severity } from "../../context/tooltip";
import Api from "../../api/backoffice";
import { ApprovedAgreementDiscount } from "../../api/generated_backoffice";
import {
  formatPercentage,
  makeProductCategoriesString
} from "../../utils/strings";
import Item from "./Item";

const Discount = ({
  discount,
  agreementId,
  reloadDetails
}: {
  discount: ApprovedAgreementDiscount;
  agreementId: string;
  reloadDetails: () => void;
}) => {
  const [suspendMode, setSuspendMode] = useState(false);
  const [suspendMessage, setSuspendMessage] = useState("");
  const { triggerTooltip } = useTooltip();

  const getConventionDetailsApi = async () =>
    await tryCatch(
      () =>
        Api.Discount.suspendDiscount(agreementId, discount.id, {
          reasonMessage: suspendMessage
        }),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        () => {
          triggerTooltip({
            severity: Severity.SUCCESS,
            text:
              "La sospensione dell'agevolazione è stata effettuata con successo.",
            title: "sospensione effettuata"
          });
          reloadDetails();
        }
      )
      .run();

  const getConventionDetails = () => {
    void getConventionDetailsApi();
  };

  const isSuspended = discount.state === "suspended";

  return (
    <div>
      <h5 className="mb-7 d-flex align-items-center font-weight-bold">
        Agevolazioni
        {isSuspended && (
          <span
            className="badge badge-warning ml-3"
            style={{ fontSize: "12px" }}
          >
            Sospesa
          </span>
        )}
      </h5>
      <div className="mb-5 font-weight-bold">{discount.name}</div>
      <Item label="Nome agevolazione" value={discount.name} />
      <Item label="Descrizione agevolazione" value={discount.description} />
      <Item
        label="Data di inizio dell'agevolazione"
        value={format(new Date(discount.startDate), "dd/MM/yyyy")}
      />
      <Item
        label="Data di fine agevolazione"
        value={format(new Date(discount.endDate), "dd/MM/yyyy")}
      />
      <Item
        label="Entità dello sconto"
        value={formatPercentage(discount.discount)}
      />
      <div className="row mb-5">
        <div className="col-4 text-gray">Categorie merceologiche</div>
        <div className="col-8">
          {makeProductCategoriesString(
            discount.productCategories
          ).map((productCategory, index) =>
            productCategory ? <p key={index}>{productCategory}</p> : null
          )}
        </div>
      </div>
      <Item label="Condizioni dell’agevolazione" value={discount.condition} />
      {discount.discountUrl && (
        <Item label="Link all’agevolazione" value={discount.discountUrl} />
      )}
      <Item
        label="Data ultima modifica"
        value={format(new Date(discount.lastUpateDate), "dd/MM/yyyy")}
      />
      {suspendMode ? (
        <div className="mt-10">
          <h6 className="text-gray">Aggiungi una nota</h6>
          <p>
            Inserisci una nota di spiegazione riguardo al motivo per cui questa
            agevolazione sarà sospesa. La nota sarà visibile all’operatore
          </p>
          <div className="form-group">
            <textarea
              id="rejectMessage"
              value={suspendMessage}
              onChange={e => setSuspendMessage(e.target.value)}
              rows={5}
              maxLength={250}
              placeholder="Inserisci una descrizione"
            />
          </div>
          <Button
            color="primary"
            outline
            tag="button"
            className="ml-4"
            onClick={() => {
              setSuspendMode(false);
              setSuspendMessage("");
            }}
          >
            Annulla
          </Button>
          <Button
            color="primary"
            tag="button"
            className="ml-4"
            onClick={getConventionDetails}
            disabled={!suspendMessage.length}
          >
            Invia sospensione
          </Button>
        </div>
      ) : (
        !isSuspended && (
          <div className="mt-5">
            <Button color="primary" onClick={() => setSuspendMode(true)}>
              Sospendi agevolazione
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default Discount;
