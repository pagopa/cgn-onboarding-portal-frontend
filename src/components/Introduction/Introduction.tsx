import { Nav } from "design-react-kit";
import { href } from "react-router";
import NavItem from "../NavItem";
import CgnLogo from "../Logo/CgnLogo";

type Props = {
  name: string;
};

const Introduction = ({ name }: Props) => (
  <section className="bg-white text-start">
    <div className="px-8 pt-10">
      <div className="row">
        <div className="col-9">
          <h1 className="h5">Carta Giovani Nazionale</h1>
          <h2 className="h2 text-dark-blue fw-bold">Portale Operatori</h2>
          <p className="dark-blue text-capitalize">{name}</p>
        </div>
        <div className="col-3 d-flex justify-content-end">
          <CgnLogo />
        </div>
      </div>
    </div>
    <Nav className="auto mt-11" tabs tag="ul" vertical={false}>
      <NavItem to={href("/operator/dashboard/profile")}>Profilo</NavItem>
      <NavItem to={href("/operator/dashboard/discounts")}>Opportunità</NavItem>
      <NavItem to={href("/operator/dashboard/data")}>
        Dati dell&apos;ente
      </NavItem>
    </Nav>
  </section>
);

export default Introduction;
