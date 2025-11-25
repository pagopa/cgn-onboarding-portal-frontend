import { format } from "date-fns";
import { useState } from "react";
import { remoteData } from "../../api/common";
import {
  ApprovedAgreementDiscount,
  ApprovedAgreementProfile
} from "../../api/generated_backoffice";
import { Severity, useTooltip } from "../../context/tooltip";
import {
  formatPercentage,
  makeProductCategoriesString
} from "../../utils/strings";
import { getDiscountTypeChecks } from "../../utils/formChecks";
import Button from "../Button/Button";
import BucketCodeModal from "./BucketCodeModal";
import { BadgeStatus } from "./BadgeStatus";
import Item from "./Item";

type DiscountResultButtonsProps = {
  discount: ApprovedAgreementDiscount;
  setRejectMode: (value: boolean) => void;
  approveTest: () => void;
  rejectMode: boolean;
  approveDiscountIsPending: boolean;
};

type RejectProps = {
  rejectMessage: string;
  setRejectMessage: (value: string) => void;
  setRejectMode: (value: boolean) => void;
  rejectTest: () => void;
  isPending: boolean;
};

type Props = {
  discount: ApprovedAgreementDiscount;
  agreementId: string;
  profile: ApprovedAgreementProfile;
  reloadDetails: () => void;
};

function Reject({
  rejectMessage,
  setRejectMessage,
  setRejectMode,
  rejectTest,
  isPending
}: RejectProps) {
  return (
    <div className="mt-10">
      <h6 className="text-gray">Aggiungi commento</h6>
      <p>
        Inserisci il motivo per cui il test è da considerarsi fallito. Il
        commento sarà inviato all’operatore insieme all’esito.
      </p>
      <div className="mb-12">
        <textarea
          id="rejectMessage"
          value={rejectMessage}
          onChange={e => setRejectMessage(e.target.value)}
          rows={5}
          maxLength={250}
          placeholder="Inserisci commento"
          className="form-control"
        />
      </div>
      <Button
        color="primary"
        outline
        className="ms-4"
        onClick={() => {
          setRejectMode(false);
          setRejectMessage("");
        }}
      >
        Annulla
      </Button>
      <Button
        color="primary"
        className="ms-4"
        onClick={rejectTest}
        disabled={!rejectMessage.length}
        isPending={isPending}
      >
        Invia esito
      </Button>
    </div>
  );
}

function DiscountResultButtons({
  discount,
  setRejectMode,
  approveTest,
  rejectMode,
  approveDiscountIsPending
}: DiscountResultButtonsProps) {
  return (
    discount.state === "test_pending" && (
      <div className="mt-5 d-flex">
        <Button
          color="danger"
          className="me-2"
          outline
          onClick={() => setRejectMode(true)}
        >
          Test fallito
        </Button>
        <Button
          color="primary"
          outline
          onClick={approveTest}
          disabled={rejectMode}
          isPending={approveDiscountIsPending}
        >
          Test riuscito
        </Button>
      </div>
    )
  );
}

