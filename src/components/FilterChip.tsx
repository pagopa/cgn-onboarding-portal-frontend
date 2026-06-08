import { Badge, Icon } from "design-react-kit";

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick(): void;
  onClear(): void;
};

export const FilterChip = ({
  label,
  active,
  onClick,
  onClear
}: FilterChipProps) => (
  <Badge
    className="fw-normal badge cursor-pointer d-flex gap-1 align-items-center"
    pill
    tag="span"
    color="#5C6F82"
    style={{ backgroundColor: "#5C6F82", color: "white" }}
    onClick={onClick}
  >
    {label}
    {active && (
      <Icon
        color="white"
        icon="it-close"
        size="sm"
        onClick={e => {
          e.stopPropagation();
          onClear();
        }}
      />
    )}
  </Badge>
);
