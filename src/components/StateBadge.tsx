import { Badge } from "design-react-kit";

const colorMap = {
  warning: "#995C00",
  primary: "#0066CC",
  secondary: "#5C6F82",
  success: "#008055",
  danger: "#CC334D"
} as const;

export type BadgeColor = keyof typeof colorMap;

type StateBadgeProps = {
  label: string;
  color: BadgeColor;
};

export const StateBadge = ({ label, color }: StateBadgeProps) => (
  <Badge
    className="fw-normal badge"
    pill
    tag="span"
    color={colorMap[color]}
    style={{
      backgroundColor: colorMap[color],
      color: "white"
    }}
  >
    {label}
  </Badge>
);
