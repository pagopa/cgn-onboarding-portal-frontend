import EditActivation from "../pages/EditActivation";
import { Route } from "./+types/admin.access.edit.$fiscalCode";

export default function Component({
  params: { fiscalCode }
}: Route.ComponentProps) {
  return <EditActivation fiscalCode={fiscalCode} />;
}
