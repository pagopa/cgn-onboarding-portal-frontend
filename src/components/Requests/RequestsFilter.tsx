import { debounce } from "lodash";
import { useMemo } from "react";
import DateModal from "./DateModal";
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
  const setProfileFullNameDebounced = useMemo(
    () =>
      debounce(
        (profileFullName: string) => {
          onChange(values => ({
            ...values,
            profileFullName
          }));
        },
        1000,
        {
          leading: false,
          trailing: true,
          maxWait: 5000
        }
      ),
    [onChange]
  );
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
            requestDateFrom={values.requestDateFrom}
            requestDateTo={values.requestDateTo}
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
            onChange={event => {
              setProfileFullNameDebounced(event.currentTarget.value);
            }}
            style={{ maxWidth: "275px" }}
          />
        </div>
      </div>
    </form>
  );
}

export default RequestsFilter;
