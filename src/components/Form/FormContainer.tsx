import { ReactNode } from "react";
import Container from "../Container/Container";

type Props = {
  className?: string;
  children: ReactNode;
};

const FormContainer = ({ className = "", children }: Props) => (
  <Container>
    <div className={`${className} col-12 px-12`}>{children}</div>
  </Container>
);

export default FormContainer;
