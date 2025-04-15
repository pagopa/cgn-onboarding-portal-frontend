import { z } from "zod";

const merchantInfoSchema = z.object({
  organization_name: z.string(),
  organization_fiscal_code: z.string(),
  email: z.string(),
  token: z.string()
});

export type MerchantInfo = z.infer<typeof merchantInfoSchema>;

const currentSessionSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("admin"),
      name: z.string()
    }),
    z.object({
      type: z.literal("user"),
      userFiscalCode: z.string(),
      merchantFiscalCode: z.string().optional()
    })
  ])
  .nullable();

export type CurrentSession = z.infer<typeof currentSessionSchema>;

const userSessionSchema = z.object({
  token: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  exp: z.number(),
  merchants: z.array(merchantInfoSchema)
});

export type UserSession = z.infer<typeof userSessionSchema>;

const adminSessionSchema = z.object({
  token: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  exp: z.number()
});

export type AdminSession = z.infer<typeof adminSessionSchema>;

export const authenticationStateSchema = z.object({
  userNonceByState: z.record(
    z.string(),
    z.object({ nonce: z.string(), exp: z.number() })
  ),
  userSessionByFiscalCode: z.record(z.string(), userSessionSchema),
  adminNonceByState: z.record(
    z.string(),
    z.object({ nonce: z.string(), exp: z.number() })
  ),
  adminSessionByName: z.record(z.string(), adminSessionSchema),
  currentSession: currentSessionSchema
});

export type AuthenticationState = z.infer<typeof authenticationStateSchema>;

export const empty: AuthenticationState = {
  userNonceByState: {},
  userSessionByFiscalCode: {},
  adminNonceByState: {},
  adminSessionByName: {},
  currentSession: null
};

export function excludeExpiredTokens(
  data: AuthenticationState
): AuthenticationState {
  const now = Date.now() / 1000;
  return {
    ...data,
    userNonceByState: Object.fromEntries(
      Object.entries(data.userNonceByState).filter(([, { exp }]) => exp > now)
    ),
    adminNonceByState: Object.fromEntries(
      Object.entries(data.adminNonceByState).filter(([, { exp }]) => exp > now)
    ),
    userSessionByFiscalCode: Object.fromEntries(
      Object.entries(data.userSessionByFiscalCode).filter(
        ([, { exp }]) => exp > now
      )
    ),
    adminSessionByName: Object.fromEntries(
      Object.entries(data.adminSessionByName).filter(([, { exp }]) => exp > now)
    )
  };
}