const Discount = ({ discount, agreementId, profile, reloadDetails }: Props) => {
  const [suspendMode, setSuspendMode] = useState(false);
  const [suspendMessage, setSuspendMessage] = useState("");
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);

  const { triggerTooltip } = useTooltip();

  const toggleBucketModal = () => setIsBucketModalOpen(!isBucketModalOpen);

  const suspendDiscountMutation =
    remoteData.Backoffice.Discount.suspendDiscount.useMutation({
      onSuccess() {
        setSuspendMode(false);
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La sospensione dell'opportunità è stata effettuata con successo.",
          title: "sospensione effettuata"
        });
        reloadDetails();
      }
    });
  const suspendDiscount = () => {
    suspendDiscountMutation.mutate({
      agreementId,
      discountId: discount.id,
      suspension: {
        reasonMessage: suspendMessage
      }
    });
  };
  const rejectDiscountMutation =
    remoteData.Backoffice.Discount.setDiscountTestFailed.useMutation({
      onSuccess() {
        setRejectMode(false);
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La motivazione del fallimento del test dell'opportunità è stata inviata con successo.",
          title: "Test respinto"
        });
        reloadDetails();
      }
    });
  const rejectTest = () => {
    rejectDiscountMutation.mutate({
      agreementId,
      discountId: discount.id,
      failure: {
        reasonMessage: rejectMessage
      }
    });
  };

  const approveDiscountMutation =
    remoteData.Backoffice.Discount.setDiscountTestPassed.useMutation({
      onSuccess() {
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "L'opportunità ha superato il test ed è pronta per essere pubblicata dall'operatore",
          title: "Test superato"
        });
        reloadDetails();
      }
    });
  const approveTest = () => {
    approveDiscountMutation.mutate({
      agreementId,
      discountId: discount.id
    });
  };

  const isSuspended = discount.state === "suspended";
  const isBucketCode =
    profile.salesChannel.channelType !== "OfflineChannel" &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile.salesChannel?.discountCodeType === "Bucket";

  const { checkLanding } = getDiscountTypeChecks(profile);

  return (
    <div>
      <h5 className="mb-7 d-flex align-items-center fw-bold">Opportunità</h5>
      <Item label="Nome opportunità" value={discount.name} />
      <Item label="Descrizione opportunità" value={discount.description} />
      <Item
        label="Stato"
        value={<BadgeStatus discountState={discount.state} />}
      />
      <Item
        label="Data d'inizio opportunità"
        value={format(new Date(discount.startDate), "dd/MM/yyyy")}
      />
      <Item
        label="Data di fine opportunità"
        value={format(new Date(discount.endDate), "dd/MM/yyyy")}
      />
      <Item
        label="Entità dello sconto"
        value={formatPercentage(discount.discount)}
      />
      <div className="row mb-5">
        <div className="col-4 text-gray">Categorie merceologiche</div>
        <div className="col-8">
          {makeProductCategoriesString(discount.productCategories).map(
            (productCategory, index) =>
              productCategory ? <p key={index}>{productCategory}</p> : null
          )}
        </div>
      </div>
      <Item label="Condizioni dell'opportunità" value={discount.condition} />
      {discount.discountUrl && !checkLanding && (
        <Item
          label="Link all'opportunità"
          value={
            <a href={discount.discountUrl} target="_blank" rel="noreferrer">
              {discount.discountUrl}
            </a>
          }
        />
      )}
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        profile.salesChannel?.discountCodeType === "API" && (
          <div className="row mb-5">
            <div className="col-4 text-gray">
              Per testare questa opportunità, contatta PagoPA
            </div>
          </div>
        )
      }
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        profile.salesChannel?.discountCodeType === "LandingPage" && (
          <div className="row mb-5">
            <div className="text-gray">
              Per testare questa opportunità, usa il Playground CGN presente in
              app IO
            </div>
          </div>
        )
      }
      {discount.staticCode && (
        <Item label="Codice sconto statico" value={discount.staticCode} />
      )}
      {discount.landingPageUrl && (
        <Item label="Landing page" value={discount.landingPageUrl} />
      )}
      {discount.landingPageReferrer && (
        <Item
          label="Landing page referer"
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
      {discount.eycaLandingPageUrl && (
        <Item
          label="Link EYCA"
          value={
            <a
              href={discount.eycaLandingPageUrl}
              target="_blank"
              rel="noreferrer"
            >
              {discount.eycaLandingPageUrl}
            </a>
          }
        />
      )}
      {suspendMode ? (
        <div className="mt-10">
          <h6 className="text-gray">Aggiungi una nota</h6>
          <p>
            Inserisci una nota di spiegazione riguardo al motivo per cui questa
            opportunità sarà sospesa. La nota sarà visibile all’operatore
          </p>
          <div className="mb-12">
            <textarea
              id="rejectMessage"
              value={suspendMessage}
              onChange={e => setSuspendMessage(e.target.value)}
              rows={5}
              maxLength={250}
              placeholder="Inserisci una descrizione"
              className="form-control"
            />
          </div>
          <Button
            color="primary"
            outline
            className="ms-4"
            onClick={() => {
              setSuspendMode(false);
              setSuspendMessage("");
            }}
          >
            Annulla
          </Button>
          <Button
            color="primary"
            className="ms-4"
            onClick={suspendDiscount}
            isPending={suspendDiscountMutation.isPending}
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
              Sospendi opportunità
            </Button>
          </div>
        )
      )}
      <DiscountResultButtons
        discount={discount}
        setRejectMode={setRejectMode}
        approveTest={approveTest}
        rejectMode={rejectMode}
        approveDiscountIsPending={approveDiscountMutation.isPending}
      />
      {rejectMode && (
        <Reject
          rejectMessage={rejectMessage}
          setRejectMessage={setRejectMessage}
          setRejectMode={setRejectMode}
          rejectTest={rejectTest}
          isPending={rejectDiscountMutation.isPending}
        />
      )}
    </div>
  );
};

export default Discount;
