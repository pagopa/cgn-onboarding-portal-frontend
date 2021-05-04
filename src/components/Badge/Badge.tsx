import React from "react";

type Props = {
  children: string;
};

const Badge = ({ children }: Props) => (
  <span className="badge badge-pill">{children}</span>
);

export default Badge;
