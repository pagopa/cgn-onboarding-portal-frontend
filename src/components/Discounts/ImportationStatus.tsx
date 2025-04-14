import React, { CSSProperties, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Icon, Progress } from "design-react-kit";
import { BucketCodeLoadStatus } from "../../api/generated";
import { Severity, useTooltip } from "../../context/tooltip";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading";
import { EDIT_DISCOUNT } from "../../navigation/routes";

type Props = {
  discountId: string;
  agreementId: string;
  status: BucketCodeLoadStatus;
  onPollingComplete: () => void;
};

type ImportationStatusType = "EXHAUSTED" | BucketCodeLoadStatus;

const styles: Record<string, CSSProperties> = {
  container: {
    filter: "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))",
    position: "relative",
    borderRadius: "4px",
    border: "1px solid #FFFF",
    borderLeftWidth: "4px",
    borderLeftColor: "#EA7614",
    padding: "1rem 1rem",
    marginBottom: "1rem"
  }
};

const getRenderAttributesByState = (
  status: ImportationStatusType,
  discountId: string
): { title: string; body: React.ReactElement } => {
  switch (status) {
    case "EXHAUSTED":
      return {
        title: "È NECESSARIO CARICARE NUOVI CODICI SCONTO",
        body: (
          <>
            Abbiamo riscontrato un problema nell’importazione dei codici sui
            nostri sistemi.{" "}
            <Link
              to={EDIT_DISCOUNT.replace(":discountId", discountId)}
              className="font-weight-semibold"
            >
              Aggiungi codici
            </Link>
          </>
        )
      };
    case BucketCodeLoadStatus.Running:
    case BucketCodeLoadStatus.Pending:
      return {
        title: "L’ELABORAZIONE DEI CODICI NON È COMPLETA",
        body: (
          <>
            Potrai pubblicare l’opportunità solo quando avremo importato tutti i
            codici sui nostri sistemi. Torna a trovarci
          </>
        )
      };
    case BucketCodeLoadStatus.Failed:
      return {
        title: "L’ELABORAZIONE DEI CODICI NON È ANDATA A BUON FINE",
        body: (
          <>
            E’ stata raggiunta la soglia minima di codici sconti per questa
            opportunità. Ad esaurimento dei codici sconto l’opportunità non sarà
            più visibile in app.{" "}
            <Link
              to={EDIT_DISCOUNT.replace(":discountId", discountId)}
              className="font-weight-semibold"
            >
              Riprova
            </Link>
          </>
        )
      };
    default:
      return {
        title: "",
        body: <></>
      };
  }
};

const ImportationStatus = ({
  onPollingComplete,
  status,
  agreementId,
  discountId
}: Props) => {
  const shouldBeRendered = status !== BucketCodeLoadStatus.Finished;

  const { title, body } = useMemo(
    () => getRenderAttributesByState(status, discountId),
    [status, discountId]
  );

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

  const loadingProgressQuery =
    remoteData.Index.DiscountBucketLoadingProgress.getDiscountBucketCodeLoadingProgess.useQuery(
      { agreementId, discountId },
      {
        enabled:
          status === BucketCodeLoadStatus.Pending ||
          status === BucketCodeLoadStatus.Running,
        refetchInterval: 5000
      }
    );
  useEffect(() => {
    if (loadingProgressQuery.error) {
      throwErrorTooltip("Errore nel recuperare lo stato di caricamento codici");
    }
  }, [loadingProgressQuery.error, throwErrorTooltip]);
  const progress =
    Math.round((loadingProgressQuery.data?.percent ?? 0) * 100) / 100;

  useEffect(() => {
    if (progress === 100) {
      onPollingComplete();
    }
  }, [onPollingComplete, progress]);

  if (!shouldBeRendered) {
    return null;
  }

  if (loadingProgressQuery.isLoading) {
    return <CenteredLoading />;
  }

  return (
    <div style={styles.container} className="row bg-white">
      <div className="col-1">
        <Icon icon="it-warning-circle" style={{ fill: "#EA7614" }} />
      </div>
      <div className="col">
        <h6>{title}</h6>
        <p style={{ color: "#5C6F82" }}>{body}</p>
      </div>
      {(status === BucketCodeLoadStatus.Pending ||
        status === BucketCodeLoadStatus.Running) && (
        <div className="col-12">
          <div className="pt-3">
            <Progress
              value={progress}
              label="progresso"
              role="progressbar"
              tag="div"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportationStatus;
