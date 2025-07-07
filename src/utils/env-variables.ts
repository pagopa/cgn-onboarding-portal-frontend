import { z } from "zod/v4";

export const envVariablesSchema = z.object({
  CGN_API_URL: z.string().nonempty(),
  CGN_ONE_IDENTITY_CLIENT_ID: z.string().nonempty(),
  CGN_ONE_IDENTITY_LOGIN_URI: z.string().nonempty(),
  CGN_ONE_IDENTITY_REDIRECT_URI: z.string().nonempty(),
  CGN_MSAL_CLIENT_ID: z.string().nonempty(),
  CGN_MSAL_AUTHORITY: z.string().nonempty(),
  CGN_MSAL_REDIRECT_URI: z.string().nonempty(),
  CGN_IMAGE_BASE_URL: z.string().nonempty(),
  CGN_RECAPTCHA_API_KEY: z.string().nonempty(),
  CGN_ALLOW_MULTIPLE_LOGIN: z.string().optional(),
  CGN_FRONTEND_URL: z.string().optional(),
  CGN_API_PROXY_TARGET_URL: z.string().optional()
});
