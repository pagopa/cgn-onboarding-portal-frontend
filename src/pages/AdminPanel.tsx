import { Outlet } from "react-router";
import Layout from "../components/Layout/Layout";
import { ContainerFluid } from "../components/Container/Container";
import IntroductionAdmin from "../components/Introduction/IntroductionAdmin";
import { useAuthentication } from "../authentication/AuthenticationContext";

const AdminPanel = () => {
  const authentication = useAuthentication();
  const user = authentication.currentAdminSession;

  return (
    <Layout>
      <ContainerFluid className="mt-10 mb-20" maxWidth="1200px">
        <div className="col-12">
          <IntroductionAdmin
            name={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
          />
          <Outlet />
        </div>
      </ContainerFluid>
    </Layout>
  );
};

export default AdminPanel;
