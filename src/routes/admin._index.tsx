import { href, Navigate } from "react-router";

export default function Component() {
  return <Navigate to={href("/admin/requests")} />;
}
