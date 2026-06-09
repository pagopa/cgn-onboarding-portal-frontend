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
}: BadgePillProps) => (
  <Badge
    className="fw-normal badge cursor-pointer align-self-center"
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
