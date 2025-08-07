import { href, Navigate } from "react-router";
import { useAuthentication } from "../authentication/AuthenticationContext";
import AdminPanel from "../pages/AdminPanel";

export default function Component() {
  const authentication = useAuthentication();
  if (authentication.currentSession.type !== "admin") {
    return <Navigate to={href("/login")} />;
  }
  return <AdminPanel />;
}
