import React from "react";
import Badge from "design-react-kit";

type Props = {
  children: string;
};

const Badge = ({ children }: Props) => (
  <span className="badge badge-pill">{children}</span>
);

export default Badge;
