import { z } from "zod";

export const envVariablesSchema = z.object({
  CGN_API_URL: z.string().min(1),
  CGN_ONE_IDENTITY_CLIENT_ID: z.string().min(1),
  CGN_ONE_IDENTITY_LOGIN_URI: z.string().min(1),
  CGN_ONE_IDENTITY_REDIRECT_URI: z.string().min(1),
  CGN_MSAL_CLIENT_ID: z.string().min(1),
  CGN_MSAL_AUTHORITY: z.string().min(1),
  CGN_MSAL_REDIRECT_URI: z.string().min(1),
  CGN_IMAGE_BASE_URL: z.string().min(1),
  CGN_RECAPTCHA_API_KEY: z.string().min(1),
  CGN_ALLOW_MULTIPLE_LOGIN: z.string().optional(),
  CGN_FRONTEND_URL: z.string().optional(),
  CGN_API_PROXY_TARGET_URL: z.string().optional()
});
