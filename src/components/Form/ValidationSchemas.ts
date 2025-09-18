import * as z from "zod/mini";
import {
  BucketCodeLoadStatus,
  DiscountCodeType,
  HelpRequestCategoryEnum,
  ProductCategory,
  SalesChannelType
} from "../../api/generated";
import { EntityType } from "../../api/generated_backoffice";
import { MAX_SELECTABLE_CATEGORIES } from "../../utils/constants";

const INCORRECT_EMAIL_ADDRESS = "L’indirizzo inserito non è corretto";
const INCORRECT_CONFIRM_EMAIL_ADDRESS = "I due indirizzi devono combaciare";
const REQUIRED_FIELD = "Campo obbligatorio";
const ONLY_NUMBER = "Solo numeri";
const ONLY_STRING = "Solo lettere";
const DISCOUNT_RANGE =
  "Lo sconto deve essere un numero intero compreso tra 1 e 100";
const PRODUCT_CATEGORIES_ONE = "Selezionare almeno una categoria merceologica";
const PRODUCT_CATEGORIES_MAX = `Selezionare al massimo ${MAX_SELECTABLE_CATEGORIES} categorie merceologiche`;
const INCORRECT_WEBSITE_URL =
  "L’indirizzo inserito non è corretto, inserire la URL comprensiva di protocollo";

const onlyAlphaRegex = /^[a-zA-Z\s]*$/;
const onlyNumberRegex = /^\d*$/;
const streetRegex = /^[A-Za-z0-9\s]*$/;
const zipCodeRegex = /^\d*$/;
const fiscalCodeRegex =
  /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/i; // NOSONAR: This is a secure regex to get an italian fiscal code

const undefinedRequired = () => REQUIRED_FIELD;

export const EmptyAddressValidationSchema = z.object({
  street: z.string().check(z.maxLength(0)),
  zipCode: z.string().check(z.maxLength(0)),
  city: z.string().check(z.maxLength(0)),
  district: z.string().check(z.maxLength(0)),
  coordinates: z.object({
    latitude: z.string().check(z.maxLength(0)),
    longitude: z.string().check(z.maxLength(0))
  })
});

const OptionalAddressValidationSchema = z.object({
  street: z.optional(z.string()),
  zipCode: z.optional(z.string()),
  city: z.optional(z.string()),
  district: z.optional(z.string()),
  coordinates: z.optional(
    z.object({
      latitude: z.optional(z.string()),
      longitude: z.optional(z.string())
    })
  )
});

export const AddressValidationSchema = z.object({
  street: z
    .string({ error: undefinedRequired })
    .check(
      z.trim(),
      z.regex(streetRegex, "Solo lettere o numeri"),
      z.minLength(1, REQUIRED_FIELD)
    ),
  zipCode: z
    .string({ error: undefinedRequired })
    .check(
      z.trim(),
      z.regex(zipCodeRegex, ONLY_NUMBER),
      z.minLength(5, "Deve essere di 5 caratteri"),
      z.maxLength(5, "Deve essere di 5 caratteri"),
      z.minLength(1, REQUIRED_FIELD)
    ),
  city: z
    .string({ error: undefinedRequired })
    .check(z.trim(), z.minLength(1, REQUIRED_FIELD)),
  district: z
    .string({ error: undefinedRequired })
    .check(z.trim(), z.minLength(1, REQUIRED_FIELD)),
  coordinates: z.optional(
    z.object({
      latitude: z.optional(z.string()),
      longitude: z.optional(z.string())
    })
  )
});

export const ReferentValidationSchema = z.object({
  firstName: z
    .string({ error: undefinedRequired })
    .check(
      z.trim(),
      z.regex(onlyAlphaRegex, ONLY_STRING),
      z.minLength(1, REQUIRED_FIELD)
    ),
  lastName: z
    .string({ error: undefinedRequired })
    .check(
      z.trim(),
      z.regex(onlyAlphaRegex, ONLY_STRING),
      z.minLength(1, REQUIRED_FIELD)
    ),
  role: z
    .string({ error: undefinedRequired })
    .check(
      z.regex(onlyAlphaRegex, ONLY_STRING),
      z.minLength(1, REQUIRED_FIELD)
    ),
  emailAddress: z
    .string()
    .check(z.email(INCORRECT_EMAIL_ADDRESS), z.minLength(1, REQUIRED_FIELD)),
  telephoneNumber: z
    .string({ error: undefinedRequired })
    .check(
      z.trim(),
      z.regex(onlyNumberRegex, ONLY_NUMBER),
      z.minLength(4, "Inserisci un numero di telefono valido"),
      z.minLength(1, REQUIRED_FIELD)
    )
});

