import { Button } from "design-react-kit";
import { href, useNavigate } from "react-router";
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
            onClick={() => {
              navigate(href("/admin/access/create"));
            }}
          >
            <span>Aggiungi operatore</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ActivationsFilter;
