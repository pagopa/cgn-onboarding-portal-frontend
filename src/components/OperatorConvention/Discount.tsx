import React, { useMemo, useState } from "react";
import { Button } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { format } from "date-fns";
import { useTooltip, Severity } from "../../context/tooltip";
import Api from "../../api/backoffice";
import {
  ApprovedAgreementDiscount,
  ApprovedAgreementProfile
} from "../../api/generated_backoffice";
import {
  formatPercentage,
  makeProductCategoriesString
} from "../../utils/strings";
import Item from "./Item";
import { getBadgeStatus } from "./ConventionDetails";
import BucketCodeModal from "./BucketCodeModal";

const Discount = ({
  discount,
  agreementId,
  profile,
  reloadDetails
}: {
  discount: ApprovedAgreementDiscount;
  agreementId: string;
  profile: ApprovedAgreementProfile;
  reloadDetails: () => void;
}) => {
  const [suspendMode, setSuspendMode] = useState(false);
  const [suspendMessage, setSuspendMessage] = useState("");
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);

  const { triggerTooltip } = useTooltip();

  const toggleBucketModal = () => setIsBucketModalOpen(!isBucketModalOpen);

  const postSuspendDiscount = async () =>
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

  const suspendDiscount = () => {
    void postSuspendDiscount();
  };

  const postRejectTestDiscount = async () =>
    await tryCatch(
      () =>
        Api.Discount.setDiscountTestFailed(agreementId, discount.id, {
          reasonMessage: rejectMessage
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
              "La motivazione del fallimento del test dell'agevolazione è stata inviata con successo.",
            title: "Test respinto"
          });
          reloadDetails();
        }
      )
      .run();

  const rejectTest = () => {
    void postRejectTestDiscount();
  };

  const postApproveTestDiscount = async () =>
    await tryCatch(
      () => Api.Discount.setDiscountTestPassed(agreementId, discount.id),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        () => {
          triggerTooltip({
            severity: Severity.SUCCESS,
            text:
              "L'agevolazione ha superato il test ed è pronta per essere pubblicata dall'operatore",
            title: "Test superato"
          });
          reloadDetails();
        }
      )
      .run();

  const approveTest = () => {
    void postApproveTestDiscount();
  };

  const isSuspended = useMemo(() => discount.state === "suspended", [discount]);
  const isBucketCode = useMemo(
    () =>
      profile.salesChannel.channelType !== "OfflineChannel" &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      profile.salesChannel?.discountCodeType === "Bucket",
    [profile]
  );

  return (
    <div>
      <h5 className="mb-7 d-flex align-items-center font-weight-bold">
        Agevolazioni
      </h5>
      <Item label="Nome agevolazione" value={discount.name} />
      <Item label="Descrizione agevolazione" value={discount.description} />
      <Item label="Stato" value={getBadgeStatus(discount.state)} />
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
      {discount.staticCode && (
        <Item label="Codice sconto statico" value={discount.staticCode} />
      )}
      {discount.landingPageUrl && (
        <Item label="Landing page" value={discount.landingPageUrl} />
      )}
      {discount.landingPageReferrer && (
        <Item
          label="Codice sconto statico"
          value={discount.landingPageReferrer}
        />
      )}
      {isBucketCode && (
        <>
          <Item
            label="Lista di codici statici"
            value={
              <Button color="primary" size="xs" onClick={toggleBucketModal}>
                Mostra Codice
              </Button>
            }
          />
          <BucketCodeModal
            isOpen={isBucketModalOpen}
            toggle={toggleBucketModal}
            agreementId={agreementId}
            discountId={discount.id}
          />
        </>
      )}
      <Item
        label="Data ultima modifica"
        value={format(new Date(discount.lastUpateDate), "dd/MM/yyyy")}
      />
      <Item label="EYCA" value={discount.visibleOnEyca ? "Sì" : "No"} />
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
            onClick={suspendDiscount}
            disabled={!suspendMessage.length}
          >
            Invia sospensione
          </Button>
        </div>
      ) : (
        !isSuspended &&
        discount.state === "published" && (
          <div className="mt-5">
            <Button color="primary" onClick={() => setSuspendMode(true)}>
              Sospendi agevolazione
            </Button>
          </div>
        )
      )}
      {discount.state === "test_pending" && (
        <div className="mt-5 d-flex">
          <Button
            color="danger"
            className="mr-2"
            outline
            onClick={() => setRejectMode(true)}
          >
            Test fallito
          </Button>
          <Button color="primary" outline onClick={approveTest}>
            Test riuscito
          </Button>
        </div>
      )}
      {rejectMode && (
        <div className="mt-10">
          <h6 className="text-gray">Aggiungi commento</h6>
          <p>
            Inserisci il motivo per cui il test è da considerarsi fallito. Il
            commento sarà inviato all’operatore insieme all’esito.
          </p>
          <div className="form-group">
            <textarea
              id="rejectMessage"
              value={rejectMessage}
              onChange={e => setRejectMessage(e.target.value)}
              rows={5}
              maxLength={250}
              placeholder="Inserisci commento"
            />
          </div>
          <Button
            color="primary"
            outline
            tag="button"
            className="ml-4"
            onClick={() => {
              setRejectMode(false);
              setRejectMessage("");
            }}
          >
            Annulla
          </Button>
          <Button
            color="primary"
            tag="button"
            className="ml-4"
            onClick={rejectTest}
            disabled={!rejectMessage.length}
          >
            Invia esito
          </Button>
        </div>
      )}
    </div>
  );
};

export default Discount;