export const SalesChannelValidationSchema = z
  .object({
    channelType: z.pipe(
      z.enum({ ...SalesChannelType, "": "" }),
      z.enum(SalesChannelType)
    ),
    websiteUrl: z.optional(
      z.string().check(
        z.url({
          error: INCORRECT_WEBSITE_URL,
          protocol: /^https?$/,
          hostname: z.regexes.domain
        })
      )
    ),
    discountCodeType: z.optional(
      z.enum({ ...DiscountCodeType, "": "" }, REQUIRED_FIELD)
    ),
    allNationalAddresses: z.boolean(),
    addresses: z.optional(z.array(OptionalAddressValidationSchema))
  })
  .check(ctx => {
    if (
      ctx.value.channelType === SalesChannelType.OnlineChannel ||
      ctx.value.channelType === SalesChannelType.BothChannels
    ) {
      if (!ctx.value.websiteUrl) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          input: ctx.value.websiteUrl,
          path: ["websiteUrl"],
          code: "custom",
          message: REQUIRED_FIELD
        });
      }
      if (!ctx.value.discountCodeType) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          input: ctx.value.discountCodeType,
          path: ["discountCodeType"],
          code: "custom",
          message: REQUIRED_FIELD
        });
      }
    }
    if (
      (ctx.value.channelType === SalesChannelType.OfflineChannel ||
        ctx.value.channelType === SalesChannelType.BothChannels) &&
      !ctx.value.allNationalAddresses
    ) {
      z.array(AddressValidationSchema)
        .check(z.minLength(1))
        .safeParse(ctx.value.addresses)
        .error?.issues.forEach(issue => {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(issue as any),
            path: ["addresses", ...issue.path]
          });
        });

      ctx.value.addresses?.forEach((address, index) => {
        if (Object.values(address).some(Boolean)) {
          AddressValidationSchema.safeParse(address).error?.issues.forEach(
            issue => {
              // eslint-disable-next-line functional/immutable-data
              ctx.issues.push({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(issue as any),
                path: ["addresses", index.toString(), ...issue.path]
              });
            }
          );
        }
      });
    }
  });

export const ProfileDataValidationSchema = z
  .object({
    hasDifferentName: z.optional(z.boolean()),
    name: z.optional(z.string({ error: undefinedRequired }).check(z.trim())),
    name_en: z.optional(z.string({ error: undefinedRequired }).check(z.trim())),
    name_de: z.optional(z.string({ error: undefinedRequired }).check(z.trim())),
    pecAddress: z
      .string()
      .check(z.email(INCORRECT_EMAIL_ADDRESS), z.minLength(1, REQUIRED_FIELD)),
    legalOffice: z
      .string({ error: undefinedRequired })
      .check(z.trim(), z.minLength(1, REQUIRED_FIELD)),
    telephoneNumber: z
      .string({ error: undefinedRequired })
      .check(
        z.trim(),
        z.regex(onlyNumberRegex, ONLY_NUMBER),
        z.minLength(4, "Inserisci un numero di telefono valido"),
        z.minLength(1, REQUIRED_FIELD)
      ),
    legalRepresentativeFullName: z
      .string({ error: undefinedRequired })
      .check(
        z.trim(),
        z.regex(onlyAlphaRegex, ONLY_STRING),
        z.minLength(1, REQUIRED_FIELD)
      ),
    legalRepresentativeTaxCode: z
      .string({ error: undefinedRequired })
      .check(
        z.trim(),
        z.minLength(4, "Inserisci un codice fiscale valido"),
        z.maxLength(20, "Deve essere al massimo di 20 caratteri"),
        z.minLength(1, REQUIRED_FIELD)
      ),
    referent: ReferentValidationSchema,
    secondaryReferents: z.array(ReferentValidationSchema),
    description: z
      .string({ error: undefinedRequired })
      .check(z.trim(), z.minLength(1, REQUIRED_FIELD)),
    description_en: z
      .string({ error: undefinedRequired })
      .check(z.trim(), z.minLength(1, REQUIRED_FIELD)),
    description_de: z
      .string({ error: undefinedRequired })
      .check(z.trim(), z.minLength(1, REQUIRED_FIELD)),
    salesChannel: SalesChannelValidationSchema
  })
  .check(ctx => {
    if (ctx.value.hasDifferentName) {
      if (!ctx.value.name) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          input: ctx.value.name,
          path: ["name"],
          code: "custom",
          message: REQUIRED_FIELD
        });
      }
      if (!ctx.value.name_en) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          input: ctx.value.name_en,
          path: ["name_en"],
          code: "custom",
          message: REQUIRED_FIELD
        });
      }
      if (!ctx.value.name_de) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          input: ctx.value.name_de,
          path: ["name_de"],
          code: "custom",
          message: REQUIRED_FIELD
        });
      }
    }
  });

