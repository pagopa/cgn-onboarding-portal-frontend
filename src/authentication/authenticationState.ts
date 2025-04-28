import * as Yup from "yup";
import { YupLiteral, YupRecord, YupUnion } from "../utils/yupUtils";

const merchantInfoSchema = Yup.object({
  organization_name: Yup.string().required(),
  organization_fiscal_code: Yup.string().required(),
  email: Yup.string().required(),
  token: Yup.string().required()
}).required();

export type MerchantInfo = Yup.InferType<typeof merchantInfoSchema>;

const currentSessionSchema = YupUnion([
  Yup.object({
    type: YupLiteral("admin").required(),
    name: Yup.string().required()
  }).required(),
  Yup.object({
    type: YupLiteral("user").required(),
    userFiscalCode: Yup.string().required(),
    merchantFiscalCode: Yup.string().optional()
  }).required(),
  Yup.object({
    type: YupLiteral("none").required()
  }).required()
]).required();

export type CurrentSession = Yup.InferType<typeof currentSessionSchema>;

const userSessionSchema = Yup.object({
  token: Yup.string().required(),
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  exp: Yup.number().required(),
  merchants: Yup.array(merchantInfoSchema).required()
}).required();

export type UserSession = Yup.InferType<typeof userSessionSchema>;

const adminSessionSchema = Yup.object({
  token: Yup.string().required(),
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  exp: Yup.number().required()
}).required();

export type AdminSession = Yup.InferType<typeof adminSessionSchema>;

export const authenticationStateSchema = Yup.object({
  userNonceByState: YupRecord(
    Yup.object({
      nonce: Yup.string().required(),
      exp: Yup.number().required()
    }).required()
  ).required(),
  userSessionByFiscalCode: YupRecord(userSessionSchema).required(),
  adminNonceByState: YupRecord(
    Yup.object({
      nonce: Yup.string().required(),
      exp: Yup.number().required()
    }).required()
  ).required(),
  adminSessionByName: YupRecord(adminSessionSchema).required(),
  currentSession: currentSessionSchema
}).required();

export type AuthenticationState = Yup.InferType<
  typeof authenticationStateSchema
>;

export const empty: AuthenticationState = {
  userNonceByState: {},
  userSessionByFiscalCode: {},
  adminNonceByState: {},
  adminSessionByName: {},
  currentSession: { type: "none" }
};
