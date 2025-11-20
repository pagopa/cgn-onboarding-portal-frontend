import { href, Navigate, Outlet } from "react-router";
import { useAuthentication } from "../authentication/AuthenticationContext";
import Layout from "../components/Layout/Layout";

export default function Component() {
  const authentication = useAuthentication();
  if (authentication.currentSession.type !== "admin") {
    return <Navigate to={href("/login")} />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
