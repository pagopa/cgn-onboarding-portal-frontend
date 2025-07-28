import { href, Navigate } from "react-router";
import { useAuthentication } from "../authentication/AuthenticationContext";

export default function Component() {
  const authentication = useAuthentication();

  switch (authentication.currentSession.type) {
    case "user": {
      return <Navigate to={href("/operator")} />;
    }
    case "admin": {
      return <Navigate to={href("/admin")} />;
    }
    case "none": {
      return <Navigate to={href("/login")} />;
    }
  }
}
