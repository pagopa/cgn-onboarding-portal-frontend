import * as z from "zod/mini";

export const envVariablesSchema = z.object({
  CGN_API_URL: z.string().check(z.minLength(1)),
  CGN_ONE_IDENTITY_CLIENT_ID: z.string().check(z.minLength(1)),
  CGN_ONE_IDENTITY_LOGIN_URI: z.string().check(z.minLength(1)),
  CGN_ONE_IDENTITY_REDIRECT_URI: z.string().check(z.minLength(1)),
  CGN_MSAL_CLIENT_ID: z.string().check(z.minLength(1)),
  CGN_MSAL_AUTHORITY: z.string().check(z.minLength(1)),
  CGN_MSAL_REDIRECT_URI: z.string().check(z.minLength(1)),
  CGN_IMAGE_BASE_URL: z.string().check(z.minLength(1)),
  CGN_RECAPTCHA_API_KEY: z.string().check(z.minLength(1)),
  CGN_ALLOW_MULTIPLE_LOGIN: z.optional(z.string()),
  CGN_FRONTEND_URL: z.optional(z.string()),
  CGN_API_PROXY_TARGET_URL: z.optional(z.string())
});
