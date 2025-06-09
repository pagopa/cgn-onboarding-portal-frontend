import { Nav } from "design-react-kit";
import NavItem from "../NavItem";
import CgnLogo from "../Logo/CgnLogo";

type Props = {
  name: string;
  activeTab: number;
  handleClick(activeTab: number): void;
};

const Introduction = ({ name, activeTab, handleClick }: Props) => (
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
      <NavItem active={activeTab === 0} onClick={() => handleClick(0)}>
        Profilo
      </NavItem>
      <NavItem active={activeTab === 1} onClick={() => handleClick(1)}>
        Opportunità
      </NavItem>
      <NavItem active={activeTab === 2} onClick={() => handleClick(2)}>
        Dati dell&apos;ente
      </NavItem>
    </Nav>
  </section>
);

export default Introduction;
