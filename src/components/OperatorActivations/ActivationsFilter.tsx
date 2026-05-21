import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <form>
      <div>
        {hasActiveFitlers ? (
          <h2>
            Risultati della ricerca
            <span onClick={onReset}>Esci</span>
          </h2>
        ) : (
          <h2>Impostazioni di accesso</h2>
        )}

        <div style={{ gap: "12px" }}>
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
            sx={{ ml: 2.5 }}
            color="primary"
            size="small"
            type="button"
            onClick={() => navigate(ADMIN_PANEL_ACCESSI_CREA)}
          >
            <span>Aggiungi operatore</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ActivationsFilter;
