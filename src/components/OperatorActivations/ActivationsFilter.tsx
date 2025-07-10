import { Button } from "design-react-kit";
import { useHistory } from "react-router-dom";
import { ADMIN_PANEL_ACCESSI_CREA } from "../../navigation/routes";
import { ActivationsFilterFormValues } from "./OperatorActivations";

function ActivationsFilter({
  values,
  onChange,
  onReset,
  hasActiveFitlers
}: {
  values: ActivationsFilterFormValues;
  onChange(
    update:
      | ActivationsFilterFormValues
      | ((values: ActivationsFilterFormValues) => ActivationsFilterFormValues)
  ): void;
  onReset(): void;
  hasActiveFitlers: boolean;
}) {
  const history = useHistory();

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
          <h2 className="h4 fw-bold text-dark-blue">Impostazioni di accesso</h2>
        )}

        <div
          className="d-flex justify-content-end flex-grow-1 flex-wrap"
          style={{ gap: "12px" }}
        >
          <input
            id="searchQuery"
            name="searchQuery"
            type="text"
            placeholder="Cerca Operatore"
            value={values.searchQuery || ""}
            onChange={event => {
              const searchQuery = event.currentTarget.value;
              onChange(values => ({
                ...values,
                searchQuery
              }));
            }}
            style={{ maxWidth: "275px" }}
          />
          <Button
            className="ms-5 btn-sm"
            color="primary"
            tag="button"
            onClick={() => history.push(ADMIN_PANEL_ACCESSI_CREA)}
          >
            <span>Aggiungi operatore</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ActivationsFilter;
