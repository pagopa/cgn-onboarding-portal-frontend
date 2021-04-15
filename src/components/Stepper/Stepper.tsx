import React from "react";

type Props = {
  children: any;
};

const Stepper = ({ children }: Props) => (
  <div className="mt-4 steppers bg-white">
    <ul className="steppers-header">
      {children}
      <li className="steppers-index" aria-hidden="true">
        <span>1</span> <span className="active">2</span> <span>3</span>{" "}
        <span>4</span>
      </li>
    </ul>
  </div>
);

export default Stepper;
