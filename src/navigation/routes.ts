import { getEditDiscountRoute, getEditOperatorRoute } from "./utils";

export const LOGIN = "/admin/operatori/login";
export const LOGIN_REDIRECT = "/session";
export const DASHBOARD = "/admin/operatori/home";
export const HELP = "/admin/operatori/serve-aiuto";
export const CREATE_PROFILE = "/admin/operatori/richiesta-convenzione";
export const EDIT_PROFILE = "/admin/operatori/dati-operatore/modifica";
export const CREATE_DISCOUNT = "/admin/operatori/agevolazioni/crea";
export const EDIT_DISCOUNT = getEditDiscountRoute(":discountId");
export const EDIT_OPERATOR_DATA = "/admin/operatori/profilo/modifica";
export const REJECT_PROFILE = "/admin/operatori/profilo/rifiutato";
export const ADMIN_PANEL_RICHIESTE = "/admin/operatori/richieste";
export const ADMIN_PANEL_CONVENZIONATI =
  "/admin/operatori/operatori-convenzionati";
export const ADMIN_PANEL_ACCESSI = "/admin/operatori/accessi";
export const ADMIN_PANEL_ACCESSI_EDIT = getEditOperatorRoute(
  ":operatorFiscalCode"
);
export const ADMIN_PANEL_ACCESSI_CREA = "/admin/operatori/accessi/crea";
