import DateModal from "../DateModal";
import FilterBar from "../FilterBar";
import StateModal from "./StateModal";
import { RequestsFilterFormValues } from "./Requests";

type RequestsFilterProps = {
  values: RequestsFilterFormValues;
  onChange(
    update:
      | RequestsFilterFormValues
      | ((values: RequestsFilterFormValues) => RequestsFilterFormValues)
  ): void;
  onReset(): void;
  hasActiveFitlers: boolean;
};

function RequestsFilter({
  values,
  onChange,
  onReset,
  hasActiveFitlers
}: RequestsFilterProps) {
  return (
    <FilterBar
      title="Richieste di convenzione"
      hasActiveFilters={hasActiveFitlers}
      onReset={onReset}
    >
      <div className="d-flex gap-4">
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
      </div>
      <input
        id="profileFullName"
        name="profileFullName"
        type="text"
        placeholder="Cerca Richiesta"
        value={values.profileFullName ?? ""}
        onChange={event => {
          const profileFullName = event.currentTarget.value;
          onChange(values => ({
            ...values,
            profileFullName
          }));
        }}
        style={{ maxWidth: "275px" }}
      />
    </FilterBar>
  );
}

export default RequestsFilter;
