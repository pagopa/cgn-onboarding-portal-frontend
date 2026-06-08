import { useState } from "react";
import { Button } from "design-react-kit";
import { saveAs } from "file-saver";
import { remoteData } from "../../api/common";
import { Severity, useTooltip } from "../../context/tooltip";
import DateModal from "../DateModal";
import { ConventionFilterFormValues } from "./OperatorConvention";

type ConventionFilterProps = {
  values: ConventionFilterFormValues;
  onChange(
    update:
      | ConventionFilterFormValues
      | ((values: ConventionFilterFormValues) => ConventionFilterFormValues)
  ): void;
  onReset(): void;
  hasActiveFitlers: boolean;
};

const ConventionFilter = ({
  values,
  onChange,
  hasActiveFitlers,
  onReset
}: ConventionFilterProps) => {
  const { triggerTooltip } = useTooltip();
  const [downloadingAgreements, setDownloadingAgreements] = useState(false);
  const [downloadingEyca, setDownloadingEyca] = useState(false);

  const getExport = async () => {
    try {
      setDownloadingAgreements(true);
      const data = await remoteData.Backoffice.Exports.exportAgreements.method(
        undefined,
        {
          headers: {
            "Content-Type": "text/csv"
          },
          responseType: "arraybuffer"
        }
      );
      const blob = new Blob([data], { type: "text/csv" });
      const today = new Date();
      saveAs(blob, `${today.toISOString().split("T")[0]}_Esercenti CGN`);
    } catch {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Errore durante il download del file"
      });
    } finally {
      setDownloadingAgreements(false);
    }
  };

  const getExportEyca = async () => {
    try {
      setDownloadingEyca(true);
      const data =
        await remoteData.Backoffice.Exports.exportEycaDiscounts.method(
          undefined,
          {
            headers: {
              "Content-Type": "text/csv"
            },
            responseType: "arraybuffer"
          }
        );
      const blob = new Blob([data], { type: "text/csv" });
      const today = new Date();
      saveAs(blob, `${today.toISOString().split("T")[0]}_Opportunità Eyca`);
    } catch {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Errore durante il download del file"
      });
    } finally {
      setDownloadingEyca(false);
    }
  };

  return (
    <form>
      <div className="d-flex justify-content-between">
        {hasActiveFitlers ? (
          <h2 className="h4 fw-bold text-dark-blue">
            Risultati della ricerca
            <span
              className="primary-color ms-2 text-sm fw-regular cursor-pointer"
              onClick={onReset}
            >
              Esci
            </span>
          </h2>
        ) : (
          <h2 className="h4 fw-bold text-dark-blue">Operatori convenzionati</h2>
        )}

        <div className="d-flex justify-content-end flex-grow-1 flex-wrap align-items-center gap-4">
          <DateModal
            label="Data ultima modifica"
            title="Filtra per data di ultima modifica"
            from={values.lastUpdateDateFrom}
            to={values.lastUpdateDateTo}
            onSubmit={(lastUpdateDateFrom, lastUpdateDateTo) => {
              onChange({
                ...values,
                lastUpdateDateFrom,
                lastUpdateDateTo
              });
            }}
          />
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Cerca Operatore"
            onChange={event => {
              onChange(values => ({
                ...values,
                fullName: event.target.value
              }));
            }}
            style={{ maxWidth: "275px" }}
          />
          <Button
            className="btn-sm"
            color="primary"
            tag="button"
            onClick={getExport}
            disabled={downloadingAgreements}
          >
            <span>Export convenzioni</span>
          </Button>
          <Button
            className="btn-sm"
            color="primary"
            tag="button"
            onClick={getExportEyca}
            disabled={downloadingEyca}
          >
            <span>Export EYCA</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ConventionFilter;
