import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { ContainerFluid } from "../components/Container/Container";
import IntroductionAdmin from "../components/Introduction/IntroductionAdmin";
import Requests from "../components/Requests/Requests";
import OperatorConvention from "../components/OperatorConvention/OperatorConvention";
import {
  ADMIN_PANEL_RICHIESTE,
  ADMIN_PANEL_CONVENZIONATI,
  ADMIN_PANEL_ACCESSI
} from "../navigation/routes";
import OperatorActivations from "../components/OperatorActivations/OperatorActivations";
import { useAuthentication } from "../authentication/AuthenticationContext";

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const authentication = useAuthentication();
  const user = authentication.currentAdminSession;

  const handleClick = (newTab: string) => {
    navigate(newTab);
  };

  const selectedTab = () => {
    switch (location.pathname) {
      case ADMIN_PANEL_RICHIESTE:
        return <Requests />;
      case ADMIN_PANEL_CONVENZIONATI:
        return <OperatorConvention />;
      case ADMIN_PANEL_ACCESSI:
        return <OperatorActivations />;
      default:
        return <div>error</div>;
    }
  };

  return (
    <Layout>
      <ContainerFluid
        className="d-flex flex-column gap-6 mt-10 mb-20"
        maxWidth="1200px"
      >
        <IntroductionAdmin
          name={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
          handleClick={handleClick}
          activeTab={location.pathname}
        />
        {selectedTab()}
      </ContainerFluid>
    </Layout>
  );
};

export default AdminPanel;
