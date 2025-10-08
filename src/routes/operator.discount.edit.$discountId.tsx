import EditDiscount from "../pages/EditDiscount";
import { Route } from "./+types/operator.discount.edit.$discountId";

export default function Component({
  params: { discountId }
}: Route.ComponentProps) {
  return <EditDiscount discountId={discountId} />;
}