const checkEycaLandingDifferentFromLandingPageUrl = (
  eycaLandingPageUrl: string | undefined,
  landingPageUrl: string | undefined
) =>
  !(
    eycaLandingPageUrl &&
    landingPageUrl &&
    eycaLandingPageUrl === landingPageUrl
  );

export const discountDataValidationSchema = (
  staticCheck: boolean,
  landingCheck: boolean,
  bucketCheck: boolean
) =>
  z
    .object({
      id: z.optional(z.string()),
      name: z
        .string({ error: undefinedRequired })
        .check(z.trim(), z.maxLength(100), z.minLength(1, REQUIRED_FIELD)),
      name_en: z
        .string({ error: undefinedRequired })
        .check(z.trim(), z.maxLength(100), z.minLength(1, REQUIRED_FIELD)),
      name_de: z
        .string({ error: undefinedRequired })
        .check(z.trim(), z.maxLength(100), z.minLength(1, REQUIRED_FIELD)),
      description: z.optional(z.string().check(z.maxLength(250))),
      description_en: z.optional(z.string().check(z.maxLength(250))),
      description_de: z.optional(z.string().check(z.maxLength(250))),
      discountUrl: z.union([
        z.string().check(z.trim(), z.maxLength(0, INCORRECT_WEBSITE_URL)),
        z.url({
          error: INCORRECT_WEBSITE_URL,
          protocol: /^https?$/,
          hostname: z.regexes.domain
        })
      ]),
      startDate: z.pipe(
        z.optional(z.date()),
        z.date({ error: undefinedRequired })
      ),
      endDate: z.pipe(
        z.optional(z.date()),
        z.date({ error: undefinedRequired })
      ),
      discount: z.pipe(
        z.string().check(z.trim()),
        z.transform((val, ctx) => {
          const num = Number(val);
          if (val === "") {
            return undefined;
          }
          if (Number.isInteger(num) && num > 1 && num < 100) {
            return num;
          } else {
            // eslint-disable-next-line functional/immutable-data
            ctx.issues.push({
              code: "custom",
              input: val,
              message: DISCOUNT_RANGE
            });
          }
          return isNaN(num) ? undefined : num;
        })
      ),
      productCategories: z.pipe(
        z.pipe(
          z.partialRecord(z.enum(ProductCategory), z.boolean()),
          z.transform(categories =>
            (Object.keys(categories) as Array<ProductCategory>).filter(
              category => categories[category]
            )
          )
        ),
        z
          .array(z.enum(ProductCategory, "Categoria merceologica non valida"))
          .check(
            z.minLength(1, PRODUCT_CATEGORIES_ONE),
            z.maxLength(MAX_SELECTABLE_CATEGORIES, PRODUCT_CATEGORIES_MAX)
          )
      ),
      condition: z.optional(z.string()),
      condition_en: z.optional(z.string()),
      condition_de: z.optional(z.string()),
      staticCode: z.optional(z.string()),
      landingPageUrl: z.union([
        z.string().check(z.trim(), z.maxLength(0, INCORRECT_WEBSITE_URL)),
        z.url({
          error: INCORRECT_WEBSITE_URL,
          protocol: /^https?$/,
          hostname: z.regexes.domain
        })
      ]),
      landingPageReferrer: z.optional(z.string()),
      lastBucketCodeLoadUid: z.optional(z.string()),
      lastBucketCodeLoadFileName: z.optional(z.string()),
      lastBucketCodeLoadStatus: z.optional(z.enum(BucketCodeLoadStatus)),
      visibleOnEyca: z.optional(z.boolean()),
      eycaLandingPageUrl: z.union([
        z.string().check(z.trim(), z.maxLength(0, INCORRECT_WEBSITE_URL)),
        z.url({
          error: INCORRECT_WEBSITE_URL,
          protocol: /^https?$/,
          hostname: z.regexes.domain
        })
      ])
    })
    // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
    .check(ctx => {
      // Description/condition required if their translations are present
      if (ctx.value.description_en?.trim() && !ctx.value.description?.trim()) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["description"],
          code: "custom",
          input: ctx.value.description,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.description?.trim() && !ctx.value.description_en?.trim()) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["description_en"],
          code: "custom",
          input: ctx.value.description_en,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.description?.trim() && !ctx.value.description_de?.trim()) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["description_de"],
          code: "custom",
          input: ctx.value.description_de,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.condition_en?.trim() && !ctx.value.condition?.trim()) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["condition"],
          code: "custom",
          input: ctx.value.condition,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.condition?.trim() && !ctx.value.condition_en?.trim()) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["condition_en"],
          code: "custom",
          input: ctx.value.condition_en,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.condition?.trim() && !ctx.value.condition_de?.trim()) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["condition_de"],
          code: "custom",
          input: ctx.value.condition_de,
          message: REQUIRED_FIELD
        });
      }
      if (staticCheck && !ctx.value.staticCode?.trim()) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["staticCode"],
          code: "custom",
          input: ctx.value.staticCode,
          message: REQUIRED_FIELD
        });
      }
      if (landingCheck) {
        if (!ctx.value.landingPageUrl) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["landingPageUrl"],
            code: "custom",
            input: ctx.value.landingPageUrl,
            message: REQUIRED_FIELD
          });
        }
        if (!ctx.value.landingPageReferrer) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["landingPageReferrer"],
            code: "custom",
            input: ctx.value.landingPageReferrer,
            message: REQUIRED_FIELD
          });
        }
      }
      if (bucketCheck) {
        if (!ctx.value.lastBucketCodeLoadUid) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["lastBucketCodeLoadUid"],
            code: "custom",
            input: ctx.value.lastBucketCodeLoadUid,
            message: REQUIRED_FIELD
          });
        }
        if (!ctx.value.lastBucketCodeLoadFileName) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["lastBucketCodeLoadFileName"],
            code: "custom",
            input: ctx.value.lastBucketCodeLoadFileName,
            message: REQUIRED_FIELD
          });
        }
      }
      if (ctx.value.visibleOnEyca && landingCheck) {
        if (!ctx.value.eycaLandingPageUrl) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["eycaLandingPageUrl"],
            code: "custom",
            input: ctx.value.eycaLandingPageUrl,
            message: REQUIRED_FIELD
          });
        }
        if (
          !checkEycaLandingDifferentFromLandingPageUrl(
            ctx.value.eycaLandingPageUrl ?? undefined,
            ctx.value.landingPageUrl ?? undefined
          )
        ) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["eycaLandingPageUrl"],
            code: "custom",
            input: ctx.value.eycaLandingPageUrl,
            message:
              "L'url della EYCA non può essere uguale all'url della landing page"
          });
        }
      }
    });

