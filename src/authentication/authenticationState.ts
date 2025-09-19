import * as z from "zod/mini";

// Merchant Info Schema
const merchantInfoSchema = z.object({
  organization_name: z.string(),
  organization_fiscal_code: z.string(),
  email: z.string(),
  token: z.string()
});

export type MerchantInfo = z.infer<typeof merchantInfoSchema>;

// Current Session Schema
const currentSessionSchema = z.union([
  z.object({
    type: z.literal("admin"),
    name: z.string()
  }),
  z.object({
    type: z.literal("user"),
    userFiscalCode: z.string(),
    merchantFiscalCode: z.optional(z.string())
  }),
  z.object({
    type: z.literal("none")
  })
]);

export type CurrentSession = z.infer<typeof currentSessionSchema>;

// User Session Schema
const userSessionSchema = z.object({
  token: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  exp: z.number(),
  merchants: z.array(merchantInfoSchema)
});

export type UserSession = z.infer<typeof userSessionSchema>;

// Admin Session Schema
const adminSessionSchema = z.object({
  token: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  exp: z.number()
});

export type AdminSession = z.infer<typeof adminSessionSchema>;

// Authentication State Schema
export const authenticationStateSchema = z.object({
  userNonceByState: z.record(
    z.string(),
    z.object({
      nonce: z.string(),
      exp: z.number()
    })
  ),
  userSessionByFiscalCode: z.record(z.string(), userSessionSchema),
  adminNonceByState: z.record(
    z.string(),
    z.object({
      nonce: z.string(),
      exp: z.number()
    })
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
  currentSession: { type: "none" }
};
