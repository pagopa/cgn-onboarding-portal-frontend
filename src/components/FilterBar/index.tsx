import { ReactNode } from "react";

type FilterTitleProps = {
  title: string;
  hasActiveFilters: boolean;
  onReset: () => void;
};

const FilterTitle = ({
  title,
  hasActiveFilters,
  onReset
}: FilterTitleProps) => {
  if (!hasActiveFilters) {
    return <h2 className="h4 fw-bold text-dark-blue m-0">{title}</h2>;
  }
  return (
    <h2 className="h4 fw-bold text-dark-blue m-0">
      Risultati della ricerca
      <span
        className="primary-color ms-2 text-sm fw-regular cursor-pointer"
        onClick={onReset}
      >
        Esci
      </span>
    </h2>
  );
};

type FilterBarProps = {
  title: string;
  hasActiveFilters: boolean;
  onReset: () => void;
  children: ReactNode;
};

const FilterBar = ({
  title,
  hasActiveFilters,
  onReset,
  children
}: FilterBarProps) => (
  <form>
    <div className="d-flex justify-content-between align-items-center">
      <FilterTitle
        title={title}
        hasActiveFilters={hasActiveFilters}
        onReset={onReset}
      />
      <div className="d-flex justify-content-end align-items-center flex-grow-1 flex-wrap gap-4">
        {children}
      </div>
    </div>
  </form>
);

export default FilterBar;