function helpTopicValidation(
  ctx: z.core.ParsePayload<{
    category: HelpRequestCategoryEnum;
    topic?: string;
  }>
) {
  if (
    ctx.value.category === HelpRequestCategoryEnum.Discounts ||
    ctx.value.category === HelpRequestCategoryEnum.Documents ||
    ctx.value.category === HelpRequestCategoryEnum.DataFilling
  ) {
    if (!ctx.value.topic) {
      // eslint-disable-next-line functional/immutable-data
      ctx.issues.push({
        path: ["topic"],
        code: "custom",
        input: ctx.value.topic,
        message: REQUIRED_FIELD
      });
    }
  }
}

export const loggedHelpValidationSchema = z
  .object({
    category: z.pipe(
      z.string(),
      z.enum(HelpRequestCategoryEnum, {
        error: REQUIRED_FIELD
      })
    ),
    topic: z.optional(z.string()),
    message: z
      .string({ error: undefinedRequired })
      .check(z.trim(), z.minLength(1, REQUIRED_FIELD))
  })
  .check(ctx => {
    helpTopicValidation(ctx);
  });

export const notLoggedHelpValidationSchema = z
  .object({
    category: z.pipe(
      z.string(),
      z.enum(HelpRequestCategoryEnum, {
        error: REQUIRED_FIELD
      })
    ),
    topic: z.optional(z.string()),
    message: z
      .string({ error: undefinedRequired })
      .check(z.trim(), z.minLength(1, REQUIRED_FIELD)),
    referentFirstName: z
      .string({ error: undefinedRequired })
      .check(
        z.trim(),
        z.regex(onlyAlphaRegex, ONLY_STRING),
        z.minLength(1, REQUIRED_FIELD)
      ),
    referentLastName: z
      .string({ error: undefinedRequired })
      .check(
        z.trim(),
        z.regex(onlyAlphaRegex, ONLY_STRING),
        z.minLength(1, REQUIRED_FIELD)
      ),
    legalName: z
      .string({ error: undefinedRequired })
      .check(
        z.trim(),
        z.regex(onlyAlphaRegex, ONLY_STRING),
        z.minLength(1, REQUIRED_FIELD)
      ),
    emailAddress: z
      .string()
      .check(z.email(INCORRECT_EMAIL_ADDRESS), z.minLength(1, REQUIRED_FIELD)),
    confirmEmailAddress: z.optional(
      z.string().check(z.email(INCORRECT_EMAIL_ADDRESS))
    ),
    recaptchaToken: z
      .string({ error: undefinedRequired })
      .check(z.trim(), z.minLength(1, REQUIRED_FIELD))
  })
  .check(ctx => {
    helpTopicValidation(ctx);
    if (ctx.value.emailAddress && ctx.value.confirmEmailAddress) {
      if (ctx.value.emailAddress !== ctx.value.confirmEmailAddress) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["confirmEmailAddress"],
          code: "custom",
          input: ctx.value.confirmEmailAddress,
          message: INCORRECT_CONFIRM_EMAIL_ADDRESS
        });
      }
    }
  });

