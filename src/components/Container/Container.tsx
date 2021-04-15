import React from "react";

type Props = {
  className?: string;
  children: any;
};

const Container = ({ className = "", children }: Props) => (
  <div className="container">
    <div className={`${className} row variable-gutters`}>{children}</div>
  </div>
);

export default Container;
