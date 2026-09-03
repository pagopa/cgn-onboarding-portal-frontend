import { Nav } from "design-react-kit";
import NavItem from "../NavItem";
import CgnLogo from "../Logo/CgnLogo";
import { DashboardTab } from "../../pages/Dashboard";

type Props = {
  name: string;
  activeTab: DashboardTab;
  handleClick(activeTab: DashboardTab): void;
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
      <NavItem
        active={activeTab === "profileData"}
        onClick={() => handleClick("profileData")}
      >
        Profilo
      </NavItem>
      <NavItem
        active={activeTab === "discounts"}
        onClick={() => handleClick("discounts")}
      >
        Opportunità
      </NavItem>
      <NavItem
        active={activeTab === "profile"}
        onClick={() => handleClick("profile")}
      >
        Dati dell&apos;ente
      </NavItem>
    </Nav>
  </section>
);

export default Introduction;
