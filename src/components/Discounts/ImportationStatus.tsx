import React, { CSSProperties, useMemo } from "react";
import { Link } from "react-router-dom";
import { Icon } from "design-react-kit";
import { BucketCodeLoadStatus } from "../../api/generated";

type Props = {
  discountId: string;
  status: BucketCodeLoadStatus;
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
  const shouldBeRendered = props.status !== BucketCodeLoadStatus.Finished;

  const { title, body } = useMemo(
    () => getRenderAttributesByState(props.status, props.discountId),
    [props.status, props.discountId]
  );

  return shouldBeRendered ? (
    <div style={styles.container} className="row bg-white">
      <div className="col-1">
        <Icon icon="it-warning-circle" style={{ fill: "#EA7614" }} />
      </div>
      <div className="col">
        <h6>{title}</h6>
        <p style={{ color: "#5C6F82" }}>{body}</p>
      </div>
    </div>
  ) : null;
};

export default ImportationStatus;
