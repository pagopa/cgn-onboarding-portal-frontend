import React from "react";

type Props = {
  size?: "sm" | "base";
  color?: "black" | "white" | "blue" | "dark-blue" | "gray";
  weight?: "light" | "bold" | "semibold" | "normal";
  children: string;
};

const Paragraph = ({
  size = "base",
  color = "black",
  weight = "normal",
  children
}: Props) => (
  <p className={`text-${size} text-${color} font-weight-${weight}`}>
    {children}
  </p>
);

export default Paragraph;
