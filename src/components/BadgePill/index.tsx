import { Badge, Icon } from "design-react-kit";

const colorMap = {
  warning: "#995C00",
  primary: "#0066CC",
  secondary: "#5C6F82",
  success: "#008055",
  danger: "#CC334D"
} as const;

export type BadgeColor = keyof typeof colorMap;

type BadgePillProps = {
  label: string;
  color: BadgeColor;
  onClick?: () => void;
  active?: boolean;
  onClear?: () => void;
};

export const BadgePill = ({
  label,
  color,
  onClick,
  active,
  onClear
}: BadgePillProps) => {
  const className = [
    "fw-normal",
    "align-self-center",
    onClick && "badge-pointer"
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Badge
      className={className}
      pill
      tag="span"
      color={colorMap[color]}
      style={{ backgroundColor: colorMap[color], color: "white" }}
      onClick={onClick}
    >
      {label}
      {active && onClear && (
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
};
