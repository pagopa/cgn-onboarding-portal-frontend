import { format } from "date-fns";
import { useState } from "react";
import { Button, Box, Grid, Typography } from "@mui/material";
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
import AsyncButton from "../AsyncButton/AsyncButton";
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
    <Box sx={{ mt: 5 }}>
      <Typography
        variant="caption"
        sx={{ color: "#5C6F82", display: "block", mb: 0.5 }}
      >
        Aggiungi commento
      </Typography>
      <p>
        Inserisci il motivo per cui il test è da considerarsi fallito. Il
        commento sarà inviato all’operatore insieme all’esito.
      </p>
      <Box sx={{ mb: 6 }}>
        <textarea
          id="rejectMessage"
          value={rejectMessage}
          onChange={e => setRejectMessage(e.target.value)}
          rows={5}
          maxLength={250}
          placeholder="Inserisci commento"
        />
      </Box>
      <Button
        color="primary"
        variant="outlined"
        sx={{ ml: 2 }}
        type="button"
        onClick={() => {
          setRejectMode(false);
          setRejectMessage("");
        }}
      >
        Annulla
      </Button>
      <AsyncButton
        color="primary"
        sx={{ ml: 2 }}
        onClick={rejectTest}
        disabled={!rejectMessage.length}
        loading={isPending}
      >
        Invia esito
      </AsyncButton>
    </Box>
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
      <Box sx={{ mt: 2.5, display: "flex", gap: 1 }}>
        <Button
          color="error"
          sx={{ mr: 1 }}
          variant="outlined"
          type="button"
          onClick={() => setRejectMode(true)}
        >
          Test fallito
        </Button>
        <AsyncButton
          color="primary"
          variant="outlined"
          onClick={approveTest}
          disabled={rejectMode}
          loading={approveDiscountIsPending}
        >
          Test riuscito
        </AsyncButton>
      </Box>
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
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 3.5,
          display: "flex",
          alignItems: "center",
          fontWeight: "bold"
        }}
      >
        Opportunità
      </Typography>
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
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ color: "#5C6F82" }}>
            Categorie merceologiche
          </Typography>
        </Grid>
        <Grid item xs={8}>
          {makeProductCategoriesString(discount.productCategories).map(
            (productCategory, index) =>
              productCategory ? <p key={index}>{productCategory}</p> : null
          )}
        </Grid>
      </Grid>
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
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={4}>
              <Typography variant="body2" sx={{ color: "#5C6F82" }}>
                Per testare questa opportunità, contatta PagoPA
              </Typography>
            </Grid>
          </Grid>
        )
      }
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        profile.salesChannel?.discountCodeType === "LandingPage" && (
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: "#5C6F82" }}>
                Per testare questa opportunità, usa il Playground CGN presente
                in app IO
              </Typography>
            </Grid>
          </Grid>
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
              <Button
                type="button"
                color="primary"
                size="small"
                onClick={toggleBucketModal}
              >
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
        <Box sx={{ mt: 5 }}>
          <Typography
            variant="caption"
            sx={{ color: "#5C6F82", display: "block", mb: 0.5 }}
          >
            Aggiungi una nota
          </Typography>
          <p>
            Inserisci una nota di spiegazione riguardo al motivo per cui questa
            opportunità sarà sospesa. La nota sarà visibile all’operatore
          </p>
          <Box sx={{ mb: 6 }}>
            <textarea
              id="rejectMessage"
              value={suspendMessage}
              onChange={e => setSuspendMessage(e.target.value)}
              rows={5}
              maxLength={250}
              placeholder="Inserisci una descrizione"
            />
          </Box>
          <Button
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
            type="button"
            onClick={() => {
              setSuspendMode(false);
              setSuspendMessage("");
            }}
          >
            Annulla
          </Button>
          <AsyncButton
            color="primary"
            sx={{ ml: 2 }}
            onClick={suspendDiscount}
            loading={suspendDiscountMutation.isPending}
            disabled={!suspendMessage.length}
          >
            Invia sospensione
          </AsyncButton>
        </Box>
      ) : (
        !isSuspended &&
        discount.state === "published" && (
          <Box sx={{ mt: 2.5 }}>
            <Button
              type="button"
              color="primary"
              onClick={() => setSuspendMode(true)}
            >
              Sospendi opportunità
            </Button>
          </Box>
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
    </Box>
  );
};

export default Discount;
