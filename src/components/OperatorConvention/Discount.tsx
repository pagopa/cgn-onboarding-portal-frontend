import React, { useState } from "react";
import { Button } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";
import { useTooltip, Severity } from "../../context/tooltip";
import Api from "../../api/backoffice";
import { ApprovedAgreementDiscount } from "../../api/generated_backoffice";
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
      .fold(() => void 0, identity)
      .run();

  const getConventionDetails = () => {
    void getConventionDetailsApi().then(() => {
      triggerTooltip({
        severity: Severity.SUCCESS,
        text:
          "La sospensione dell'agevolazione è stata effettuata con successo.",
        title: "sospensione effettuata"
      });
      reloadDetails();
    });
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
        value={discount.startDate}
      />
      <Item label="Data di fine agevolazione" value={discount.endDate} />
      <Item label="Entità dello sconto" value={`${discount.discount} %`} />
      <Item
        label="Categorie merceologiche"
        value={discount.productCategories.toString()}
      />
      <Item label="Condizioni dell’agevolazione" value={discount.condition} />
      <Item label="Data ultima modifica" value={discount.lastUpateDate} />
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
