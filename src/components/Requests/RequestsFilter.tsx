import DateModal from "../DateModal";
import StateModal from "./StateModal";
import { RequestsFilterFormValues } from "./Requests";

function RequestsFilter({
  values,
  onChange,
  onReset,
  isDirty
}: {
  values: RequestsFilterFormValues;
  onChange(
    update:
      | RequestsFilterFormValues
      | ((values: RequestsFilterFormValues) => void)
  ): void;
  onReset(): void;
  isDirty: boolean;
}) {
  return (
    <form>
      <div className="d-flex justify-content-between">
        {isDirty ? (
          <h2 className="h4 fw-bold text-dark-blue">
            Risultati della ricerca
            <span
              className="primary-color ms-2 text-sm fw-regular cursor-pointer"
              onClick={() => {
                onReset();
              }}
            >
              Esci
            </span>
          </h2>
        ) : (
          <h2 className="h4 fw-bold text-dark-blue">
            Richieste di convenzione
          </h2>
        )}

        <div className="d-flex justify-content-end flex-grow-1 flex-wrap">
          <DateModal
            label="Data"
            title="Filtra per data"
            from={values.requestDateFrom}
            to={values.requestDateTo}
            onSubmit={(requestDateFrom, requestDateTo) => {
              onChange(values => ({
                ...values,
                requestDateFrom,
                requestDateTo
              }));
            }}
          />

          <StateModal
            states={values.states}
            onSubmit={states => {
              onChange(values => ({
                ...values,
                states
              }));
            }}
          />

          <input
            id="profileFullName"
            name="profileFullName"
            type="text"
            placeholder="Cerca Richiesta"
            value={values.profileFullName || ""}
            onChange={event => {
              const profileFullName = event.currentTarget.value;
              onChange(values => ({
                ...values,
                profileFullName
              }));
            }}
            style={{ maxWidth: "275px" }}
          />
        </div>
      </div>
    </form>
  );
}

export default RequestsFilter;
