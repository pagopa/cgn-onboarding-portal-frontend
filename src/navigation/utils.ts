export function getEditDiscountRoute(discountId: string): string {
  return `/admin/operatori/agevolazioni/modifica/${discountId}`;
}
export function getEditOperatorRoute(operatorFiscalCode: string): string {
  return `/admin/operatori/accessi/modifica/${operatorFiscalCode}`;
}
