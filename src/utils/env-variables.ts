import * as Yup from "yup";

export const envVariablesSchema = Yup.object({
  CGN_FRONTEND_URL: Yup.string().required(),
  CGN_API_URL: Yup.string().required(),
  CGN_ONE_IDENTITY_CLIENT_ID: Yup.string().required(),
  CGN_ONE_IDENTITY_LOGIN_URI: Yup.string().required(),
  CGN_ONE_IDENTITY_REDIRECT_URI: Yup.string().required(),
  CGN_MSAL_CLIENT_ID: Yup.string().required(),
  CGN_MSAL_AUTHORITY: Yup.string().required(),
  CGN_MSAL_REDIRECT_URI: Yup.string().required(),
  CGN_IMAGE_BASE_URL: Yup.string().required(),
  CGN_RECAPTCHA_API_KEY: Yup.string().required()
}).required();

export type EnvVariables = Readonly<Yup.InferType<typeof envVariablesSchema>>;