export const activationValidationSchema = z.object({
  keyOrganizationFiscalCode: z.optional(z.string()),
  organizationFiscalCode: z
    .string({ error: undefinedRequired })
    .check(z.trim(), z.minLength(1, REQUIRED_FIELD)),
  organizationName: z
    .string({ error: undefinedRequired })
    .check(z.trim(), z.minLength(1, REQUIRED_FIELD)),
  pec: z
    .string()
    .check(z.email(INCORRECT_EMAIL_ADDRESS), z.minLength(1, REQUIRED_FIELD)),
  referents: z.pipe(
    z
      .array(
        z.object({
          fiscalCode: z
            .string({ error: undefinedRequired })
            .check(
              z.trim(),
              z.minLength(4, "Deve essere al minimo di 4 caratteri"),
              z.maxLength(20, "Deve essere al massimo di 20 caratteri"),
              z.regex(
                fiscalCodeRegex,
                "Il codice fiscale inserito non è corretto"
              ),
              z.minLength(1, REQUIRED_FIELD)
            )
        })
      )
      .check(z.minLength(1, REQUIRED_FIELD)),
    z.transform(val => val.map(item => item.fiscalCode))
  ),
  insertedAt: z.optional(z.string()),
  entityType: z.pipe(z.optional(z.string()), z.enum(EntityType, REQUIRED_FIELD))
});
