import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  maxWidth?: string;
};

const Container = ({ className = "", children }: Props) => (
  <div className="container">
    <div className={`${className} row variable-gutters`}>{children}</div>
  </div>
);

export function ContainerFluid({ className = "", maxWidth, children }: Props) {
  return (
    <div className="container-fluid" style={{ maxWidth }}>
      <div className={`${className} row variable-gutters`}>{children}</div>
    </div>
  );
}

export default Container;
