import { Button } from "design-react-kit";
import { useNavigate } from "react-router-dom";
import { ADMIN_PANEL_ACCESSI_CREA } from "../../navigation/routes";
import FilterBar from "../FilterBar";
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
    <FilterBar
      title="Impostazioni di accesso"
      hasActiveFilters={hasActiveFitlers}
      onReset={onReset}
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
        onClick={() => navigate(ADMIN_PANEL_ACCESSI_CREA)}
      >
        <span>Aggiungi operatore</span>
      </Button>
    </FilterBar>
  );
}

export default ActivationsFilter;
