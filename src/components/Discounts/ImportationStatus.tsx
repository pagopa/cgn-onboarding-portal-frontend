import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Progress } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { BucketCodeLoadStatus } from "../../api/generated";
import { Severity, useTooltip } from "../../context/tooltip";
import Api from "../../api";

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
              to={`/admin/operatori/agevolazioni/modifica/${discountId}`}
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
            Potrai pubblicare l’agevolazione solo quando avremo importato tutti
            i codici sui nostri sistemi. Torna a trovarci
          </>
        )
      };
    case BucketCodeLoadStatus.Failed:
      return {
        title: "L’ELABORAZIONE DEI CODICI NON È ANDATA A BUON FINE",
        body: (
          <>
            E’ stata raggiunta la soglia minima di codici sconti per questa
            agevolazione. Ad esaurimento dei codici sconto l’agevolazione non
            sarà più visibile in app.{" "}
            <Link
              to={`/admin/operatori/agevolazioni/modifica/${discountId}`}
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

const ImportationStatus = (props: Props) => {
  const [progress, setProgress] = useState(0);
  const [pollStarted, setPollStarted] = useState(false);
  const shouldBeRendered = props.status !== BucketCodeLoadStatus.Finished;

  const { title, body } = useMemo(
    () => getRenderAttributesByState(props.status, props.discountId),
    [props.status, props.discountId]
  );

  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = (e: string) => {
    triggerTooltip({
      severity: Severity.DANGER,
      text: e
    });
  };

  const getCodesStatus = async () =>
    await tryCatch(
      () =>
        Api.DiscountBucketLoadingProgress.getDiscountBucketCodeLoadingProgess(
          props.agreementId,
          props.discountId
        ),
      toError
    )
      .map(response => response.data.percent)
      .fold(
        _ =>
          throwErrorTooltip(
            "Errore nel recuperare lo stato di caricamento codici"
          ),
        p => setProgress(Math.round(p * 100) / 100)
      )
      .run();

  useEffect(() => {
    void getCodesStatus();
    if (
      props.status === BucketCodeLoadStatus.Pending ||
      props.status === BucketCodeLoadStatus.Running
    ) {
      const timer = setInterval(() => getCodesStatus(), 5000);
      setPollStarted(true);
      if (progress === 100) {
        props.onPollingComplete();
        clearInterval(timer);
      }

      return () => clearInterval(timer);
    }
  }, [props.status, progress]);

  return shouldBeRendered ? (
    <div style={styles.container} className="row bg-white">
      <div className="col-1">
        <Icon icon="it-warning-circle" style={{ fill: "#EA7614" }} />
      </div>
      <div className="col">
        <h6>{title}</h6>
        <p style={{ color: "#5C6F82" }}>{body}</p>
      </div>
      {(props.status === BucketCodeLoadStatus.Pending ||
        props.status === BucketCodeLoadStatus.Running) &&
        pollStarted && (
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
  ) : null;
};

export default ImportationStatus;
